"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { DARK_NODE_COLORS, nodeSize } from "@/lib/entity-graph";
import type { EntityNodeData } from "./graph-types";

/**
 * Custom React Flow node for every entity type. Dark-ground palette:
 * saturated fills with an inner glow, engineered to pop against Ink.
 * Shape varies by type: circles for Person/PodcastSeries, rounded squares
 * for Organization, book-spine rectangles for Book, diamonds for
 * SpeakingEvent, browser-chrome rectangles for WebPage.
 */
function EntityGraphNodeInner({ data, selected }: NodeProps<EntityNodeData>) {
  const { entity, dimmed, order, reducedMotion, hasVerifiedBadge } = data;
  const colors = DARK_NODE_COLORS[entity.type];
  const size = nodeSize(entity);

  const isCircle =
    entity.type === "Person" ||
    entity.type === "PodcastSeries" ||
    entity.type === "Award";
  const isDiamond = entity.type === "SpeakingEvent";
  const isBook = entity.type === "Book";
  const isWebPage = entity.type === "WebPage";

  const width = isBook ? size * 0.72 : isWebPage ? size * 1.3 : size;
  const height = isBook ? size * 1.05 : isWebPage ? size * 0.82 : size;

  return (
    <motion.div
      initial={
        reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4 }
      }
      animate={{ opacity: dimmed ? 0.45 : 1, scale: 1 }}
      transition={
        reducedMotion
          ? { duration: 0.2 }
          : {
              opacity: { duration: 0.35, delay: Math.min(order * 0.04, 1.0) },
              scale: {
                type: "spring",
                stiffness: 260,
                damping: 22,
                delay: Math.min(order * 0.04, 1.0),
              },
            }
      }
      className="group flex flex-col items-center"
      style={{ cursor: "pointer" }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={hiddenHandleStyle}
        isConnectable={false}
      />
      <div
        className="relative flex items-center justify-center transition-all duration-200 group-hover:scale-115"
        style={{
          width,
          height,
          background: `radial-gradient(circle at 35% 30%, ${colors.glow}, ${colors.fill} 70%)`,
          borderRadius: isCircle
            ? "9999px"
            : isBook
              ? "3px"
              : isWebPage
                ? "5px"
                : "8px",
          transform: isDiamond ? "rotate(45deg)" : undefined,
          boxShadow: selected
            ? `0 0 0 2px #faf8f5, 0 0 28px 2px ${colors.fill}99`
            : `0 0 18px 0 ${colors.fill}55`,
          border: `1.5px solid ${colors.glow}`,
        }}
      >
        {hasVerifiedBadge && (
          <span
            className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-viz-ink"
            style={{
              background: "#c4a365",
              transform: isDiamond ? "rotate(-45deg)" : undefined,
            }}
            aria-hidden
          >
            ✓
          </span>
        )}
      </div>
      <span
        className="pointer-events-none mt-2 max-w-36 text-center text-[12px] leading-tight font-semibold text-balance transition-colors"
        style={{ color: dimmed ? "#64748b" : colors.glow }}
      >
        {entity.label}
      </span>
      <span className="pointer-events-none font-mono text-[9px] tracking-wider text-fog opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {entity.type}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        style={hiddenHandleStyle}
        isConnectable={false}
      />
    </motion.div>
  );
}

const hiddenHandleStyle: React.CSSProperties = {
  opacity: 0,
  pointerEvents: "none",
  width: 1,
  height: 1,
  minWidth: 0,
  minHeight: 0,
  border: "none",
  background: "transparent",
};

export const EntityGraphNode = memo(EntityGraphNodeInner);
