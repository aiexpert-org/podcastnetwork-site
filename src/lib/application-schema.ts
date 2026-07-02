import { z } from "zod";

/**
 * The six-question diagnostic payload. Question set per
 * path-b-v0.5/05-six-page-sitemap-override.md (/apply/ section), with email
 * added to Q1 so the confirmation + follow-up loop works.
 */

export const SITUATIONS = {
  executive: "Executive at a company",
  "author-with-manuscript": "Author with a manuscript",
  "author-without-manuscript": "Author without a manuscript",
  "founder-operator": "Founder or operator",
  other: "Other",
} as const;

export const KP_STATUS = {
  "yes-verified": "Yes, verified",
  "yes-unverified": "Yes, but unverified",
  no: "No",
  "not-sure": "Not sure",
} as const;

export const AUDIENCE_BANDS = {
  "under-1k": "Under 1,000",
  "1k-10k": "1,000 to 10,000",
  "10k-50k": "10,000 to 50,000",
  "50k-250k": "50,000 to 250,000",
  "250k-plus": "250,000+",
} as const;

export const TIMELINES = {
  "6-months": "6 months",
  "12-months": "12 months",
  "18-plus": "18+ months",
  none: "No fixed timeline",
} as const;

export const BUDGET_ANSWERS = {
  yes: "Yes",
  discuss: "Need to discuss with a partner",
  no: "No",
} as const;

export const ApplicationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  situation: z.enum(
    Object.keys(SITUATIONS) as [keyof typeof SITUATIONS, ...string[]],
  ),
  kpStatus: z.enum(
    Object.keys(KP_STATUS) as [keyof typeof KP_STATUS, ...string[]],
  ),
  audience: z.enum(
    Object.keys(AUDIENCE_BANDS) as [keyof typeof AUDIENCE_BANDS, ...string[]],
  ),
  timeline: z.enum(
    Object.keys(TIMELINES) as [keyof typeof TIMELINES, ...string[]],
  ),
  budget: z.enum(
    Object.keys(BUDGET_ANSWERS) as [keyof typeof BUDGET_ANSWERS, ...string[]],
  ),
  openText: z.string().max(2000).optional().or(z.literal("")),
  scannedUrl: z.string().max(2000).optional().or(z.literal("")),
  schemaScore: z.number().int().min(0).max(100).nullable().optional(),
});

export type ApplicationPayload = z.infer<typeof ApplicationSchema>;

/**
 * Readiness score (0-100), adapted from the dream-site diagnostic weights to
 * the v0.5 question set: schema 30%, audience 30%, situation 20%, timeline 20%.
 * The score is a signal to the applicant, never a client-side gate.
 */
export function computeReadinessScore(p: {
  schemaScore: number | null | undefined;
  audience: string;
  situation: string;
  timeline: string;
}): number {
  const schema = p.schemaScore ?? 15;

  const audienceScores: Record<string, number> = {
    "under-1k": 15,
    "1k-10k": 40,
    "10k-50k": 65,
    "50k-250k": 85,
    "250k-plus": 95,
  };
  const audience = audienceScores[p.audience] ?? 15;

  const situationScores: Record<string, number> = {
    "author-with-manuscript": 90,
    executive: 75,
    "founder-operator": 70,
    "author-without-manuscript": 60,
    other: 50,
  };
  const situation = situationScores[p.situation] ?? 50;

  const timelineScores: Record<string, number> = {
    "6-months": 100,
    "12-months": 80,
    "18-plus": 55,
    none: 40,
  };
  const timeline = timelineScores[p.timeline] ?? 40;

  return Math.round(
    schema * 0.3 + audience * 0.3 + situation * 0.2 + timeline * 0.2,
  );
}

export function readinessBand(score: number): "low" | "mid" | "high" {
  if (score <= 40) return "low";
  if (score <= 70) return "mid";
  return "high";
}

export function readinessInterpretation(score: number): string {
  const band = readinessBand(score);
  if (band === "low") {
    return "You are in the right place. This is exactly the client we serve.";
  }
  if (band === "mid") {
    return "You're building. The Pre-Sold Author Package accelerates you into the top decile.";
  }
  return "You're ahead. We would apply to work with you.";
}
