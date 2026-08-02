/**
 * JSON-LD graph composition. The shipped payloads in content/schema/ are the
 * source of truth; this module composes them per page following
 * content/schema/19-graph-composition.json. Every page emits exactly ONE
 * script tag with @context + @graph, cross-referenced by stable @id.
 *
 * Sanitization: internal $-prefixed keys are stripped, and any property or
 * array entry still carrying a {{PLACEHOLDER}} token is dropped rather than
 * shipped (Wikidata Q-numbers pending real data).
 *
 * 2026-08-02: the retired offer ladder took the service, book, course,
 * how-to, and FAQ payloads with it, along with every package, method, and
 * case-study composer.
 */

import orgPayload from "../../content/schema/01-organization.json";
import websitePayload from "../../content/schema/02-website-searchaction.json";
import podcastPayload from "../../content/schema/07-podcastseries.json";
import brettPayload from "../../content/schema/10-person-brett.json";
import mikePayload from "../../content/schema/11-person-mike.json";

type SchemaNode = Record<string, unknown>;

const BASE = "https://podcastnetwork.org";

function hasPlaceholder(value: unknown): boolean {
  return typeof value === "string" && value.includes("{{");
}

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) {
    const cleaned = value
      .filter((v) => !hasPlaceholder(v))
      .map(sanitize)
      .filter((v) => v !== undefined);
    return cleaned;
  }
  if (value && typeof value === "object") {
    const out: SchemaNode = {};
    for (const [k, v] of Object.entries(value as SchemaNode)) {
      if (k.startsWith("$")) continue;
      if (hasPlaceholder(v)) continue;
      const cleaned = sanitize(v);
      if (cleaned === undefined) continue;
      if (Array.isArray(cleaned) && cleaned.length === 0) continue;
      out[k] = cleaned;
    }
    return out;
  }
  return hasPlaceholder(value) ? undefined : value;
}

/** Sanitize a payload and strip its own @context (added once at graph level). */
function node(payload: unknown): SchemaNode {
  const cleaned = sanitize(payload) as SchemaNode;
  delete cleaned["@context"];
  return cleaned;
}

function graph(nodes: SchemaNode[]): SchemaNode {
  return { "@context": "https://schema.org", "@graph": nodes };
}

function breadcrumb(
  id: string,
  items: { name: string; item: string }[],
): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

const HOME_CRUMB = { name: "Home", item: `${BASE}/` };

export function homeSchema(): SchemaNode {
  return graph([
    node(orgPayload),
    node(websitePayload),
    {
      "@type": "WebPage",
      "@id": `${BASE}/#webpage`,
      url: `${BASE}/`,
      name: "PodcastNetwork.org: network and relationship-engine infrastructure",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/#breadcrumb` },
      mainEntity: { "@id": `${BASE}/#organization` },
      inLanguage: "en-US",
    },
    breadcrumb(`${BASE}/#breadcrumb`, [HOME_CRUMB]),
    node(brettPayload),
    node(mikePayload),
    node(podcastPayload),
  ]);
}

export function foundersSchema(): SchemaNode {
  return graph([
    node(orgPayload),
    node(brettPayload),
    node(mikePayload),
    {
      "@type": "CollectionPage",
      "@id": `${BASE}/founders/#collection`,
      url: `${BASE}/founders/`,
      name: "Founders of PodcastNetwork.org",
      about: [
        { "@id": `${BASE}/about/#brett-k-moore` },
        { "@id": `${BASE}/about/#mike-partners` },
      ],
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    breadcrumb(`${BASE}/founders/#breadcrumb`, [
      HOME_CRUMB,
      { name: "Founders", item: `${BASE}/founders/` },
    ]),
  ]);
}

export function brettProfileSchema(): SchemaNode {
  return graph([
    node(orgPayload),
    node(brettPayload),
    node(mikePayload),
    {
      "@type": "ProfilePage",
      "@id": `${BASE}/founders/brett-k-moore/#profilepage`,
      url: `${BASE}/founders/brett-k-moore/`,
      mainEntity: { "@id": `${BASE}/about/#brett-k-moore` },
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    breadcrumb(`${BASE}/founders/brett-k-moore/#breadcrumb`, [
      HOME_CRUMB,
      { name: "Founders", item: `${BASE}/founders/` },
      { name: "Brett K. Moore", item: `${BASE}/founders/brett-k-moore/` },
    ]),
  ]);
}

export function mikeProfileSchema(): SchemaNode {
  return graph([
    node(orgPayload),
    node(mikePayload),
    node(brettPayload),
    {
      "@type": "ProfilePage",
      "@id": `${BASE}/founders/mike-partners/#profilepage`,
      url: `${BASE}/founders/mike-partners/`,
      mainEntity: { "@id": `${BASE}/about/#mike-partners` },
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    breadcrumb(`${BASE}/founders/mike-partners/#breadcrumb`, [
      HOME_CRUMB,
      { name: "Founders", item: `${BASE}/founders/` },
      { name: "Mike Partners", item: `${BASE}/founders/mike-partners/` },
    ]),
  ]);
}

export function legalSchema(slug: string, name: string): SchemaNode {
  return graph([
    node(orgPayload),
    {
      "@type": "WebPage",
      "@id": `${BASE}/legal/${slug}/#webpage`,
      url: `${BASE}/legal/${slug}/`,
      name,
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    breadcrumb(`${BASE}/legal/${slug}/#breadcrumb`, [
      HOME_CRUMB,
      { name, item: `${BASE}/legal/${slug}/` },
    ]),
  ]);
}
