/**
 * JSON-LD graph composition. The 19 shipped payloads in content/schema/ are
 * the source of truth; this module composes them per page following
 * content/schema/19-graph-composition.json. Every page emits exactly ONE
 * script tag with @context + @graph, cross-referenced by stable @id.
 *
 * Sanitization: internal $-prefixed keys are stripped, and any property or
 * array entry still carrying a {{PLACEHOLDER}} token is dropped rather than
 * shipped (Wikidata Q-numbers, ISBN, review bodies pending real data).
 */

import orgPayload from "../../content/schema/01-organization.json";
import websitePayload from "../../content/schema/02-website-searchaction.json";
import servicePayload from "../../content/schema/03-professionalservice.json";
import kpServicePayload from "../../content/schema/20-knowledge-panel-service.json";
import faqPayload from "../../content/schema/05-faqpage.json";
import bookPayload from "../../content/schema/06-book.json";
import podcastPayload from "../../content/schema/07-podcastseries.json";
import brettPayload from "../../content/schema/10-person-brett.json";
import mikePayload from "../../content/schema/11-person-mike.json";
import coursePayload from "../../content/schema/15-course.json";
import howtoPayload from "../../content/schema/16-howto.json";

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

/** Pull specific Question entities (full objects) out of the FAQ payload. */
function faqQuestions(ids: string[]): SchemaNode[] {
  const all = (faqPayload as { mainEntity: SchemaNode[] }).mainEntity ?? [];
  const wanted = new Set(ids.map((id) => `${BASE}/faq/#${id}`));
  return all
    .filter((q) => typeof q["@id"] === "string" && wanted.has(q["@id"] as string))
    .map((q) => sanitize(q) as SchemaNode);
}

/** Q&A text for UI rendering, pulled from the same payload the schema emits
 * so on-page text and JSON-LD stay in lockstep. */
export function faqItemsForUi(
  ids: string[],
): { question: string; answer: string }[] {
  return faqQuestions(ids).map((q) => ({
    question: String(q.name ?? ""),
    answer: String(
      (q.acceptedAnswer as SchemaNode | undefined)?.text ?? "",
    ),
  }));
}

export function homeSchema(): SchemaNode {
  const questions = faqQuestions([
    "what-does-pre-sold-author-cover",
    "what-does-knowledge-panel-install-cover",
    "both-packages-together",
    "is-this-just-for-real-estate",
    "no-podcast-yet",
    "versus-diy",
  ]);

  return graph([
    node(orgPayload),
    node(websitePayload),
    {
      "@type": "WebPage",
      "@id": `${BASE}/#webpage`,
      url: `${BASE}/`,
      name: "PodcastNetwork.org: two paths to Google authority",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/#breadcrumb` },
      about: { "@id": `${BASE}/the-package/#service` },
      inLanguage: "en-US",
    },
    breadcrumb(`${BASE}/#breadcrumb`, [HOME_CRUMB]),
    node(servicePayload),
    node(kpServicePayload),
    node(brettPayload),
    node(mikePayload),
    node(bookPayload),
    node(podcastPayload),
    {
      "@type": "FAQPage",
      "@id": `${BASE}/#faq-homepage`,
      mainEntity: questions,
    },
  ]);
}

export function methodSchema(): SchemaNode {
  return graph([
    node(orgPayload),
    node(coursePayload),
    node(howtoPayload),
    breadcrumb(`${BASE}/the-method/#breadcrumb`, [
      HOME_CRUMB,
      { name: "The Method", item: `${BASE}/the-method/` },
    ]),
  ]);
}

export function packageSchema(): SchemaNode {
  const questions = faqQuestions([
    "what-does-pre-sold-author-cover",
    "six-months-not-24",
    "manuscript-in-hand",
    "no-podcast-yet",
    "legacy-jv",
    "pre-sold-audience-mechanics",
    "both-packages-together",
    "is-this-just-for-real-estate",
    "payment-terms",
    "refund",
    "what-if-i-slip",
    "versus-diy",
    "application-timeline",
  ]);

  return graph([
    node(orgPayload),
    node(servicePayload),
    {
      "@type": "FAQPage",
      "@id": `${BASE}/the-package/#faq-package`,
      mainEntity: questions,
    },
    breadcrumb(`${BASE}/the-package/#breadcrumb`, [
      HOME_CRUMB,
      { name: "The Pre-Sold Author Package", item: `${BASE}/the-package/` },
    ]),
  ]);
}

