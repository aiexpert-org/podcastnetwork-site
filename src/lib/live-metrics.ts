/**
 * Live metrics adapters for the AI or Die module.
 *
 * - Amazon PA API: STUBBED until Mike Partners delivers PA API credentials.
 *   When AMAZON_PA_ACCESS_KEY / SECRET / PARTNER_TAG land in env, wire the
 *   signed request here; every consumer already handles `null` as "pending
 *   publisher data connection."
 * - Goodreads: server-side fetch of the public book page, meta-tag parse.
 * - Spotify: Client Credentials flow, episode metadata only (downloads are
 *   not exposed by the Web API; a manually updated weekly number renders
 *   when present in data/case-studies.json).
 */

import { cacheGet, cacheSet } from "./server-cache";

export const AI_OR_DIE_LAUNCH_DATE = "2026-06-24";

export type AmazonMetrics = {
  rank: number;
  category: string;
} | null;

export type GoodreadsMetrics = {
  rating: number;
  ratingCount: number;
  reviewCount: number;
} | null;

export type SpotifyMetrics = {
  episodeCount: number;
  showName: string;
  latestEpisodeDate: string | null;
} | null;

export function dayInMarket(now = new Date()): number {
  const launch = new Date(`${AI_OR_DIE_LAUNCH_DATE}T00:00:00-04:00`);
  return Math.max(
    1,
    Math.floor((now.getTime() - launch.getTime()) / 86_400_000) + 1,
  );
}

export async function fetchAmazonMetrics(asin: string): Promise<AmazonMetrics> {
  const accessKey = process.env.AMAZON_PA_ACCESS_KEY;
  const secretKey = process.env.AMAZON_PA_SECRET_KEY;
  const partnerTag = process.env.AMAZON_PA_PARTNER_TAG;
  if (!accessKey || !secretKey || !partnerTag || !asin) {
    // Pending publisher data connection. See NEXT-STEPS.md.
    return null;
  }
  // PA API v5 signed-request implementation lands with the credentials.
  return null;
}

export async function fetchGoodreadsMetrics(
  goodreadsId: string,
): Promise<GoodreadsMetrics> {
  if (!goodreadsId) return null;
  try {
    const res = await fetch(
      `https://www.goodreads.com/book/show/${goodreadsId}`,
      {
        headers: {
          "User-Agent": "PodcastNetworkOrg/1.0 (+https://podcastnetwork.org)",
        },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!res.ok) return null;
    const html = await res.text();

    const ratingMatch =
      html.match(/<meta property="books:rating:value" content="([\d.]+)"/) ??
      html.match(/itemprop="ratingValue"[^>]*>\s*([\d.]+)/) ??
      html.match(/"averageRating"\s*:\s*([\d.]+)/);
    const countMatch =
      html.match(/<meta property="books:rating:count" content="(\d+)"/) ??
      html.match(/"ratingsCount"\s*:\s*(\d+)/) ??
      html.match(/(\d[\d,]*)\s+ratings/);
    const reviewMatch =
      html.match(/"reviewsCount"\s*:\s*(\d+)/) ??
      html.match(/(\d[\d,]*)\s+reviews/);

    if (!ratingMatch) return null;

    return {
      rating: parseFloat(ratingMatch[1]),
      ratingCount: countMatch
        ? parseInt(countMatch[1].replace(/,/g, ""), 10)
        : 0,
      reviewCount: reviewMatch
        ? parseInt(reviewMatch[1].replace(/,/g, ""), 10)
        : 0,
    };
  } catch {
    return null;
  }
}

async function getSpotifyToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const cached = cacheGet<string>("spotify:token");
  if (cached) return cached;

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
    };
    if (!json.access_token) return null;
    cacheSet("spotify:token", json.access_token, (json.expires_in ?? 3600) - 300);
    return json.access_token;
  } catch {
    return null;
  }
}

export async function fetchSpotifyMetrics(
  showId: string,
): Promise<SpotifyMetrics> {
  if (!showId) return null;
  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    const res = await fetch(
      `https://api.spotify.com/v1/shows/${showId}?market=US`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!res.ok) return null;
    const show = (await res.json()) as {
      name?: string;
      total_episodes?: number;
    };

    let latestEpisodeDate: string | null = null;
    try {
      const epRes = await fetch(
        `https://api.spotify.com/v1/shows/${showId}/episodes?market=US&limit=1`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(10_000),
        },
      );
      if (epRes.ok) {
        const eps = (await epRes.json()) as {
          items?: { release_date?: string }[];
        };
        latestEpisodeDate = eps.items?.[0]?.release_date ?? null;
      }
    } catch {
      // Episode date is decorative; the show payload is the signal.
    }

    return {
      episodeCount: show.total_episodes ?? 0,
      showName: show.name ?? "AI or Die",
      latestEpisodeDate,
    };
  } catch {
    return null;
  }
}
