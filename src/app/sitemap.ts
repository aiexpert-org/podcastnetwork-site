import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// The retired offer ladder (2026-08-02) took /apply/ and /assessment/ with
// it. Home is the only indexable marketing surface left; legal stays
// noindex per the v0.5 robots policy.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
