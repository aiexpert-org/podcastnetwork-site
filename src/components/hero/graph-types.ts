import type { SimulationNodeDatum } from "d3-force";
import type { EntityNode } from "@/lib/entity-graph";

export type SimNode = SimulationNodeDatum & {
  id: string;
  entity: EntityNode;
};

export type EntityNodeData = {
  entity: EntityNode;
  /** true when another node is hovered and this one is not connected to it */
  dimmed: boolean;
  /** entry-stagger index for the load animation */
  order: number;
  reducedMotion: boolean;
  hasVerifiedBadge: boolean;
};
