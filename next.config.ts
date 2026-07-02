import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Deferred pages from the old sitemap route to the closest active v0.5
    // page, per path-b-v0.5/05-six-page-sitemap-override.md.
    return [
      { source: "/book", destination: "/the-package/", permanent: false },
      { source: "/book/:path*", destination: "/the-package/", permanent: false },
      { source: "/podcast", destination: "/case-studies/", permanent: false },
      { source: "/podcast/:path*", destination: "/case-studies/", permanent: false },
      { source: "/about", destination: "/founders/", permanent: false },
      { source: "/about/:path*", destination: "/founders/", permanent: false },
      { source: "/faq", destination: "/#faq", permanent: false },
      { source: "/journal", destination: "/case-studies/", permanent: false },
      { source: "/journal/:path*", destination: "/case-studies/", permanent: false },
      { source: "/methodology", destination: "/the-method/", permanent: false },
      { source: "/pre-sold-author-package", destination: "/the-package/", permanent: false },
      { source: "/pillars/:path*", destination: "/the-package/", permanent: false },
      { source: "/knowledge-panel", destination: "/", permanent: false },
      { source: "/contact", destination: "/apply/", permanent: false },
      { source: "/privacy", destination: "/legal/privacy/", permanent: false },
      { source: "/terms", destination: "/legal/terms/", permanent: false },
      { source: "/cookies", destination: "/legal/privacy/", permanent: false },
    ];
  },
};

export default nextConfig;
