import type { ExtractedData } from "./extract";

export type RubricItemResult = {
  id: string;
  label: string;
  earnedPoints: number;
  maxPoints: number;
  passed: boolean;
  detectedEntities?: string[];
  warning?: string;
};

export type ContextHeuristics = {
  hasFaqContent: boolean;
  hasBookContext: boolean;
  hasPodcastContext: boolean;
  missingSchemaWarnings: string[];
};

function typesOf(node: Record<string, unknown>): string[] {
  const t = node["@type"];
  if (Array.isArray(t)) return t.map(String);
  if (typeof t === "string") return [t];
  return [];
}

function nodesOfType(
  jsonLd: Record<string, unknown>[],
  ...types: string[]
): Record<string, unknown>[] {
  return jsonLd.filter((n) =>
    typesOf(n).some((t) =>
      types.some((want) => t.toLowerCase() === want.toLowerCase()),
    ),
  );
}

function idOf(node: Record<string, unknown>): string {
  return typeof node["@id"] === "string"
    ? node["@id"]
    : typesOf(node).join(",");
}

function has(node: Record<string, unknown>, prop: string): boolean {
  const v = node[prop];
  if (v === undefined || v === null || v === "") return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function sameAsList(node: Record<string, unknown>): string[] {
  const v = node.sameAs;
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") return [v];
  return [];
}

export function detectContextHeuristics(data: ExtractedData): ContextHeuristics {
  const questionHeadings = data.headings.filter((h) => h.includes("?"));
  const hasFaqContent = questionHeadings.length >= 3;

  const text = data.bodyText.toLowerCase();
  const linkText = data.links.join(" ").toLowerCase();
  const hasBookContext =
    /amazon\.com\/(dp|gp\/product)|goodreads\.com\/book|isbn[-:\s]*[\d-]{10,}/.test(
      linkText + " " + text,
    );
  const hasPodcastContext =
    /open\.spotify\.com\/show|podcasts\.apple\.com|\/rss|\/feed\.xml|podcast/.test(
      linkText,
    ) || /\bpodcast\b/.test(text);

  const missingSchemaWarnings: string[] = [];
  return { hasFaqContent, hasBookContext, hasPodcastContext, missingSchemaWarnings };
}

export function scoreAgainstRubric(
  data: ExtractedData,
  heuristics: ContextHeuristics,
): { total: number; itemResults: RubricItemResult[] } {
  const { jsonLd } = data;
  const items: RubricItemResult[] = [];

  const orgs = nodesOfType(jsonLd, "Organization", "LocalBusiness", "ProfessionalService", "Corporation");
  const orgComplete = orgs.filter(
    (o) => has(o, "name") && has(o, "url") && has(o, "logo"),
  );
  items.push({
    id: "org-core",
    label: "Organization schema with name, url, logo",
    maxPoints: 10,
    earnedPoints: orgComplete.length > 0 ? 10 : 0,
    passed: orgComplete.length > 0,
    detectedEntities: orgComplete.map(idOf),
    warning:
      orgs.length > 0 && orgComplete.length === 0
        ? "Organization found but missing name, url, or logo."
        : orgs.length === 0
          ? "No Organization entity found."
          : undefined,
  });

  const orgWithSameAs = orgs.filter((o) => sameAsList(o).length >= 2);
  items.push({
    id: "org-sameas",
    label: "Organization sameAs with 2+ profiles",
    maxPoints: 5,
    earnedPoints: orgWithSameAs.length > 0 ? 5 : 0,
    passed: orgWithSameAs.length > 0,
    detectedEntities: orgWithSameAs.map(idOf),
  });

  const websites = nodesOfType(jsonLd, "WebSite");
  const websiteComplete = websites.filter((w) => has(w, "url") && has(w, "name"));
  items.push({
    id: "website-core",
    label: "WebSite schema with url and name",
    maxPoints: 5,
    earnedPoints: websiteComplete.length > 0 ? 5 : 0,
    passed: websiteComplete.length > 0,
    detectedEntities: websiteComplete.map(idOf),
  });

  const websiteWithSearch = websites.filter((w) => {
    const action = w.potentialAction;
    const actions = Array.isArray(action) ? action : action ? [action] : [];
    return actions.some(
      (a) =>
        a &&
        typeof a === "object" &&
        typesOf(a as Record<string, unknown>).includes("SearchAction"),
    );
  });
  items.push({
    id: "website-searchaction",
    label: "WebSite SearchAction potentialAction",
    maxPoints: 5,
    earnedPoints: websiteWithSearch.length > 0 ? 5 : 0,
    passed: websiteWithSearch.length > 0,
  });

  const persons = nodesOfType(jsonLd, "Person");
  const personComplete = persons.filter(
    (p) => has(p, "name") && has(p, "jobTitle"),
  );
  items.push({
    id: "person-core",
    label: "Person entity with name and jobTitle",
    maxPoints: 10,
    earnedPoints: personComplete.length > 0 ? 10 : 0,
    passed: personComplete.length > 0,
    detectedEntities: personComplete.map(idOf),
    warning:
      persons.length > 0 && personComplete.length === 0
        ? "Person found but missing jobTitle."
        : persons.length === 0
          ? "No Person entity found. Knowledge Panels anchor on Person entities."
          : undefined,
  });

  const personWithSameAs = persons.filter((p) => sameAsList(p).length >= 4);
  items.push({
    id: "person-sameas",
    label: "Person sameAs with 4+ external profiles",
    maxPoints: 5,
    earnedPoints: personWithSameAs.length > 0 ? 5 : 0,
    passed: personWithSameAs.length > 0,
  });

  const allSameAs = new Set<string>([
    ...orgs.flatMap(sameAsList),
    ...persons.flatMap(sameAsList),
  ]);
  items.push({
    id: "sameas-union",
    label: "4+ unique sameAs profiles across Person + Organization",
    maxPoints: 10,
    earnedPoints: allSameAs.size >= 4 ? 10 : 0,
    passed: allSameAs.size >= 4,
    warning:
      allSameAs.size > 0 && allSameAs.size < 4
        ? `Only ${allSameAs.size} unique sameAs link${allSameAs.size === 1 ? "" : "s"} found.`
        : undefined,
  });

  const faqPages = nodesOfType(jsonLd, "FAQPage");
  const faqPassed = faqPages.length > 0 || !heuristics.hasFaqContent;
  items.push({
    id: "faqpage",
    label: "FAQPage schema where FAQ content exists",
    maxPoints: 10,
    earnedPoints: faqPages.length > 0 ? 10 : heuristics.hasFaqContent ? 0 : 10,
    passed: faqPassed,
    warning:
      heuristics.hasFaqContent && faqPages.length === 0
        ? "Page has FAQ-style content (3+ question headings) but no FAQPage schema."
        : undefined,
  });

  const breadcrumbs = nodesOfType(jsonLd, "BreadcrumbList").filter((b) => {
    const el = b.itemListElement;
    return Array.isArray(el) && el.length >= 2;
  });
  items.push({
    id: "breadcrumb",
    label: "BreadcrumbList with 2+ items",
    maxPoints: 5,
    earnedPoints: breadcrumbs.length > 0 ? 5 : 0,
    passed: breadcrumbs.length > 0,
  });

  const articles = nodesOfType(jsonLd, "Article", "NewsArticle", "BlogPosting");
  const articleComplete = articles.filter(
    (a) => has(a, "headline") && has(a, "author") && has(a, "datePublished"),
  );
  items.push({
    id: "article",
    label: "Article schema with headline, author, datePublished",
    maxPoints: 10,
    earnedPoints: articleComplete.length > 0 ? 10 : 0,
    passed: articleComplete.length > 0,
    warning:
      articles.length > 0 && articleComplete.length === 0
        ? "Article found but missing headline, author, or datePublished."
        : undefined,
  });

  const books = nodesOfType(jsonLd, "Book");
  const bookComplete = books.filter(
    (b) => has(b, "name") && has(b, "author") && (has(b, "isbn") || sameAsList(b).length > 0),
  );
  const bookEarned = bookComplete.length > 0 ? 10 : heuristics.hasBookContext ? 0 : 10;
  items.push({
    id: "book",
    label: "Book schema where book context exists",
    maxPoints: 10,
    earnedPoints: bookEarned,
    passed: bookEarned > 0,
    warning:
      heuristics.hasBookContext && bookComplete.length === 0
        ? "Book context detected (Amazon/Goodreads/ISBN) but no complete Book schema."
        : undefined,
  });

  const podcasts = nodesOfType(jsonLd, "PodcastSeries", "PodcastEpisode");
  const podcastEarned =
    podcasts.length > 0 ? 5 : heuristics.hasPodcastContext ? 0 : 5;
  items.push({
    id: "podcast",
    label: "PodcastSeries or PodcastEpisode schema where podcast context exists",
    maxPoints: 5,
    earnedPoints: podcastEarned,
    passed: podcastEarned > 0,
    warning:
      heuristics.hasPodcastContext && podcasts.length === 0
        ? "Podcast context detected but no PodcastSeries/PodcastEpisode schema."
        : undefined,
  });

  const cleanJsonLd =
    data.parseErrors.length === 0 &&
    data.orphanObjects.length === 0 &&
    data.unresolvedIds.length === 0;
  items.push({
    id: "clean-jsonld",
    label: "All JSON-LD validates cleanly (no parse errors, orphans, broken @id refs)",
    maxPoints: 10,
    earnedPoints: jsonLd.length > 0 && cleanJsonLd ? 10 : 0,
    passed: jsonLd.length > 0 && cleanJsonLd,
    warning: !cleanJsonLd
      ? [
          ...data.parseErrors,
          ...data.orphanObjects,
          ...data.unresolvedIds.map((id) => `Unresolved @id reference: ${id}`),
        ].join(" · ")
      : jsonLd.length === 0
        ? "No JSON-LD found on the page."
        : undefined,
  });

  const total = items.reduce((sum, i) => sum + i.earnedPoints, 0);
  return { total, itemResults: items };
}

export function bandFromScore(score: number): "low" | "medium" | "high" {
  if (score <= 40) return "low";
  if (score <= 70) return "medium";
  return "high";
}
