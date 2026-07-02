"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/track";
import type { SchemaScoreReport } from "@/app/api/schema-scan/route";

type Phase = "idle" | "loading" | "done" | "error";

const LOADING_PHASES = [
  "Fetching your page…",
  "Extracting structured data…",
  "Scoring against the Knowledge Panel target…",
];

function scoreColor(band: SchemaScoreReport["band"]): string {
  if (band === "low") return "#ef4444";
  if (band === "medium") return "#f59e0b";
  return "#10b981";
}

function interpretation(score: number): string {
  if (score <= 40) {
    return "The industry baseline after 12 to 24 months of agency work is 41. You are below it. This is expensive to fix on your own; six months with PN.org solves it.";
  }
  if (score <= 70) {
    return "You are ahead of the industry baseline of 41. You are also 20+ points behind a full Knowledge Panel entity graph.";
  }
  return "Impressive. You've already invested in structured data. PN.org takes you the rest of the way and pairs it with a pre-sold audience.";
}

export function SchemaValidator({
  onScanComplete,
  showApplyCTA = true,
  className,
}: {
  onScanComplete?: (report: SchemaScoreReport) => void;
  showApplyCTA?: boolean;
  className?: string;
}) {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [phaseLabel, setPhaseLabel] = useState(LOADING_PHASES[0]);
  const [report, setReport] = useState<SchemaScoreReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedEntity, setExpandedEntity] = useState<number | null>(null);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim() || phase === "loading") return;

      setPhase("loading");
      setReport(null);
      setError(null);
      setExpandedEntity(null);
      track("schema_validator_run");

      const timers = [
        setTimeout(() => setPhaseLabel(LOADING_PHASES[1]), 3000),
        setTimeout(() => setPhaseLabel(LOADING_PHASES[2]), 5000),
        setTimeout(
          () => setPhaseLabel(`${LOADING_PHASES[2]} Still working…`),
          10000,
        ),
      ];
      setPhaseLabel(LOADING_PHASES[0]);

      try {
        const res = await fetch(
          `/api/schema-scan/?url=${encodeURIComponent(url.trim())}`,
        );
        const json = await res.json();
        if (!res.ok) {
          setError(
            typeof json.error === "string"
              ? json.error
              : "We couldn't fetch that URL.",
          );
          setPhase("error");
          return;
        }
        setReport(json as SchemaScoreReport);
        setPhase("done");
        onScanComplete?.(json as SchemaScoreReport);
      } catch {
        setError("The scan failed. Try again in a moment.");
        setPhase("error");
      } finally {
        timers.forEach(clearTimeout);
      }
    },
    [url, phase, onScanComplete],
  );

  return (
    <div className={className}>
      {/* Input sits on light Papyrus; the results panel hands off to dark. */}
      <form
        onSubmit={submit}
        className="flex flex-col gap-3 rounded-xl border border-ink/8 bg-papyrus p-5 sm:flex-row sm:items-center"
      >
        <label htmlFor="schema-scan-url" className="sr-only">
          URL to scan
        </label>
        <input
          id="schema-scan-url"
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-site.com or LinkedIn profile URL"
          disabled={phase === "loading"}
          className="w-full rounded-md border border-ink/15 bg-white px-4 py-3.5 text-ink placeholder:text-slate/70 focus:border-foil focus:outline-none disabled:opacity-60"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={phase === "loading" || !url.trim()}
          className="shrink-0"
        >
          {phase === "loading" ? "Scanning…" : "Scan my structured data"}
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-viz-border bg-viz-ink p-8">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-foil" />
                <p className="text-mono-body text-fog" data-mono>
                  {phaseLabel}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "error" && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl border border-viz-border bg-viz-ink p-8"
          >
            <p className="text-h4 text-papyrus">We couldn&apos;t scan that URL.</p>
            <p className="text-body-sm mt-2 text-fog">{error}</p>
            <ul className="text-body-sm mt-3 list-disc pl-5 text-fog">
              <li>The URL may require login (we scan public pages only)</li>
              <li>Some CDNs block automated scanners</li>
              <li>The domain may be offline</li>
            </ul>
            <p className="text-body-sm mt-3 text-fog">
              Try a different URL, or apply and we&apos;ll run a full manual
              audit as your kickoff.
            </p>
          </motion.div>
        )}

        {phase === "done" && report && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="mt-4 rounded-xl border border-viz-border bg-viz-ink p-6 sm:p-8"
          >
            {/* Score readout */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-caption text-fog">
                  Results for{" "}
                  <span className="text-papyrus">
                    {report.url.replace(/^https?:\/\//, "")}
                  </span>
                </p>
                <p
                  className="mt-1 font-mono text-6xl font-semibold tabular-nums"
                  style={{ color: scoreColor(report.band) }}
                  data-mono
                >
                  {report.totalScore}
                  <span className="text-2xl text-fog">/100</span>
                </p>
              </div>
              <div className="text-body-sm max-w-sm text-fog">
                <p>
                  Industry average after 12 to 24 months:{" "}
                  <span className="font-mono text-papyrus" data-mono>
                    {report.comparison.industryBaseline}
                  </span>
                  . PN.org target after six months:{" "}
                  <span className="font-mono text-foil" data-mono>
                    {report.comparison.pnTarget}
                  </span>
                  .
                </p>
              </div>
            </div>

            <p className="text-body-sm measure mt-4 text-papyrus/90">
              {interpretation(report.totalScore)}
            </p>

            {/* Rubric chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {report.rubric.map((item) => (
                <span
                  key={item.id}
                  title={item.warning ?? item.label}
                  className="text-micro inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono"
                  data-mono
                  style={{
                    background: item.passed
                      ? "rgba(16, 185, 129, 0.15)"
                      : item.earnedPoints === 0 && item.warning
                        ? "rgba(239, 68, 68, 0.15)"
                        : "rgba(245, 158, 11, 0.15)",
                    color: item.passed
                      ? "#34d399"
                      : item.earnedPoints === 0 && item.warning
                        ? "#f87171"
                        : "#fbbf24",
                  }}
                >
                  <span aria-hidden>{item.passed ? "✓" : "✗"}</span>
                  {item.label}
                  <span className="opacity-70">
                    {item.earnedPoints}/{item.maxPoints}
                  </span>
                </span>
              ))}
            </div>

            {/* Extraction counts */}
            <p className="text-caption mt-5 text-fog">
              {report.counts.jsonLdBlocks} JSON-LD{" "}
              {report.counts.jsonLdBlocks === 1 ? "entity" : "entities"} ·{" "}
              {report.counts.microdata} microdata · {report.counts.rdfa} RDFa ·{" "}
              {report.counts.openGraph} Open Graph tags · Validated against
              Schema.org and Google Rich Results eligibility rules
            </p>

            {/* Found entities with expandable JSON */}
            {report.entities.length > 0 && (
              <div className="mt-5 space-y-2">
                {report.entities.slice(0, 12).map((entity, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-viz-border bg-viz-ink-raised"
                  >
                    <button
                      onClick={() =>
                        setExpandedEntity(expandedEntity === i ? null : i)
                      }
                      aria-expanded={expandedEntity === i}
                      className="flex w-full items-center justify-between px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-foil"
                    >
                      <span className="text-body-sm font-mono text-foil" data-mono>
                        {entity.type}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-fog transition-transform ${expandedEntity === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    {expandedEntity === i && (
                      <pre
                        className="text-mono-body max-h-72 overflow-auto border-t border-viz-border px-4 py-3 text-papyrus/85"
                        data-mono
                      >
                        {JSON.stringify(entity.json, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Warnings */}
            {report.warnings.length > 0 && (
              <div className="mt-5">
                <p className="text-caption text-warning-bright">
                  Warnings ({report.warnings.length})
                </p>
                <ul className="text-body-sm mt-1.5 space-y-1 text-fog">
                  {report.warnings.slice(0, 8).map((w, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-warning-bright" aria-hidden>
                        ⚠
                      </span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showApplyCTA && (
              <div className="mt-7 border-t border-viz-border pt-6">
                <p className="text-body-sm mb-4 text-fog">
                  That&apos;s your current authority baseline. Now let&apos;s
                  talk about where you want to go.
                </p>
                <Button href="/apply/" variant="dark-primary">
                  Start the diagnostic →
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
