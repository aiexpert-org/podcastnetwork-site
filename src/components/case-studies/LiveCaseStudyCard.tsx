import Link from "next/link";
import { AiOrDieMetrics } from "./AiOrDieMetrics";
import { InLaunchBanner } from "./InLaunchBanner";

export type CaseStudyStatic = {
  slug: string;
  variant: "featured" | "in-launch";
  title: string;
  workingTitle?: string;
  authors: string[];
  publisher: string;
  publishedDate?: string;
  currentMonth?: number;
  totalMonths?: number;
  currentPhase?: string;
  blurb: string;
  nextMilestone?: { label: string; targetDate: string };
};

function ProgressRing({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const r = 20;
  const circumference = 2 * Math.PI * r;
  const filled = (current / total) * circumference;
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      role="img"
      aria-label={`Month ${current} of ${total}`}
    >
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="rgba(15, 23, 42, 0.12)"
        strokeWidth="4"
      />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="#c4a365"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
        transform="rotate(-90 24 24)"
      />
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#0f172a"
      >
        {current}/{total}
      </text>
    </svg>
  );
}

/**
 * Case study card. Featured (AI or Die) renders a light Papyrus card with the
 * dark live-metrics chart inside, per the hybrid palette lock. In-launch
 * cards render honest state only: no fabricated numbers, ever.
 */
export function LiveCaseStudyCard({
  data,
  headingLevel = "h3",
}: {
  data: CaseStudyStatic;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  if (data.variant === "featured") {
    return (
      <article className="rounded-xl border-t-4 border-foil bg-papyrus p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <Heading className="text-h3 font-(family-name:--font-display) font-bold">
            {data.title}
            <span className="text-slate"> — {data.authors.join(" + ")}</span>
          </Heading>
          <span className="text-caption text-slate">
            Published by {data.publisher} · Launched {data.publishedDate}
          </span>
        </div>

        <p className="text-body-sm measure mt-3 text-slate">{data.blurb}</p>

        <div className="mt-6">
          <AiOrDieMetrics variant="full" />
        </div>

        <div className="mt-6">
          <Link
            href={`/case-studies/${data.slug}/`}
            className="font-semibold text-signal underline decoration-foil underline-offset-4 hover:text-signal-dark"
          >
            Read the case study →
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-xl border-t border-ink/10 bg-papyrus p-6 shadow-sm ring-1 ring-ink/5">
      <div className="flex items-start justify-between gap-4">
        <InLaunchBanner
          currentMonth={data.currentMonth ?? 1}
          totalMonths={data.totalMonths ?? 6}
        />
        <ProgressRing
          current={data.currentMonth ?? 1}
          total={data.totalMonths ?? 6}
        />
      </div>

      <Heading className="text-h3 mt-4 font-(family-name:--font-display) font-bold">
        {data.title}
      </Heading>
      {data.workingTitle && (
        <p className="text-caption mt-1 text-slate">
          Working title: {data.workingTitle}
        </p>
      )}

      <p className="text-body-sm mt-3 grow text-slate">{data.blurb}</p>

      <dl className="text-body-sm mt-4 space-y-1 border-t border-ink/8 pt-4">
        <div className="flex justify-between gap-4">
          <dt className="text-slate">Current phase</dt>
          <dd className="text-right font-medium">{data.currentPhase}</dd>
        </div>
        {data.nextMilestone && (
          <div className="flex justify-between gap-4">
            <dt className="text-slate">Next milestone</dt>
            <dd className="text-right font-medium">
              {data.nextMilestone.label}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-4">
        <Link
          href={`/case-studies/${data.slug}/`}
          className="text-body-sm font-semibold text-signal underline decoration-foil underline-offset-4 hover:text-signal-dark"
        >
          View journey →
        </Link>
      </div>
    </article>
  );
}
