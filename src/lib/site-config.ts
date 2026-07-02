/**
 * Per-deployment site configuration.
 *
 * Every site spun up from nextjs-site-template should edit this file to set its
 * own name, description, and social links. The production URL is set via the
 * NEXT_PUBLIC_SITE_URL environment variable in Vercel (or .env.local for dev).
 *
 * This single config is the source of truth for:
 *   - metadataBase (resolves absolute URLs for og:image, canonical, etc.)
 *   - openGraph and twitter card metadata (social sharing previews)
 *   - sitemap.xml generation
 *   - robots.txt generation
 *
 * Don't sprinkle the site URL around the codebase. Reference siteConfig instead.
 */

export const siteConfig = {
  /** The site's display name. Shown in browser tab, og:site_name, og:title fallback. */
  name: "Site Template",

  /** Tagline / meta description. Shown in search results and og:description fallback. */
  description:
    "A modern, story-led website template for owner-operator service businesses.",

  /**
   * Production URL. Set NEXT_PUBLIC_SITE_URL in Vercel to override.
   * Falls back to localhost for dev. Must NOT have a trailing slash.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),

  /**
   * Default Open Graph image, relative to /public.
   * Should be 1200×630 PNG/JPG. Override per-page via per-page metadata.
   */
  ogImage: "/og-default.png",

  /** Author / brand owner name. Used in <meta name="author"> and structured data. */
  author: "",

  /** Optional social links — left blank by default. Fill in per site. */
  links: {
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
