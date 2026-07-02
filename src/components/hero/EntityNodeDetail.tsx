"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  DARK_NODE_COLORS,
  type EntityEdge,
  type EntityNode,
} from "@/lib/entity-graph";

const EDGE_VERBS: Record<string, string> = {
  sameAs: "same as",
  authorOf: "author of",
  publishedBy: "published by",
  appearedOn: "appeared on",
  founderOf: "founder of",
  knownFor: "known for",
};

/**
 * Detail panel that opens when a node is clicked. Renders the schema type,
 * description, sameAs links, and clickable connected entities.
 */
export function EntityNodeDetail({
  node,
  edges,
  allNodes,
  onClose,
  onSelectNode,
}: {
  node: EntityNode;
  edges: EntityEdge[];
  allNodes: EntityNode[];
  onClose: () => void;
  onSelectNode: (id: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const colors = DARK_NODE_COLORS[node.type];

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const connections = edges
    .filter((e) => e.source === node.id || e.target === node.id)
    .map((e) => {
      const otherId = e.source === node.id ? e.target : e.source;
      const other = allNodes.find((n) => n.id === otherId);
      const verb =
        e.source === node.id
          ? EDGE_VERBS[e.type]
          : e.type === "sameAs"
            ? "same as"
            : `${EDGE_VERBS[e.type]} (inbound)`;
      return other ? { other, verb, key: e.id } : null;
    })
    .filter(Boolean) as { other: EntityNode; verb: string; key: string }[];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={`${node.type}: ${node.label}`}
      className="absolute top-4 right-4 bottom-4 z-20 w-[min(360px,calc(100%-2rem))] overflow-y-auto rounded-lg border border-viz-border bg-viz-ink-raised p-6 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="text-eyebrow inline-block rounded-full px-3 py-1"
          style={{ background: `${colors.fill}22`, color: colors.glow }}
        >
          {node.type}
        </span>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close entity detail"
          className="rounded p-1 text-fog transition-colors hover:text-papyrus focus-visible:outline-2 focus-visible:outline-foil"
        >
          <X size={18} />
        </button>
      </div>

      <h3 className="text-h3 mt-4 font-(family-name:--font-display) text-papyrus">
        {node.label}
      </h3>

      {node.description && (
        <p className="text-body-sm mt-2 text-fog">{node.description}</p>
      )}

      <p className="text-micro mt-3 font-mono break-all text-fog/70" data-mono>
        {node.id}
      </p>

      {node.sameAs && node.sameAs.length > 0 && (
        <div className="mt-5">
          <p className="text-caption text-foil">sameAs</p>
          <ul className="mt-1.5 space-y-1">
            {node.sameAs.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm break-all text-entity-dark-org underline decoration-viz-border underline-offset-2 hover:decoration-foil"
                >
                  {url.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {connections.length > 0 && (
        <div className="mt-5">
          <p className="text-caption text-foil">
            Connected to {connections.length}{" "}
            {connections.length === 1 ? "entity" : "entities"}
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {connections.map(({ other, verb, key }) => (
              <li key={key}>
                <button
                  onClick={() => onSelectNode(other.id)}
                  className="text-body-sm group flex w-full items-baseline gap-2 text-left text-papyrus hover:text-foil-bright focus-visible:outline-2 focus-visible:outline-foil"
                >
                  <span
                    className="inline-block h-2 w-2 shrink-0 translate-y-[-1px] rounded-full"
                    style={{ background: DARK_NODE_COLORS[other.type].fill }}
                    aria-hidden
                  />
                  <span className="underline-offset-2 group-hover:underline">
                    {other.label}
                  </span>
                  <span className="text-micro text-fog">{verb}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.aside>
  );
}
