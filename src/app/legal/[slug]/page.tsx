import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SchemaGraph } from "@/components/seo/SchemaGraph";
import { legalSchema } from "@/lib/schema-graph";

/**
 * Legal placeholder pages, shipped for link integrity in v0.5. Real content
 * lands in the v0.6 patch after legal review. Blocked from crawl via robots.
 */

const PAGES: Record<string, { name: string; summary: string }> = {
  privacy: {
    name: "Privacy Policy",
    summary:
      "We collect the information you submit through forms (name, email, application details) and standard analytics data from your visit. Entity lookups on this site are logged without IP addresses or personal identifiers and expire after 30 days. We do not sell your information to third parties.",
  },
  terms: {
    name: "Terms of Service",
    summary:
      "Use of PodcastNetwork.org is subject to our terms of service, which cover application submission, engagement scope, and payment terms for the Pre-Sold Author Package.",
  },
  "legacy-jv": {
    name: "Legacy Publishing JV Disclosure",
    summary:
      "PodcastNetwork.org operates a joint venture with Legacy Publishing. The $30,000 Pre-Sold Author Package fee is paid to PodcastNetwork.org and covers the pre-sell sequence. Legacy Publishing publishes the resulting title and earns 10 percent of net book sales as royalty, with no upfront fee to the author. Brett K Moore and Mike Partners hold ownership positions in both entities.",
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return {};
  return {
    title: page.name,
    robots: { index: false, follow: true },
    alternates: { canonical: `/legal/${slug}/` },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  return (
    <>
      <SchemaGraph schema={legalSchema(slug, page.name)} />
      <Header />
      <main>
        <Section>
          <Eyebrow>Legal.</Eyebrow>
          <h1 className="text-h1 mt-4">{page.name}</h1>
          <p className="measure mt-6 text-slate">{page.summary}</p>
          <p className="text-body-sm measure mt-6 text-slate">
            The complete document is in legal review and ships in the next site
            update. Questions in the meantime:{" "}
            <a
              href="mailto:hello@podcastnetwork.org"
              className="text-signal underline underline-offset-2"
            >
              hello@podcastnetwork.org
            </a>
            .
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
