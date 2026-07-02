"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EntityGraphHero } from "@/components/hero/EntityGraphHero";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/track";
import type { EntityLookupResponse } from "@/app/api/entity-lookup/route";

const MAX_SEARCHES_PER_SESSION = 5;
const SEARCH_COUNT_KEY = "pn-you-search-count";

type Phase = "idle" | "loading" | "done" | "error";

function getSearchCount(): number {
  try {
    return Number(sessionStorage.getItem(SEARCH_COUNT_KEY) ?? "0");
  } catch {
    return 0;
  }
}

function bumpSearchCount() {
  try {
    sessionStorage.setItem(SEARCH_COUNT_KEY, String(getSearchCount() + 1));
  } catch {
    // Private mode: limit degrades gracefully to unlimited.
  }
}

/** Skeleton graph shown while the three sources fan out. */
function SkeletonGraph() {
  const positions = [
    { x: 48, y: 42 },
    { x: 22, y: 22 },
    { x: 74, y: 25 },
    { x: 15, y: 65 },
    { x: 62, y: 72 },
    { x: 86, y: 55 },
  ];
  return (
    <div
      className="relative h-full w-full"
      role="status"
      aria-label="Searching SerpAPI, Wikidata, and Google Knowledge Graph"
    >
      <svg className="absolute inset-0 h-full w-full opacity-30">
        {positions.slice(1).map((p, i) => (
          <line
            key={i}
            x1={`${positions[0].x + 2}%`}
            y1={`${positions[0].y + 2}%`}
            x2={`${p.x + 2}%`}
            y2={`${p.y + 2}%`}
            stroke="#475569"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
      </svg>
      {positions.map((p, i) => (
        <motion.div
          key={i}
          className="absolute h-9 w-9 rounded-full bg-slate"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}
      <p className="text-caption absolute bottom-3 left-1/2 -translate-x-1/2 text-fog">
        Fanning out to SerpAPI, Wikidata, and Google Knowledge Graph…
      </p>
    </div>
  );
}

export function YouSearchDemo() {
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<EntityLookupResponse | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLimitReached(getSearchCount() >= MAX_SEARCHES_PER_SESSION);
  }, [phase]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const q = name.trim();
      if (q.length < 2 || phase === "loading" || limitReached) return;

      setPhase("loading");
      setResult(null);
      bumpSearchCount();
      track("you_search_submit");

      try {
        const res = await fetch(
          `/api/entity-lookup/?q=${encodeURIComponent(q)}`,
        );
        if (!res.ok) throw new Error(`lookup failed: ${res.status}`);
        const json = (await res.json()) as EntityLookupResponse;
        setResult(json);
        setPhase("done");
      } catch {
        setPhase("error");
      }
    },
    [name, phase, limitReached],
  );

  const isEmpty = result !== null && result.graph.nodes.length <= 1;
  const failedAll =
    result !== null &&
    result.sources.serpapi === "error" &&
    result.sources.wikidata === "error" &&
    result.sources.googleKg === "error";
  const degradedSources = result
    ? Object.entries(result.sources).filter(([, s]) => s === "error")
    : [];

  return (
    <div>
      <form
        onSubmit={submit}
        className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="you-search-input" className="sr-only">
          Your full name
        </label>
        <input
          id="you-search-input"
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          maxLength={100}
          disabled={phase === "loading"}
          className="w-full rounded-md border border-viz-border bg-viz-ink-raised px-5 py-4 text-papyrus placeholder:text-fog focus:border-foil focus:outline-none disabled:opacity-60"
        />
        <Button
          type="submit"
          variant="dark-primary"
          disabled={phase === "loading" || limitReached || name.trim().length < 2}
          className="shrink-0"
        >
          {phase === "loading" ? "Searching…" : "Show my graph →"}
        </Button>
      </form>

      {limitReached && (
        <p className="text-caption mt-3 text-center text-warning-bright">
          5 searches per session. Apply below for a full entity audit.
        </p>
      )}

      <p className="text-micro mx-auto mt-3 max-w-2xl text-center text-fog">
        Searches are logged for demo improvement only. We never associate a
        search with your IP address or personal identifiers.
      </p>

      <AnimatePresence mode="wait">
        {phase !== "idle" && (
          <motion.div
            key={phase === "loading" ? "loading" : "result"}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-10 h-[440px] rounded-xl border border-viz-border bg-viz-ink-raised/40">
              {phase === "loading" && <SkeletonGraph />}
              {phase === "done" && result && !failedAll && (
                <EntityGraphHero
                  graph={result.graph}
                  height="100%"
                  minHeight="440px"
                  interactive
                  ariaLabel={`Entity graph for ${result.query} with ${result.graph.nodes.length} nodes.`}
                />
              )}
              {(phase === "error" || failedAll) && (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                  <p className="text-h4 text-papyrus">
                    We couldn&apos;t pull your entity data right now.
                  </p>
                  <p className="text-body-sm max-w-md text-fog">
                    You may not have a Knowledge Panel yet. That is exactly why
                    we exist. Apply anyway and we&apos;ll run the full scan as
                    your kickoff.
                  </p>
                  <Button href="/apply/" variant="dark-primary">
                    Start the diagnostic →
                  </Button>
                </div>
              )}
            </div>

            {phase === "done" && result && !failedAll && (
              <div className="mx-auto mt-6 max-w-2xl text-center">
                {isEmpty ? (
                  <p className="text-lead text-papyrus">
                    This is where you are today. The graph up top is where our
                    clients end up. Six months, one team, one clock.
                  </p>
                ) : (
                  <p className="text-lead text-papyrus">
                    Here&apos;s what Google can already tell about you. Every
                    gap on this graph is a signal we haven&apos;t sent yet.
                  </p>
                )}
                <p className="text-caption mt-3 text-fog">
                  {result.graph.nodes.length}{" "}
                  {result.graph.nodes.length === 1 ? "entity" : "entities"}{" "}
                  found · confidence: {result.confidence}
                  {degradedSources.length > 0 && (
                    <span className="ml-2 rounded-full bg-warning/20 px-2 py-0.5 text-warning-bright">
                      {degradedSources.map(([s]) => s).join(", ")} unavailable
                    </span>
                  )}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
