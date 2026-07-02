"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import pnGraph from "../../../data/pn-entity-graph.json";
import pnKeyframes from "../../../data/pn-playhead-keyframes.json";
import type { EntityGraph, Keyframe } from "@/lib/entity-graph";
import { visibleSetsAtDay } from "@/lib/compute-graph-at-day";
import { usePlayhead, FULL_DAY } from "@/components/demo/PlayheadContext";
import { SixMonthPlayhead } from "@/components/demo/SixMonthPlayhead";
import { Container } from "@/components/layout/Container";

const EntityGraphHero = dynamic(
  () =>
    import("@/components/hero/EntityGraphHero").then((m) => m.EntityGraphHero),
  { ssr: false, loading: () => <div style={{ height: "44vh" }} /> },
);

const graph = pnGraph as unknown as EntityGraph;
const keyframes = (pnKeyframes as { keyframes: Keyframe[] }).keyframes;

/**
 * /the-method/ interactive band: the persistent playhead (same shared state
 * as the homepage, via sessionStorage) with a smaller entity graph above it.
 */
export function MethodBand() {
  const { day } = usePlayhead();
  const { nodeIds, edgeIds } = useMemo(
    () => visibleSetsAtDay(day, keyframes),
    [day],
  );
  const showFull = day >= FULL_DAY;

  return (
    <div className="border-y border-viz-border bg-viz-ink py-10 text-papyrus">
      <div className="h-[44vh] min-h-[380px]">
        <EntityGraphHero
          graph={graph}
          visibleNodeIds={showFull ? null : [...nodeIds]}
          visibleEdgeIds={showFull ? null : [...edgeIds]}
          height="100%"
          minHeight="380px"
        />
      </div>
      <Container className="mt-8">
        <SixMonthPlayhead keyframes={keyframes} variant="controller" />
      </Container>
    </div>
  );
}
