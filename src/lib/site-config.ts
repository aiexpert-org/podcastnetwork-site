/**
 * PodcastNetwork.org site configuration. Single source of truth for the
 * production URL, brand name, and social links used by metadata, the
 * sitemap, robots, and the JSON-LD schema graph.
 */

export const siteConfig = {
  name: "PodcastNetwork.org",
  description:
    "The network and relationship-engine infrastructure behind Brett K. Moore's shows and brands.",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, ""),
  ogImage: "/opengraph-image",
  author: "PodcastNetwork.org",
  email: "brett@podcastnetwork.org",
  links: {
    twitter: "https://x.com/podcastnetwork",
    linkedin: "https://www.linkedin.com/company/podcastnetworkorg/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
