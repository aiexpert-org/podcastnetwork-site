import { NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { cacheGet, cacheSet, rateLimit, sha256 } from "@/lib/server-cache";
import { extractStructuredData } from "./extract";
import {
  bandFromScore,
  detectContextHeuristics,
  scoreAgainstRubric,
  type RubricItemResult,
} from "./score";

/**
 * Node runtime (not Edge): the SSRF guard needs a real DNS lookup so we can
 * verify the target host resolves to public address space before fetching.
 */
export const runtime = "nodejs";

const CACHE_TTL_SECONDS = 15 * 60;
const FETCH_TIMEOUT_MS = 30_000;
const MAX_BODY_BYTES = 5 * 1024 * 1024;

export type SchemaScoreReport = {
  url: string;
  scannedAt: string;
  totalScore: number;
  band: "low" | "medium" | "high";
  rubric: RubricItemResult[];
  entities: { type: string; id: string; json: Record<string, unknown> }[];
  counts: {
    jsonLdBlocks: number;
    microdata: number;
    rdfa: number;
    openGraph: number;
  };
  warnings: string[];
  comparison: {
    industryBaseline: number;
    pnTarget: number;
    delta: number;
  };
  cached: boolean;
};

function isPrivateIp(ip: string): boolean {
  if (isIP(ip) === 4) {
    const parts = ip.split(".").map(Number);
    return (
      parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 169 && parts[1] === 254) ||
      parts[0] === 0
    );
  }
  const lower = ip.toLowerCase();
  return (
    lower === "::1" ||
    lower.startsWith("fc") ||
    lower.startsWith("fd") ||
    lower.startsWith("fe80") ||
    lower.startsWith("::ffff:127.") ||
    lower.startsWith("::ffff:10.") ||
    lower.startsWith("::ffff:192.168.")
  );
}

async function ssrfGuard(target: URL): Promise<string | null> {
  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return "Only http(s) URLs are supported.";
  }
  const host = target.hostname;
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    return "That host is not scannable.";
  }
  if (isIP(host)) {
    return isPrivateIp(host) ? "That host is not scannable." : null;
  }
  try {
    const results = await lookup(host, { all: true });
    if (results.length === 0) return "Domain did not resolve.";
    if (results.some((r) => isPrivateIp(r.address))) {
      return "That host is not scannable.";
    }
    return null;
  } catch {
    return "Domain did not resolve.";
  }
}

function normalizeUrl(raw: string): string | null {
  let candidate = raw.trim();
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  try {
    const url = new URL(candidate);
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const urlParam = params.get("url");

  if (!urlParam || urlParam.length > 2000) {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  const normalized = normalizeUrl(urlParam);
  if (!normalized) {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`schema-scan:${ip}`, 20, 3600)) {
    return NextResponse.json(
      { error: "rate limited" },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  const target = new URL(normalized);
  const guardError = await ssrfGuard(target);
  if (guardError) {
    return NextResponse.json({ error: guardError }, { status: 403 });
  }

  const cacheKey = `schema-scan:${await sha256(normalized)}`;
  const cached = cacheGet<SchemaScoreReport>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  let html: string;
  try {
    const res = await fetch(normalized, {
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent":
          "PodcastNetworkOrg-SchemaScanner/1.0 (+https://podcastnetwork.org)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `We couldn't fetch that URL (HTTP ${res.status}).` },
        { status: 502 },
      );
    }
    const reader = res.body?.getReader();
    if (!reader) {
      html = await res.text();
    } else {
      const chunks: Uint8Array[] = [];
      let received = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > MAX_BODY_BYTES) {
          reader.cancel();
          break;
        }
        chunks.push(value);
      }
      const merged = new Uint8Array(received > MAX_BODY_BYTES ? MAX_BODY_BYTES : received);
      let offset = 0;
      for (const chunk of chunks) {
        const slice =
          offset + chunk.byteLength > merged.byteLength
            ? chunk.subarray(0, merged.byteLength - offset)
            : chunk;
        merged.set(slice, offset);
        offset += slice.byteLength;
        if (offset >= merged.byteLength) break;
      }
      html = new TextDecoder().decode(merged);
    }
  } catch {
    return NextResponse.json(
      { error: "Fetch timed out or the network request failed." },
      { status: 502 },
    );
  }

  const extracted = extractStructuredData(html);
  const heuristics = detectContextHeuristics(extracted);
  const score = scoreAgainstRubric(extracted, heuristics);

  const entities = extracted.jsonLd.map((json) => ({
    type: Array.isArray(json["@type"])
      ? (json["@type"] as string[]).join(", ")
      : String(json["@type"] ?? "Unknown"),
    id: typeof json["@id"] === "string" ? json["@id"] : "",
    json,
  }));

  const report: SchemaScoreReport = {
    url: normalized,
    scannedAt: new Date().toISOString(),
    totalScore: score.total,
    band: bandFromScore(score.total),
    rubric: score.itemResults,
    entities,
    counts: {
      jsonLdBlocks: extracted.jsonLd.length,
      microdata: extracted.microdataTypes.length,
      rdfa: extracted.rdfaTypes.length,
      openGraph: Object.keys(extracted.openGraph).length,
    },
    warnings: [
      ...extracted.parseErrors,
      ...extracted.orphanObjects,
      ...extracted.unresolvedIds.map((id) => `Unresolved @id reference: ${id}`),
      ...score.itemResults.filter((i) => i.warning).map((i) => i.warning!),
    ],
    comparison: {
      industryBaseline: 41,
      pnTarget: 92,
      delta: score.total - 92,
    },
    cached: false,
  };

  cacheSet(cacheKey, report, CACHE_TTL_SECONDS);

  return NextResponse.json(report);
}