export function knowledgePanelSchema(): SchemaNode {
  const questions = faqQuestions([
    "what-does-knowledge-panel-install-cover",
    "twelve-months-not-24",
    "knowledge-panel-mechanics",
    "no-podcast-yet",
    "optional-podcast-setup",
    "both-packages-together",
    "is-this-just-for-real-estate",
    "payment-terms",
    "refund",
    "knowledge-panel-versus-diy",
    "application-timeline",
  ]);

  return graph([
    node(orgPayload),
    node(kpServicePayload),
    {
      "@type": "FAQPage",
      "@id": `${BASE}/knowledge-panel-install/#faq-knowledge-panel`,
      mainEntity: questions,
    },
    breadcrumb(`${BASE}/knowledge-panel-install/#breadcrumb`, [
      HOME_CRUMB,
      {
        name: "The Brand SERP Install",
        item: `${BASE}/knowledge-panel-install/`,
      },
    ]),
  ]);
}

export function caseStudiesHubSchema(): SchemaNode {
  return graph([
    node(orgPayload),
    {
      "@type": "CollectionPage",
      "@id": `${BASE}/case-studies/#collection`,
      url: `${BASE}/case-studies/`,
      name: "Case studies: live entity pages",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/the-package/#service` },
      inLanguage: "en-US",
    },
    breadcrumb(`${BASE}/case-studies/#breadcrumb`, [
      HOME_CRUMB,
      { name: "Case Studies", item: `${BASE}/case-studies/` },
    ]),
  ]);
}

export function aiOrDieSchema(): SchemaNode {
  return graph([
    node(orgPayload),
    node(brettPayload),
    node(mikePayload),
    node(bookPayload),
    node(podcastPayload),
    {
      "@type": "Article",
      "@id": `${BASE}/case-studies/ai-or-die/#article`,
      headline: "AI or Die: the founder-run case study",
      author: [
        { "@id": `${BASE}/about/#brett-k-moore` },
        { "@id": `${BASE}/about/#mike-partners` },
      ],
      publisher: { "@id": `${BASE}/#organization` },
      datePublished: "2026-07-02",
      dateModified: "2026-07-02",
      mainEntityOfPage: `${BASE}/case-studies/ai-or-die/`,
      inLanguage: "en-US",
    },
    breadcrumb(`${BASE}/case-studies/ai-or-die/#breadcrumb`, [
      HOME_CRUMB,
      { name: "Case Studies", item: `${BASE}/case-studies/` },
      { name: "AI or Die", item: `${BASE}/case-studies/ai-or-die/` },
    ]),
  ]);
}

export function inLaunchCaseStudySchema(
  slug: string,
  name: string,
  bookTitle: string | null,
): SchemaNode {
  const personId = `${BASE}/case-studies/${slug}/#person`;
  const nodes: SchemaNode[] = [
    node(orgPayload),
    {
      "@type": "Person",
      "@id": personId,
      name,
      description: `${name} is a non-fiction author inside the current PodcastNetwork.org cohort, running the Pre-Sold Author Package on the 180-day clock.`,
      mainEntityOfPage: `${BASE}/case-studies/${slug}/`,
    },
    breadcrumb(`${BASE}/case-studies/${slug}/#breadcrumb`, [
      HOME_CRUMB,
      { name: "Case Studies", item: `${BASE}/case-studies/` },
      { name, item: `${BASE}/case-studies/${slug}/` },
    ]),
  ];
  if (bookTitle) {
    nodes.splice(2, 0, {
      "@type": "Book",
      "@id": `${BASE}/case-studies/${slug}/#book`,
      name: bookTitle,
      author: { "@id": personId },
      publisher: {
        "@type": "Organization",
        name: "Legacy Publishing",
        url: "https://legacypublishing.com/",
      },
    });
  }
  return graph(nodes);
}

export function foundersSchema(): SchemaNode {
  return graph([
    node(orgPayload),
    node(brettPayload),
    node(mikePayload),
    node(bookPayload),
    {
      "@type": "ProfilePage",
      "@id": `${BASE}/founders/#profilepage`,
      url: `${BASE}/founders/`,
      mainEntity: { "@id": `${BASE}/about/#brett-k-moore` },
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

export function applySchema(): SchemaNode {
  return graph([
    node(orgPayload),
    {
      "@type": "WebPage",
      "@id": `${BASE}/apply/#webpage`,
      url: `${BASE}/apply/`,
      name: "Apply: the application is the diagnostic",
      isPartOf: { "@id": `${BASE}/#website` },
      mainEntity: { "@id": `${BASE}/the-package/#service` },
      inLanguage: "en-US",
    },
    node(servicePayload),
    breadcrumb(`${BASE}/apply/#breadcrumb`, [
      HOME_CRUMB,
      { name: "Apply", item: `${BASE}/apply/` },
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
