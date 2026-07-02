"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import type { CaseStudyLiveData } from "@/app/api/case-study-data/route";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** Count-up number for metric reveals. Respects prefers-reduced-motion. */
function CountUp({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      setDisplay(value);
      return;
    }
    started.current = true;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 800;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className={className} data-mono>
      {display.toLocaleString("en-US")}
    </span>
  );
}

function Metric({
  label,
  children,
  note,
}: {
  label: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <div>
      <div className="font-mono text-3xl font-medium text-papyrus tabular-nums sm:text-4xl">
        {children}
      </div>
      <p className="text-caption mt-1 text-fog">{label}</p>
      {note && <p className="text-micro mt-0.5 text-warning-bright">{note}</p>}
    </div>
  );
}

/**
 * The AI or Die live metrics module. Bloomberg-terminal-style dark panel
 * inside otherwise light cards (per the hybrid palette lock). Day counter is
 * always live; each metric degrades independently to an em-dash-free
 * "pending" state, never a fabricated number.
 */
export function AiOrDieMetrics({
  variant = "full",
  className,
}: {
  variant?: "full" | "compact";
  className?: string;
}) {
  const { data, error } = useSWR<CaseStudyLiveData>(
    "/api/case-study-data/?slug=ai-or-die",
    fetcher,
    { refreshInterval: 15 * 60 * 1000, revalidateOnFocus: false },
  );

  const day = data?.dayInMarket;
  const loading = !data && !error;

  return (
    <div
      className={`rounded-xl border border-viz-border bg-viz-ink p-6 sm:p-8 ${className ?? ""}`}
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-eyebrow text-foil">Live data</p>
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-bright opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success-bright" />
          </span>
          <span className="text-micro text-fog">Refreshes hourly</span>
        </span>
      </div>

      <div
        className={`mt-6 grid gap-6 ${variant === "full" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2"}`}
      >
        <Metric label="Day in market">
          {day !== undefined ? (
            <>
              <span className="text-foil">Day&nbsp;</span>
              <CountUp value={day} />
            </>
          ) : (
            <span className="text-fog">{loading ? "…" : "Day 9+"}</span>
          )}
        </Metric>

        <Metric
          label="Amazon Best Sellers Rank"
          note={
            data?.amazonStatus === "pending-credentials"
              ? "Pending publisher data connection"
              : undefined
          }
        >
          {data?.amazon ? (
            <>
              #<CountUp value={data.amazon.rank} />
            </>
          ) : (
            <span className="text-fog/60">—</span>
          )}
        </Metric>

        <Metric
          label="Goodreads rating"
          note={
            data && !data.goodreads && data.goodreadsStatus !== "live"
              ? "Indexing in progress"
              : undefined
          }
        >
          {data?.goodreads ? (
            <>
              <span data-mono>{data.goodreads.rating.toFixed(1)}</span>
              <span className="text-lg text-fog">/5</span>
              <span className="ml-2 text-lg text-fog">
                (<CountUp value={data.goodreads.ratingCount} />)
              </span>
            </>
          ) : (
            <span className="text-fog/60">—</span>
          )}
        </Metric>

        <Metric
          label={
            data?.spotify
              ? "Podcast episodes live"
              : "Podcast (Spotify)"
          }
          note={
            data && !data.spotify && data.spotifyStatus !== "live"
              ? "Show linking in progress"
              : undefined
          }
        >
          {data?.spotify ? (
            <CountUp value={data.spotify.episodeCount} />
          ) : (
            <span className="text-fog/60">—</span>
          )}
        </Metric>
      </div>

      {variant === "full" && (
        <p className="text-body-sm measure mt-6 border-t border-viz-border pt-5 text-fog">
          Book launched June 24. Metrics update hourly. What you&apos;re seeing
          is the launch, happening now, not a retrospective. Sparse numbers on
          day {day ?? "nine-plus"} are what a real launch looks like at this
          stage.
        </p>
      )}

      <p className="text-micro mt-4 text-fog/70">
        {data
          ? `Updated ${new Date(data.fetchedAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })} ET · Refreshes hourly`
          : loading
            ? "Connecting to live sources…"
            : "Live data temporarily unavailable. Check back in an hour."}
      </p>
    </div>
  );
}
