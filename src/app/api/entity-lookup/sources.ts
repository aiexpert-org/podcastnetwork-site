/**
 * The three data sources behind the You Search demo. Each adapter returns a
 * normalized SourceResult or null (null = no data / error; the fan-out never
 * fails the request because one source failed).
 */

export type SourceEntity = {
  name: string;
  type: "Person" | "Organization";
  description?: string;
  longDescription?: string;
  imageUrl?: string;
  website?: string;
  sameAs: { label: string; url: string }[];
};

export type SourceResult = {
  entity: SourceEntity | null;
  status: "ok" | "no-data" | "error";
};

const TIMEOUT_MS = 8000;

function mapKgType(types: string[] | string | undefined): "Person" | "Organization" {
  const list = Array.isArray(types) ? types : types ? [types] : [];
  if (list.some((t) => /organization|corporation|company/i.test(t))) {
    return "Organization";
  }
  return "Person";
}

export async function fetchSerpApi(q: string): Promise<SourceResult> {
  const key = process.env.SERPAPI_KEY;
  if (!key) return { entity: null, status: "error" };

  try {
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${key}`;
    let res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 500));
      res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    }
    if (!res.ok) return { entity: null, status: "error" };

    const json = (await res.json()) as {
      knowledge_graph?: {
        title?: string;
        type?: string;
        description?: string;
        thumbnail?: string;
        website?: string;
        profiles?: { name?: string; link?: string }[];
      };
    };
    const kg = json.knowledge_graph;
    if (!kg?.title) return { entity: null, status: "no-data" };

    return {
      status: "ok",
      entity: {
        name: kg.title,
        type: mapKgType(kg.type),
        description: kg.description,
        imageUrl: kg.thumbnail,
        website: kg.website,
        sameAs: (kg.profiles ?? [])
          .filter((p) => p.link)
          .map((p) => ({ label: p.name ?? "Profile", url: p.link! })),
      },
    };
  } catch {
    return { entity: null, status: "error" };
  }
}

const WIKIDATA_UA =
  "PodcastNetworkOrg-EntityLookup/1.0 (https://podcastnetwork.org; brett@podcastnetwork.org)";

const WIKIDATA_SAMEAS_PROPS: Record<string, { label: string; urlFor: (v: string) => string }> = {
  P2002: { label: "X (Twitter)", urlFor: (v) => `https://x.com/${v}` },
  P2013: { label: "Facebook", urlFor: (v) => `https://www.facebook.com/${v}` },
  P6634: {
    label: "LinkedIn",
    urlFor: (v) => `https://www.linkedin.com/in/${v}/`,
  },
  P4033: { label: "Mastodon", urlFor: (v) => `https://mastodon.social/@${v}` },
};

export async function fetchWikidata(q: string): Promise<SourceResult> {
  try {
    const searchRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(q)}&language=en&format=json&limit=3&origin=*`,
      {
        headers: { "User-Agent": WIKIDATA_UA },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );
    if (!searchRes.ok) return { entity: null, status: "error" };
    const search = (await searchRes.json()) as {
      search?: { id: string; label?: string; description?: string }[];
    };
    const top = search.search?.[0];
    if (!top) return { entity: null, status: "no-data" };

    const hydrateRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${top.id}&props=labels|descriptions|claims|sitelinks&languages=en&format=json&origin=*`,
      {
        headers: { "User-Agent": WIKIDATA_UA },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );
    if (!hydrateRes.ok) return { entity: null, status: "error" };
    const hydrated = (await hydrateRes.json()) as {
      entities?: Record<
        string,
        {
          labels?: { en?: { value?: string } };
          descriptions?: { en?: { value?: string } };
          claims?: Record<
            string,
            { mainsnak?: { datavalue?: { value?: unknown } } }[]
          >;
          sitelinks?: { enwiki?: { title?: string } };
        }
      >;
    };
    const entity = hydrated.entities?.[top.id];
    if (!entity) return { entity: null, status: "no-data" };

    const claims = entity.claims ?? {};
    const sameAs: { label: string; url: string }[] = [
      { label: "Wikidata", url: `https://www.wikidata.org/wiki/${top.id}` },
    ];

    for (const [prop, def] of Object.entries(WIKIDATA_SAMEAS_PROPS)) {
      const value = claims[prop]?.[0]?.mainsnak?.datavalue?.value;
      if (typeof value === "string") {
        sameAs.push({ label: def.label, url: def.urlFor(value) });
      }
    }

    const website = claims.P856?.[0]?.mainsnak?.datavalue?.value;
    const image = claims.P18?.[0]?.mainsnak?.datavalue?.value;
    const wikipediaTitle = entity.sitelinks?.enwiki?.title;
    if (wikipediaTitle) {
      sameAs.push({
        label: "Wikipedia",
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikipediaTitle.replace(/ /g, "_"))}`,
      });
    }

    // Occupation-free heuristic: Wikidata humans carry P31 -> Q5.
    const instanceOf = claims.P31?.[0]?.mainsnak?.datavalue?.value as
      | { id?: string }
      | undefined;
    const type = instanceOf?.id === "Q5" ? "Person" : "Organization";

    return {
      status: "ok",
      entity: {
        name: entity.labels?.en?.value ?? top.label ?? q,
        type,
        description: entity.descriptions?.en?.value ?? top.description,
        imageUrl:
          typeof image === "string"
            ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(image)}`
            : undefined,
        website: typeof website === "string" ? website : undefined,
        sameAs,
      },
    };
  } catch {
    return { entity: null, status: "error" };
  }
}

export async function fetchGoogleKg(q: string): Promise<SourceResult> {
  const key = process.env.GOOGLE_KG_API_KEY;
  if (!key) return { entity: null, status: "error" };

  try {
    const res = await fetch(
      `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(q)}&key=${key}&limit=3`,
      { signal: AbortSignal.timeout(TIMEOUT_MS) },
    );
    if (!res.ok) return { entity: null, status: "error" };
    const json = (await res.json()) as {
      itemListElement?: {
        result?: {
          name?: string;
          "@type"?: string[];
          description?: string;
          detailedDescription?: { articleBody?: string; url?: string };
          image?: { contentUrl?: string };
        };
      }[];
    };
    const result = json.itemListElement?.[0]?.result;
    if (!result?.name) return { entity: null, status: "no-data" };

    const sameAs: { label: string; url: string }[] = [];
    if (result.detailedDescription?.url) {
      sameAs.push({ label: "Wikipedia", url: result.detailedDescription.url });
    }

    return {
      status: "ok",
      entity: {
        name: result.name,
        type: mapKgType(result["@type"]),
        description: result.description,
        longDescription: result.detailedDescription?.articleBody,
        imageUrl: result.image?.contentUrl,
        sameAs,
      },
    };
  } catch {
    return { entity: null, status: "error" };
  }
}
