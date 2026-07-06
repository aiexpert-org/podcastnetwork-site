"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import pnGraph from "../../../data/pn-entity-graph.json";
import type { EntityGraph } from "@/lib/entity-graph";

const EntityGraphHero = dynamic(
  () =>
    import("@/components/hero/EntityGraphHero").then((m) => m.EntityGraphHero),
  { ssr: false, loading: () => <div style={{ height: 380 }} /> },
);

const BOOK_ID = "https://podcastnetwork.org/book/#book";

/**
 * The AI or Die node neighborhood: the book node plus everything within one
 * hop, rendered on the dark viz surface.
 */
export function AiOrDieGraphInset() {
  const graph = pnGraph as unknown as EntityGraph;

  const subgraph = useMemo(() => {
    const keep = new Set<string>([BOOK_ID]);
    for (const e of graph.edges) {
      if (e.source === BOOK_ID) keep.add(e.target);
      if (e.target === BOOK_ID) keep.add(e.source);
    }
    // One more hop from the authors so the founders' orgs appear.
    const firstHop = [...keep];
    for (const e of graph.edges) {
      if (firstHop.includes(e.source) && e.type === "founderOf") {
        keep.add(e.target);
      }
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
      <div className="h-[420px]">
        <EntityGraphHero
          graph={subgraph}
          height="100%"
          minHeight="420px"
          ariaLabel={`AI or Die entity neighborhood: ${subgraph.nodes.length} connected entities.`}
        />
      </div>
    </div>
  );
}
