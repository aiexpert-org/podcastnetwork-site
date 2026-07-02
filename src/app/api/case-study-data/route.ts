import { NextResponse } from "next/server";
import caseStudies from "../../../../data/case-studies.json";
import { cacheGet, cacheSet } from "@/lib/server-cache";
import {
  dayInMarket,
  fetchAmazonMetrics,
  fetchGoodreadsMetrics,
  fetchSpotifyMetrics,
  type AmazonMetrics,
  type GoodreadsMetrics,
  type SpotifyMetrics,
} from "@/lib/live-metrics";

export const runtime = "nodejs";

export type CaseStudyLiveData = {
  slug: string;
  dayInMarket: number;
  amazon: AmazonMetrics;
  amazonStatus: "live" | "pending-credentials" | "error";
  goodreads: GoodreadsMetrics;
  goodreadsStatus: "live" | "pending-id" | "error";
  spotify: SpotifyMetrics;
  spotifyStatus: "live" | "pending-id" | "error";
  spotifyDownloadsManual: { value: number | null; lastUpdated: string } | null;
  fetchedAt: string;
  cached: boolean;
};

type CaseStudyConfig = {
  slug: string;
  variant: string;
  amazonAsin?: string;
  goodreadsId?: string;
  spotifyShowId?: string;
  spotifyDownloadsManual?: { value: number | null; lastUpdated: string };
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

  const hasAmazonCreds = Boolean(
    process.env.AMAZON_PA_ACCESS_KEY &&
      process.env.AMAZON_PA_SECRET_KEY &&
      process.env.AMAZON_PA_PARTNER_TAG &&
      config.amazonAsin,
  );

  const [amazon, goodreads, spotify] = await Promise.all([
    fetchAmazonMetrics(config.amazonAsin ?? ""),
    fetchGoodreadsMetrics(config.goodreadsId ?? ""),
    fetchSpotifyMetrics(config.spotifyShowId ?? ""),
  ]);

  const data: CaseStudyLiveData = {
    slug,
    dayInMarket: dayInMarket(),
    amazon,
    amazonStatus: amazon ? "live" : hasAmazonCreds ? "error" : "pending-credentials",
    goodreads,
    goodreadsStatus: goodreads ? "live" : config.goodreadsId ? "error" : "pending-id",
    spotify,
    spotifyStatus: spotify ? "live" : config.spotifyShowId ? "error" : "pending-id",
    spotifyDownloadsManual: config.spotifyDownloadsManual ?? null,
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
