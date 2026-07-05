import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// 3-surface architecture (2026-07-04): Home + Apply are the indexable
// surfaces. Legal stays noindex per the v0.5 robots policy, and the killed
// marketing routes redirect to homepage anchors.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
    { path: "/apply/", priority: 0.9 },
    { path: "/assessment/", priority: 0.8 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
