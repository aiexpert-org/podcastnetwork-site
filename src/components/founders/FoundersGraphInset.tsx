"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import pnGraph from "../../../data/pn-entity-graph.json";
import type { EntityGraph } from "@/lib/entity-graph";

const EntityGraphHero = dynamic(
  () =>
    import("@/components/hero/EntityGraphHero").then((m) => m.EntityGraphHero),
  { ssr: false, loading: () => <div style={{ height: 420 }} /> },
);

const BRETT_ID = "https://podcastnetwork.org/about/#brett-k-moore";
const MIKE_ID = "https://podcastnetwork.org/about/#mike-partners";

/** Brett + Mike and everything one hop out: the founder entity subgraph. */
export function FoundersGraphInset() {
  const graph = pnGraph as unknown as EntityGraph;

  const subgraph = useMemo(() => {
    const keep = new Set<string>([BRETT_ID, MIKE_ID]);
    for (const e of graph.edges) {
      if (e.source === BRETT_ID || e.source === MIKE_ID) keep.add(e.target);
      if (e.target === BRETT_ID || e.target === MIKE_ID) keep.add(e.source);
    }
    return {
      nodes: graph.nodes.filter((n) => keep.has(n.id)),
      edges: graph.edges.filter(
        (e) => keep.has(e.source) && keep.has(e.target),
      ),
    };
  }, [graph]);

  return (
    <div className="border-y border-viz-border bg-viz-ink py-6">
      <div className="h-[460px]">
        <EntityGraphHero
          graph={subgraph}
          height="100%"
          minHeight="460px"
          ariaLabel={`Founder entity graph: Brett K Moore and Mike Partners connected to ${subgraph.nodes.length - 2} entities.`}
        />
      </div>
    </div>
  );
}
