import { parseHTML } from "linkedom";

export type ExtractedData = {
  jsonLd: Record<string, unknown>[];
  microdataTypes: string[];
  rdfaTypes: string[];
  openGraph: Record<string, string>;
  parseErrors: string[];
  orphanObjects: string[];
  unresolvedIds: string[];
  headings: string[];
  bodyText: string;
  links: string[];
};

/** Flatten a JSON-LD document into its constituent typed nodes. */
function flattenJsonLd(doc: unknown): Record<string, unknown>[] {
  if (Array.isArray(doc)) {
    return doc.flatMap(flattenJsonLd);
  }
  if (doc && typeof doc === "object") {
    const obj = doc as Record<string, unknown>;
    const graph = obj["@graph"];
    if (Array.isArray(graph)) {
      return graph.flatMap(flattenJsonLd);
    }
    return [obj];
  }
  return [];
}

export function extractStructuredData(html: string): ExtractedData {
  const { document } = parseHTML(html);

  const jsonLd: Record<string, unknown>[] = [];
  const parseErrors: string[] = [];

  const scripts = document.querySelectorAll(
    'script[type="application/ld+json"]',
  );
  scripts.forEach((script: { textContent: string | null }, i: number) => {
    const raw = script.textContent?.trim();
    if (!raw) return;
    try {
      jsonLd.push(...flattenJsonLd(JSON.parse(raw)));
    } catch (err) {
      parseErrors.push(
        `JSON-LD block ${i + 1} failed to parse: ${err instanceof Error ? err.message : "invalid JSON"}`,
      );
    }
  });

  const orphanObjects: string[] = [];
  for (const node of jsonLd) {
    if (!node["@type"]) {
      orphanObjects.push(
        `Object without @type${node["@id"] ? ` (@id: ${node["@id"]})` : ""}`,
      );
    }
  }

  // @id reference resolution within the page graph.
  const declaredIds = new Set(
    jsonLd.map((n) => n["@id"]).filter((id): id is string => typeof id === "string"),
  );
  const unresolvedIds: string[] = [];
  const collectRefs = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(collectRefs);
    } else if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const keys = Object.keys(obj);
      if (
        keys.length === 1 &&
        typeof obj["@id"] === "string" &&
        obj["@id"].startsWith("http")
      ) {
        // Pure reference node.
        if (!declaredIds.has(obj["@id"])) {
          unresolvedIds.push(obj["@id"]);
        }
      } else {
        keys.forEach((k) => k !== "@context" && collectRefs(obj[k]));
      }
    }
  };
  jsonLd.forEach((n) => collectRefs(n));

  const microdataTypes: string[] = [];
  document
    .querySelectorAll("[itemtype]")
    .forEach((el: { getAttribute: (a: string) => string | null }) => {
      const t = el.getAttribute("itemtype");
      if (t) microdataTypes.push(t);
    });

  const rdfaTypes: string[] = [];
  document
    .querySelectorAll("[typeof]")
    .forEach((el: { getAttribute: (a: string) => string | null }) => {
      const t = el.getAttribute("typeof");
      if (t) rdfaTypes.push(t);
    });

  const openGraph: Record<string, string> = {};
  document
    .querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')
    .forEach(
      (el: { getAttribute: (a: string) => string | null }) => {
        const key = el.getAttribute("property") ?? el.getAttribute("name");
        const content = el.getAttribute("content");
        if (key && content) openGraph[key] = content;
      },
    );

  const headings: string[] = [];
  document
    .querySelectorAll("h1, h2, h3, h4")
    .forEach((el: { textContent: string | null }) => {
      if (el.textContent) headings.push(el.textContent.trim());
    });

  const links: string[] = [];
  document
    .querySelectorAll("a[href]")
    .forEach((el: { getAttribute: (a: string) => string | null }) => {
      const href = el.getAttribute("href");
      if (href) links.push(href);
    });

  const bodyText = (document.body?.textContent ?? "").slice(0, 200_000);

  return {
    jsonLd,
    microdataTypes,
    rdfaTypes,
    openGraph,
    parseErrors,
    orphanObjects,
    unresolvedIds: [...new Set(unresolvedIds)].slice(0, 20),
    headings,
    bodyText,
    links,
  };
}
