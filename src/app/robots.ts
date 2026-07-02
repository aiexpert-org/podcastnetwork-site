import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Generates /robots.txt at build time. Points crawlers at the sitemap.
 *
 * Adjust the `disallow` rules per-site if there are admin/staging paths
 * that shouldn't be indexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
