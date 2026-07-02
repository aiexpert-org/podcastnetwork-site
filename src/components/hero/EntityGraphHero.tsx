"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  applyNodeChanges,
  type Edge,
  type Node,
  type NodeChange,
  type NodeTypes,
  type ReactFlowInstance,
  type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
  type SimulationLinkDatum,
} from "d3-force";
import { AnimatePresence } from "framer-motion";
import {
  DARK_EDGE_COLORS,
  describeGraph,
  nodeSize,
  type EntityGraph,
  type EntityNode as EntityNodeType,
} from "@/lib/entity-graph";
import { EntityGraphNode } from "./EntityGraphNode";
import { EntityNodeDetail } from "./EntityNodeDetail";
import type { EntityNodeData, SimNode } from "./graph-types";

const nodeTypes: NodeTypes = { entity: EntityGraphNode };

type EntityGraphHeroProps = {
  graph: EntityGraph;
  /** When provided, only these ids render (playhead filtering). Simulation
   * always runs on the full graph so positions stay stable across scrubs. */
  visibleNodeIds?: string[] | null;
  visibleEdgeIds?: string[] | null;
  height?: string;
  minHeight?: string;
  interactive?: boolean;
  onNodeClick?: (node: EntityNodeType) => void;
  simulationConfig?: {
    linkDistance?: number;
    chargeStrength?: number;
    centerStrength?: number;
  };
  className?: string;
  ariaLabel?: string;
};

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function GraphInner({
  graph,
  visibleNodeIds,
  visibleEdgeIds,
  height = "70vh",
  minHeight = "520px",
  interactive = true,
  onNodeClick,
  simulationConfig,
  ariaLabel,
}: EntityGraphHeroProps) {
  const reducedMotion = useReducedMotion();
  const simRef = useRef<Simulation<SimNode, SimulationLinkDatum<SimNode>> | null>(null);
  const simNodesRef = useRef<Map<string, SimNode>>(new Map());
  const flowRef = useRef<ReactFlowInstance | null>(null);
  const rafRef = useRef<number>(0);
  const [rfNodes, setRfNodes] = useState<Node<EntityNodeData>[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleNodeSet = useMemo(
    () => (visibleNodeIds ? new Set(visibleNodeIds) : null),
    [visibleNodeIds],
  );
  const visibleEdgeSet = useMemo(
    () => (visibleEdgeIds ? new Set(visibleEdgeIds) : null),
    [visibleEdgeIds],
  );

  /** Adjacency for hover dimming. */
  const neighbors = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const e of graph.edges) {
      if (!map.has(e.source)) map.set(e.source, new Set());
      if (!map.has(e.target)) map.set(e.target, new Set());
      map.get(e.source)!.add(e.target);
      map.get(e.target)!.add(e.source);
    }
    return map;
  }, [graph.edges]);

  const graphKey = useMemo(
    () => graph.nodes.map((n) => n.id).join("|"),
    [graph.nodes],
  );

  const syncPositions = useCallback(() => {
    setRfNodes((prev) =>
      prev.map((rf) => {
        const sim = simNodesRef.current.get(rf.id);
        return sim ? { ...rf, position: { x: sim.x ?? 0, y: sim.y ?? 0 } } : rf;
      }),
    );
  }, []);

  /** Build (or rebuild) the D3 simulation whenever the underlying graph
   * identity changes. Runs on the FULL graph regardless of visibility. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const simNodes: SimNode[] = graph.nodes.map((entity, i) => {
      const existing = simNodesRef.current.get(entity.id);
      const angle = (i / Math.max(graph.nodes.length, 1)) * Math.PI * 2;
      return {
        id: entity.id,
        entity,
        x: existing?.x ?? Math.cos(angle) * 640,
        y: existing?.y ?? Math.sin(angle) * 640,
        vx: 0,
        vy: 0,
      };
    });
    simNodesRef.current = new Map(simNodes.map((n) => [n.id, n]));

    const links: SimulationLinkDatum<SimNode>[] = graph.edges
      .filter(
        (e) =>
          simNodesRef.current.has(e.source) && simNodesRef.current.has(e.target),
      )
      .map((e) => ({ source: e.source, target: e.target }));

    const cfg = {
      linkDistance: simulationConfig?.linkDistance ?? 110,
      chargeStrength: simulationConfig?.chargeStrength ?? -320,
      centerStrength: simulationConfig?.centerStrength ?? 0.08,
    };

    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        "link",
        forceLink<SimNode, SimulationLinkDatum<SimNode>>(links)
          .id((d) => d.id)
          .distance(cfg.linkDistance)
          .strength(0.5),
      )
      .force(
        "charge",
        forceManyBody<SimNode>().strength(
          (d) => cfg.chargeStrength * Math.sqrt((d.entity.weight ?? 5) / 5),
        ),
      )
      .force("center", forceCenter(0, 0).strength(cfg.centerStrength))
      .force(
        "collide",
        forceCollide<SimNode>((d) => nodeSize(d.entity) / 2 + 28),
      );

    // Compute the layout synchronously instead of relying on d3-timer's
    // requestAnimationFrame loop (throttled to zero in background tabs, and
    // avoids five seconds of 60fps re-renders on load). ~300 ticks converges
    // the 30-node graph in well under a frame budget.
    sim.stop();
    sim.tick(300);
    simRef.current = sim;
    syncPositions();

    return () => {
      cancelAnimationFrame(rafRef.current);
      sim.stop();
    };
  }, [graphKey, reducedMotion, simulationConfig, syncPositions]);

  /** Manual reheat loop for drag interactions: step the simulation one tick
   * per animation frame until it cools. */
  const kick = useCallback(
    (alpha: number) => {
      const sim = simRef.current;
      if (!sim) return;
      sim.alpha(Math.max(sim.alpha(), alpha));
      cancelAnimationFrame(rafRef.current);
      const step = () => {
        const s = simRef.current;
        if (!s || s.alpha() < 0.02) return;
        s.tick();
        syncPositions();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [syncPositions],
  );

  /** Project sim nodes into React Flow nodes whenever visibility, hover, or
   * the graph changes. */
  useEffect(() => {
    const visible = graph.nodes.filter(
      (n) => !visibleNodeSet || visibleNodeSet.has(n.id),
    );
    const hoveredNeighbors = hoveredId ? neighbors.get(hoveredId) : null;

    setRfNodes(
      visible.map((entity, i) => {
        const sim = simNodesRef.current.get(entity.id);
        const dimmed = Boolean(
          hoveredId &&
            hoveredId !== entity.id &&
            !(hoveredNeighbors && hoveredNeighbors.has(entity.id)),
        );
        return {
          id: entity.id,
          type: "entity",
          position: { x: sim?.x ?? 0, y: sim?.y ?? 0 },
          draggable: interactive,
          ariaLabel: `${entity.type}: ${entity.label}. Connected to ${
            neighbors.get(entity.id)?.size ?? 0
          } entities.`,
          data: {
            entity,
            dimmed,
            order: i,
            reducedMotion,
            hasVerifiedBadge: Boolean(entity.sameAs && entity.sameAs.length > 0),
          },
        };
      }),
    );
  }, [
    graph.nodes,
    visibleNodeSet,
    hoveredId,
    neighbors,
    interactive,
    reducedMotion,
  ]);

  /** Refit the viewport when the visible set changes (playhead scrubs). */
  const visibleCount = visibleNodeSet ? visibleNodeSet.size : graph.nodes.length;
  useEffect(() => {
    if (!flowRef.current) return;
    const t = setTimeout(() => {
      flowRef.current?.fitView({
        padding: 0.18,
        duration: reducedMotion ? 0 : 500,
        maxZoom: 1.1,
      });
    }, 60);
    return () => clearTimeout(t);
  }, [visibleCount, reducedMotion]);

  const rfEdges: Edge[] = useMemo(() => {
    const hoveredNeighborEdges = hoveredId
      ? new Set(
          graph.edges
            .filter((e) => e.source === hoveredId || e.target === hoveredId)
            .map((e) => e.id),
        )
      : null;

    return graph.edges
      .filter(
        (e) =>
          (!visibleEdgeSet || visibleEdgeSet.has(e.id)) &&
          (!visibleNodeSet ||
            (visibleNodeSet.has(e.source) && visibleNodeSet.has(e.target))),
      )
      .map((e, i) => {
        const color = DARK_EDGE_COLORS[e.type];
        const emphasized = hoveredNeighborEdges?.has(e.id);
        const faded = hoveredNeighborEdges && !emphasized;
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          type: "default",
          style: {
            stroke: color,
            strokeWidth: emphasized ? 2.5 : 1.4,
            strokeDasharray: e.type === "sameAs" ? "5 5" : undefined,
            opacity: faded ? 0.18 : emphasized ? 0.95 : 0.55,
            transition: "opacity 200ms ease, stroke-width 200ms ease",
            animation: reducedMotion
              ? undefined
              : `pn-edge-in 500ms ease ${Math.min(i * 30, 900) + 600}ms both`,
          },
        };
      });
  }, [
    graph.edges,
    visibleEdgeSet,
    visibleNodeSet,
    hoveredId,
    reducedMotion,
  ]);

  const selectedNode = selectedId
    ? (graph.nodes.find((n) => n.id === selectedId) ?? null)
    : null;

  /** Controlled-mode requirement: apply RF's dimension/position changes so
   * node measurements land and edges can render. */
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setRfNodes((nds) => applyNodeChanges(changes, nds) as Node<EntityNodeData>[]);
  }, []);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (!interactive) return;
      setSelectedId(node.id);
      const entity = simNodesRef.current.get(node.id)?.entity;
      if (entity && onNodeClick) onNodeClick(entity);
    },
    [interactive, onNodeClick],
  );

  const handleNodeDrag: NodeMouseHandler = useCallback(
    (_, node) => {
      const sim = simNodesRef.current.get(node.id);
      if (sim) {
        sim.fx = node.position.x;
        sim.fy = node.position.y;
        kick(0.25);
      }
    },
    [kick],
  );

  const handleNodeDragStop: NodeMouseHandler = useCallback(
    (_, node) => {
      const sim = simNodesRef.current.get(node.id);
      if (sim) {
        sim.fx = null;
        sim.fy = null;
        kick(0.3);
      }
    },
    [kick],
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height, minHeight }}
      aria-label={
        ariaLabel ??
        `Interactive entity graph. ${describeGraph(graph)} Tab to focus a node, Enter to open detail.`
      }
      role="figure"
    >
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodesChange}
        onInit={(instance) => {
          flowRef.current = instance;
          instance.fitView({ padding: 0.18, maxZoom: 1.0 });
        }}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={(_, node) => interactive && setHoveredId(node.id)}
        onNodeMouseLeave={() => setHoveredId(null)}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        onPaneClick={() => setSelectedId(null)}
        fitView
        minZoom={0.4}
        maxZoom={2}
        zoomOnScroll={false}
        zoomOnPinch
        panOnDrag={interactive}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesFocusable={interactive}
        edgesFocusable={false}
        style={{ background: "transparent" }}
      />
      <AnimatePresence>
        {selectedNode && (
          <EntityNodeDetail
            node={selectedNode}
            edges={graph.edges}
            allNodes={graph.nodes}
            onClose={() => setSelectedId(null)}
            onSelectNode={(id) => setSelectedId(id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export function EntityGraphHero(props: EntityGraphHeroProps) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
}
