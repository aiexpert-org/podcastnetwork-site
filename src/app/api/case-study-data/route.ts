import { NextResponse } from "next/server";
import caseStudies from "../../../../data/case-studies.json";
import { cacheGet, cacheSet } from "@/lib/server-cache";
import {
  dayInMarket,
  fetchGoodreadsMetrics,
  type GoodreadsMetrics,
} from "@/lib/live-metrics";

export const runtime = "nodejs";

/**
 * Live case-study data. v0.6:
 *   - dayInMarket: always live.
 *   - goodreads: live when a Goodreads id is configured, otherwise pending.
 *   - amazon: permanently "publisher metrics pending". Amazon PA API auto-fetch
 *     was retired 2026-07-03; the honest pending text ships permanently rather
 *     than blocking on credentials that are not coming.
 *   - Spotify was removed entirely: AI or Die is a book, not a podcast.
 */

export type CaseStudyLiveData = {
  slug: string;
  dayInMarket: number;
  goodreads: GoodreadsMetrics;
  goodreadsStatus: "live" | "pending-id" | "error";
  amazonStatus: "pending";
  fetchedAt: string;
  cached: boolean;
};

type CaseStudyConfig = {
  slug: string;
  variant: string;
  goodreadsId?: string;
};

const CACHE_TTL_SECONDS = 3600;

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") ?? "ai-or-die";

  if (!/^[a-z0-9-]{1,64}$/.test(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }

  const config = (caseStudies as unknown as Record<string, CaseStudyConfig>)[
    slug
  ];
  if (!config) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const cacheKey = `case-study:${slug}`;
  const cached = cacheGet<CaseStudyLiveData>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  const goodreads = await fetchGoodreadsMetrics(config.goodreadsId ?? "");

  const data: CaseStudyLiveData = {
    slug,
    dayInMarket: dayInMarket(),
    goodreads,
    goodreadsStatus: goodreads ? "live" : config.goodreadsId ? "error" : "pending-id",
    amazonStatus: "pending",
    fetchedAt: new Date().toISOString(),
    cached: false,
  };

  cacheSet(cacheKey, data, CACHE_TTL_SECONDS);

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
