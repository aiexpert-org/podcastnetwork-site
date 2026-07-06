/**
 * PodcastNetwork.org site configuration. Single source of truth for the
 * production URL, brand name, and social links used by metadata, the
 * sitemap, robots, and the JSON-LD schema graph.
 */

export const siteConfig = {
  name: "PodcastNetwork.org",
  description:
    "PodcastNetwork.org builds entity visibility so AI answer engines recognize you. Two paths: Knowledge Panel Install and Pre-Sold Author Package.",
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
