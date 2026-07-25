/**
 * PodcastNetwork.org site configuration. Single source of truth for the
 * production URL, brand name, and social links used by metadata, the
 * sitemap, robots, and the JSON-LD schema graph.
 */

/**
 * Resolve the canonical origin.
 *
 * An explicit NEXT_PUBLIC_SITE_URL always wins. Failing that we fall back to
 * the domain Vercel injects at build time, so a production deploy can never
 * emit `http://localhost:3000` in a canonical tag or an OG image URL even if
 * nobody remembered to set the env var. localhost is reachable only outside
 * production.
 */
function resolveSiteUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel sets this to the stable production domain on every deployment,
  // including previews, which keeps canonicals pointed at production.
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  if (process.env.NODE_ENV === "production") {
    // Last resort before localhost leaks into a live page.
    return "https://podcastnetwork.org";
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "PodcastNetwork.org",
  description:
    "PodcastNetwork.org builds entity visibility so AI answer engines recognize you. Two paths: Brand SERP Build and Pre-Sold Author Build.",
  url: resolveSiteUrl(),
  ogImage: "/opengraph-image",
  author: "PodcastNetwork.org",
  email: "brett@podcastnetwork.org",
  links: {
    twitter: "https://x.com/podcastnetwork",
    linkedin: "https://www.linkedin.com/company/podcastnetworkorg/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
