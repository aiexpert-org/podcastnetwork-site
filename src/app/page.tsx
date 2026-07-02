import type { Metadata } from "next";
import Link from "next/link";
import caseStudies from "../../data/case-studies.json";
import { PlayheadProvider } from "@/components/demo/PlayheadContext";
import { HeroAndDemoBand } from "@/components/home/HeroAndDemoBand";
import { Section } from "@/components/layout/Section";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FAQBlock } from "@/components/ui/FAQBlock";
import {
  LiveCaseStudyCard,
  type CaseStudyStatic,
} from "@/components/case-studies/LiveCaseStudyCard";
import { FounderAnchorLive } from "@/components/founders/FounderAnchorLive";
import { HOME_FAQ } from "@/content/home-faq";
import { SchemaGraph } from "@/components/seo/SchemaGraph";
import { homeSchema } from "@/lib/schema-graph";

export const metadata: Metadata = {
  title: "PodcastNetwork.org — This is what a Knowledge Panel looks like from the inside",
  description:
    "PodcastNetwork.org builds live entity graphs for executives and authors who want Google to know exactly who they are. Six months. One package. Real signals.",
  alternates: { canonical: "/" },
};

const PILLARS = [
  {
    n: "01",
    title: "The Book.",
    body: "Legacy Publishing produces your book under the JV. Ghostwrite from your podcast catalog, or a five-pass edit on a manuscript you bring. Cover, layout, production files, all delivered by day 180.",
  },
  {
    n: "02",
    title: "The Podcast.",
    body: "Your show launches inside our network in the first 30 days. Artwork, distribution, launch sequence. The podcast is the engine that feeds the book, the entity, and the audience.",
  },
  {
    n: "03",
    title: "The Knowledge Panel.",
    body: "Entity Home, Wikidata Q-number, and Google Knowledge Graph indexing. We start on day one and finish inside the six months. The industry standard for this alone is twelve to twenty-four months.",
  },
  {
    n: "04",
    title: "The Pre-Sold Audience.",
    body: "Twelve to fifteen top-tier guest appearances in your category, sequenced into a list build. Five thousand pre-orders is the target, locked in before your book is on shelves.",
  },
];

export default function HomePage() {
  const studies = Object.values(
    caseStudies as unknown as Record<string, CaseStudyStatic | string>,
  ).filter(
    (c): c is CaseStudyStatic =>
      typeof c === "object" && c !== null && "slug" in c,
  );
  const featured = studies.find((c) => c.variant === "featured");
  const inLaunch = studies.filter((c) => c.variant === "in-launch");

  return (
    <>
      <SchemaGraph schema={homeSchema()} />
      <Header />
      <main>
        <PlayheadProvider>
          <HeroAndDemoBand />
        </PlayheadProvider>

        {/* Section 4: The package preview */}
        <Section>
          <div className="text-center">
            <Eyebrow>One package.</Eyebrow>
            <h2 className="text-display-2 mt-4">
              Four workstreams. One clock. One team.
            </h2>
            <p className="text-lead mx-auto mt-5 max-w-2xl text-slate">
              The Pre-Sold Author Package is a single integrated build. Book,
              podcast, entity, audience. Delivered in six months. Priced at
              $30,000.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div
                key={p.n}
                className="rounded-xl border border-ink/8 bg-papyrus p-8 shadow-sm"
              >
                <p className="text-caption tracking-[0.12em] text-foil-dark">
                  {p.n}
                </p>
                <h3 className="text-h3 mt-2 font-(family-name:--font-display) font-bold">
                  {p.title}
                </h3>
                <p className="text-body-sm mt-3 text-slate">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center">
            <Link
              href="/the-package/"
              className="font-semibold text-signal underline decoration-foil underline-offset-4 hover:text-signal-dark"
            >
              See the full package →
            </Link>
          </p>
        </Section>

        {/* Section 5: Live case studies preview */}
        <Section className="border-t border-ink/8">
          <Eyebrow>In the wild.</Eyebrow>
          <h2 className="text-display-2 mt-4 max-w-3xl">
            The graphs we&apos;ve built. And the ones we&apos;re building right
            now.
          </h2>
          <div className="mt-12 space-y-5">
            {featured && <LiveCaseStudyCard data={featured} />}
            <div className="grid gap-5 md:grid-cols-3">
              {inLaunch.map((c) => (
                <LiveCaseStudyCard key={c.slug} data={c} />
              ))}
            </div>
          </div>
          <p className="mt-10 text-center">
            <Link
              href="/case-studies/"
              className="font-semibold text-signal underline decoration-foil underline-offset-4 hover:text-signal-dark"
            >
              See every case study →
            </Link>
          </p>
        </Section>

        {/* Section 6: The compression */}
        <Section className="border-t border-ink/8">
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
            <div>
              <Eyebrow>The compression.</Eyebrow>
              <h2 className="text-display-2 mt-4">
                Six months. Not eighteen. Not twenty-four.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="measure">
                The industry standard for a Google Knowledge Panel is twelve to
                twenty-four months. That&apos;s the baseline number. It assumes
                a specialist agency working sequentially: write the book, then
                launch a podcast, then submit entity data, then start the
                guest-booking sequence. Each workstream waits for the one
                before it to finish. The clock stretches because the workflow
                is serial.
              </p>
              <p className="measure">
                We parallelize. The podcast catalog compresses discovery.
                Ghostwriting runs concurrent with the pre-sell sequence. Entity
                work starts on day one, not day one-hundred. Guest bookings
                begin as soon as the podcast has three episodes, not thirty.
                Every workstream feeds the others in the same six-month clock.
                That&apos;s the compression, and it&apos;s the reason the
                pricing works at a single flat number.
              </p>
            </div>
          </div>
        </Section>

        {/* Section 7: Founder anchor live */}
        <Section className="border-t border-ink/8">
          <Eyebrow>The founders.</Eyebrow>
          <h2 className="text-display-2 mt-4 max-w-3xl">
            We built the arc on ourselves first.
          </h2>
          <p className="text-body-sm measure mt-5 text-slate">
            Brett K Moore and Mike Partners co-founded PodcastNetwork.org and
            ran the Pre-Sold Author Package as its own first case study. AI or
            Die launched 2026-06-24 under the JV with Legacy Publishing. The
            metrics below refresh hourly. Whatever you see is what&apos;s
            actually happening.
          </p>
          <div className="mt-12">
            <FounderAnchorLive />
          </div>
        </Section>

        {/* Section 8: Application CTA + inline FAQ */}
        <Section className="border-t border-ink/8" id="faq">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Apply.</Eyebrow>
              <h2 className="text-display-2 mt-4">
                The application is the diagnostic.
                <br />
                Start with your URL.
              </h2>
              <p className="measure mt-5 text-slate">
                We open the intake with a schema validator. Paste any URL that
                represents your public presence and we render your current
                authority baseline in real time. No form fields until
                we&apos;ve shown you where you stand today. The honest map
                comes first on every engagement we run.
              </p>
              <div className="mt-8">
                <Button href="/apply/" variant="primary" size="lg">
                  Start the diagnostic →
                </Button>
              </div>
            </div>
            <div>
              <FAQBlock items={HOME_FAQ} />
              <p className="text-body-sm mt-4 text-slate">
                More questions?{" "}
                <Link
                  href="/apply/"
                  className="text-signal underline underline-offset-2 hover:decoration-foil"
                >
                  Ask them inside the application →
                </Link>
              </p>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
