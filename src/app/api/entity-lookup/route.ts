import { NextResponse } from "next/server";
import type { EntityGraph } from "@/lib/entity-graph";
import { cacheGet, cacheSet, rateLimit, sha256 } from "@/lib/server-cache";
import {
  fetchGoogleKg,
  fetchSerpApi,
  fetchWikidata,
  type SourceEntity,
  type SourceResult,
} from "./sources";

export const runtime = "edge";

export type EntityLookupResponse = {
  query: string;
  graph: EntityGraph;
  sources: {
    serpapi: "ok" | "no-data" | "error";
    wikidata: "ok" | "no-data" | "error";
    googleKg: "ok" | "no-data" | "error";
  };
  confidence: "high" | "medium" | "low" | "none";
  cached: boolean;
  generatedAt: string;
};

const CACHE_TTL_SECONDS = 60 * 60 * 24;

/** Merge the (up to) three source entities into one visitor graph. */
function buildGraph(query: string, results: SourceEntity[]): EntityGraph {
  const personId = `lookup:${query.toLowerCase()}#person`;

  if (results.length === 0) {
    // Empty state: a single unconnected Person node with the typed name.
    // The absence is the point.
    return {
      nodes: [
        {
          id: personId,
          type: "Person",
          label: query,
          description: "No verified entity data found across the three sources.",
          weight: 6,
          confirmed: false,
        },
      ],
      edges: [],
    };
  }

  const primaryType = results.some((r) => r.type === "Organization")
    ? results.filter((r) => r.type === "Organization").length >
      results.filter((r) => r.type === "Person").length
      ? "Organization"
      : "Person"
    : "Person";

  const name =
    results.map((r) => r.name).sort((a, b) => b.length - a.length)[0] ?? query;
  const description =
    results
      .map((r) => r.longDescription ?? r.description)
      .filter(Boolean)
      .sort((a, b) => (b?.length ?? 0) - (a?.length ?? 0))[0] ?? undefined;

  // Canonicalize before dedup so twitter.com/x.com and www/apex variants of
  // the same profile collapse into one node.
  const canonical = (url: string) =>
    url
      .toLowerCase()
      .replace(/\/$/, "")
      .replace("://www.", "://")
      .replace("://twitter.com/", "://x.com/")
      .replace("://mobile.twitter.com/", "://x.com/");

  const sameAsMap = new Map<string, { label: string; url: string }>();
  for (const r of results) {
    for (const link of r.sameAs) {
      const key = canonical(link.url);
      if (!sameAsMap.has(key)) sameAsMap.set(key, link);
    }
    if (r.website) {
      const key = canonical(r.website);
      if (!sameAsMap.has(key)) {
        sameAsMap.set(key, { label: "Official website", url: r.website });
      }
    }
  }

  const nodes: EntityGraph["nodes"] = [
    {
      id: personId,
      type: primaryType,
      label: name,
      description,
      imageUrl: results.map((r) => r.imageUrl).find(Boolean),
      sameAs: [...sameAsMap.values()].map((l) => l.url),
      weight: 9,
      confirmed: true,
    },
  ];
  const edges: EntityGraph["edges"] = [];

  let i = 0;
  for (const { label, url } of sameAsMap.values()) {
    const nodeId = url;
    nodes.push({
      id: nodeId,
      type: "WebPage",
      label,
      description: url,
      weight: 3,
      confirmed: true,
    });
    edges.push({
      id: `lookup-sameas-${i++}`,
      source: personId,
      target: nodeId,
      type: "sameAs",
    });
  }

  return { nodes, edges };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();

  if (!q || q.length < 2 || q.length > 100) {
    return NextResponse.json({ error: "invalid query" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`entity-lookup:${ip}`, 20, 3600)) {
    return NextResponse.json(
      { error: "rate limited" },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  const cacheKey = `entity-lookup:${await sha256(q.toLowerCase())}`;
  const cached = cacheGet<EntityLookupResponse>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  const [serpapi, wikidata, googleKg] = await Promise.all([
    fetchSerpApi(q),
    fetchWikidata(q),
    fetchGoogleKg(q),
  ]);

  const okResults = [serpapi, wikidata, googleKg]
    .filter((r): r is SourceResult & { entity: SourceEntity } =>
      Boolean(r.status === "ok" && r.entity),
    )
    .map((r) => r.entity);

  const confidence =
    okResults.length >= 3
      ? "high"
      : okResults.length === 2
        ? "medium"
        : okResults.length === 1
          ? "low"
          : "none";

  const response: EntityLookupResponse = {
    query: q,
    graph: buildGraph(q, okResults),
    sources: {
      serpapi: serpapi.status,
      wikidata: wikidata.status,
      googleKg: googleKg.status,
    },
    confidence,
    cached: false,
    generatedAt: new Date().toISOString(),
  };

  cacheSet(cacheKey, response, CACHE_TTL_SECONDS);

  return NextResponse.json(response);
}
