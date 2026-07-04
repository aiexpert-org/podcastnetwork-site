import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
    { path: "/the-method/", priority: 0.9 },
    { path: "/knowledge-panel-install/", priority: 0.9 },
    { path: "/the-package/", priority: 0.9 },
    { path: "/case-studies/", priority: 0.8 },
    { path: "/case-studies/ai-or-die/", priority: 0.8 },
    { path: "/case-studies/michele-okimura/", priority: 0.6 },
    { path: "/case-studies/dominic-jones/", priority: 0.6 },
    { path: "/case-studies/rob-okimura/", priority: 0.6 },
    { path: "/founders/", priority: 0.8 },
    { path: "/apply/", priority: 0.9 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
