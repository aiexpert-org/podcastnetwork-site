"use client";

import { useEffect } from "react";

/**
 * PostHog bootstrap. Initializes only when NEXT_PUBLIC_POSTHOG_KEY is set
 * (key provisioning is a NEXT-STEPS item); the site works identically
 * without it.
 */
export function PostHogInit() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    import("posthog-js").then(({ default: posthog }) => {
      posthog.init(key, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
        capture_pageview: true,
        persistence: "memory",
      });
      (window as unknown as { posthog?: unknown }).posthog = posthog;
    });
  }, []);

  return null;
}
