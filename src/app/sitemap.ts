import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Generates /sitemap.xml at build time.
 *
 * Each new top-level route added to the site should be added here.
 * For MDX blog/content collections, generate entries dynamically by
 * reading the content folder and mapping each item to a sitemap entry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    // Add more entries here as new pages/routes are added:
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: now,
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
  ];
}
