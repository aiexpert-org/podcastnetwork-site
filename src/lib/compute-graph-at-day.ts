import type { EntityGraph, Keyframe } from "./entity-graph";

/**
 * Returns the visible node/edge id sets for a given day on the six-month arc.
 * Stepwise (no interpolation): the graph changes state only at keyframe
 * crossings, which gives the playhead a satisfying milestone snap.
 */
export function visibleSetsAtDay(
  day: number,
  keyframes: Keyframe[],
): { nodeIds: Set<string>; edgeIds: Set<string>; keyframe: Keyframe | null } {
  const active = keyframes
    .filter((kf) => kf.day <= day)
    .sort((a, b) => b.day - a.day)[0];

  if (!active) {
    return { nodeIds: new Set(), edgeIds: new Set(), keyframe: null };
  }

  return {
    nodeIds: new Set(active.visibleNodes),
    edgeIds: new Set(active.visibleEdges),
    keyframe: active,
  };
}

export function computeGraphAtDay(
  day: number,
  keyframes: Keyframe[],
  masterGraph: EntityGraph,
): EntityGraph {
  const { nodeIds, edgeIds } = visibleSetsAtDay(day, keyframes);
  return {
    nodes: masterGraph.nodes.filter((n) => nodeIds.has(n.id)),
    edges: masterGraph.edges.filter((e) => edgeIds.has(e.id)),
  };
}
