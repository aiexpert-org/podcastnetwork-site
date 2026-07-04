/**
 * PodcastNetwork.org site configuration. Single source of truth for the
 * production URL, brand name, and social links used by metadata, the
 * sitemap, robots, and the JSON-LD schema graph.
 */

export const siteConfig = {
  name: "PodcastNetwork.org",
  description:
    "PodcastNetwork.org builds Google authority for executives, authors, and entrepreneurs who want to be recognized as a real entity. Two paths: a Knowledge Panel Install and a Pre-Sold Author Package. Real signals, application only.",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, ""),
  ogImage: "/og/og-default.png",
  author: "PodcastNetwork.org",
  email: "brett@podcastnetwork.org",
  links: {
    twitter: "https://x.com/podcastnetwork",
    linkedin: "https://www.linkedin.com/company/podcastnetworkorg/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
