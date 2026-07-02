/**
 * Entity graph types + helpers. The graph data is the same graph as the
 * JSON-LD schema stack (content/schema/19-graph-composition.json); node ids
 * are the JSON-LD @id values.
 */

export type EntityType =
  | "Person"
  | "Organization"
  | "Book"
  | "PodcastSeries"
  | "SpeakingEvent"
  | "WebPage"
  | "Award";

export type EdgeType =
  | "sameAs"
  | "authorOf"
  | "publishedBy"
  | "appearedOn"
  | "founderOf"
  | "knownFor";

export type EntityNode = {
  id: string;
  type: EntityType;
  label: string;
  imageUrl?: string;
  description?: string;
  sameAs?: string[];
  /** 1-10; affects node size + simulation gravity. Default 5. */
  weight?: number;
  /** Set on YouSearch results: whether a data source confirmed this node. */
  confirmed?: boolean;
};

export type EntityEdge = {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
};

export type EntityGraph = {
  nodes: EntityNode[];
  edges: EntityEdge[];
};

export type Keyframe = {
  day: number;
  label: string;
  addedNodes: string[];
  addedEdges: string[];
  visibleNodes: string[];
  visibleEdges: string[];
  milestone: {
    type: EntityType;
    description: string;
  };
};

/** Dark-ground node palette (hero graph, validator output). */
export const DARK_NODE_COLORS: Record<
  EntityType,
  { fill: string; glow: string }
> = {
  Person: { fill: "#c4a365", glow: "#e5c88e" },
  Organization: { fill: "#4a90e2", glow: "#7fb3eb" },
  Book: { fill: "#ef4444", glow: "#f87171" },
  PodcastSeries: { fill: "#10b981", glow: "#34d399" },
  SpeakingEvent: { fill: "#f59e0b", glow: "#fbbf24" },
  WebPage: { fill: "#a855f7", glow: "#c084fc" },
  Award: { fill: "#14b8a6", glow: "#5eead4" },
};

/** Edge color follows the source entity's semantic color on dark ground. */
export const DARK_EDGE_COLORS: Record<EdgeType, string> = {
  sameAs: "#64748b",
  authorOf: "#c4a365",
  publishedBy: "#4a90e2",
  appearedOn: "#f59e0b",
  founderOf: "#c4a365",
  knownFor: "#a855f7",
};

/** Node diameter in px, derived from weight (1-10). */
export function nodeSize(node: EntityNode): number {
  const w = node.weight ?? 5;
  if (node.type === "Organization") return 28 + w * 2.4;
  if (node.type === "Person") return 24 + w * 2.4;
  return 18 + w * 2;
}

export function describeGraph(graph: EntityGraph): string {
  const counts = new Map<EntityType, number>();
  for (const n of graph.nodes) {
    counts.set(n.type, (counts.get(n.type) ?? 0) + 1);
  }
  const parts = [...counts.entries()].map(([type, n]) => `${n} ${type}`);
  return `Entity graph with ${graph.nodes.length} nodes (${parts.join(", ")}) and ${graph.edges.length} relationships.`;
}
