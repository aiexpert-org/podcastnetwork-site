import type { Metadata } from "next";
import pnKeyframes from "../../../data/pn-playhead-keyframes.json";
import type { Keyframe } from "@/lib/entity-graph";
import { PlayheadProvider } from "@/components/demo/PlayheadContext";
import { SixMonthPlayhead } from "@/components/demo/SixMonthPlayhead";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { SchemaGraph } from "@/components/seo/SchemaGraph";
import { faqItemsForUi, packageSchema } from "@/lib/schema-graph";

export const metadata: Metadata = {
  title: "The Pre-Sold Author Package — $30,000, 180 days",
  description:
    "A book, a podcast, a knowledge panel, and a pre-sold audience of 5,000+ readers. Delivered in 180 days. One package. One price. Application-only.",
  alternates: { canonical: "/the-package/" },
};

const keyframes = (pnKeyframes as { keyframes: Keyframe[] }).keyframes;

const PACKAGE_FAQ_IDS = [
  "what-does-30k-cover",
  "six-months-not-24",
  "manuscript-in-hand",
  "no-podcast-yet",
  "legacy-jv",
  "knowledge-panel-mechanics",
  "pre-sold-audience-mechanics",
  "payment-terms",
  "refund",
  "what-if-i-slip",
  "versus-diy",
  "application-timeline",
];

const INCLUDED = [
  {
    title: "The Book",
    body: "Two paths in, same price, same timeline. Ghostwriting path: we interview you across your existing podcast catalog, keynotes, and articles; our editorial team shapes the raw voice into a manuscript, draft complete by Day 90. Manuscript-in-hand path: you bring the draft, we run the five-pass edit (developmental, structural, line, copy, proof) with Legacy Publishing's editorial team, complete Day 60 to 75. From Day 90, Legacy takes the handoff: cover, interior layout, ARC copies, blurbs, retail distribution.",
  },
  {
    title: "The Podcast",
    body: "A 30-day launch inside the PodcastNetwork.org network. Show branding, cover art, hosting setup, distribution across Apple Podcasts, Spotify, and the major directories, and a sequenced launch cadence. The podcast is in-market by Day 30 and compounds throughout the six months, driving list growth and pre-orders into launch week.",
  },
  {
    title: "The Knowledge Panel",
    body: "A live Google Knowledge Panel by Day 180. The mechanics: Entity Home construction, Wikidata Q-number seeding, structured data markup, and Google Knowledge Graph indexing. Wikidata seeding starts Day 1. Entity Home built Day 14 to 30. Google pickup typically 60 to 120 days from seed. The industry standard treats this as a 12 to 24 month standalone engagement.",
  },
  {
    title: "The Pre-Sold Audience",
    body: "12 to 15 top-tier podcast guest appearances in your category, booked and sequenced across Days 30 to 150. Each appearance drives traffic to a waitlist landing page with a book-preview lead magnet. Waitlist mechanics convert signups into pre-orders in the final 60 days. Target: 5,000+ pre-orders locked before launch day.",
  },
  {
    title: "The Operators",
    body: "Brett and Mike hold the through-line for all four pillars across the full 180 days. One operator, one contract, one price. No add-ons required to hit the deliverables.",
  },
];

export default function ThePackagePage() {
  const faq = faqItemsForUi(PACKAGE_FAQ_IDS);

  return (
    <>
      <SchemaGraph schema={packageSchema()} />
      <Header />
      <main>
        <Section>
          <Eyebrow>The package.</Eyebrow>
          <h1 className="text-display-1 mt-4 max-w-4xl">
            A book, a podcast, a knowledge panel, and a pre-sold audience of
            5,000+ readers. Delivered in 180 days.
          </h1>
          <p className="text-lead measure mt-6 text-slate">
            One package. One price. $30,000. Application-only. The industry
            standard for a knowledge panel alone runs 12 to 24 months. We ship
            all four pillars in six.
          </p>
          <div className="mt-8">
            <Button href="/apply/" variant="primary" size="lg">
              Start your application
            </Button>
          </div>
        </Section>

        <Section className="border-t border-ink/8">
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
            <div>
              <Eyebrow>What it is.</Eyebrow>
              <h2 className="text-display-2 mt-4">
                A single integrated build.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="measure">
                The Pre-Sold Author Package is a productized six-month sequence
                that produces four coordinated deliverables on a single
                timeline: a finished book published through Legacy Publishing,
                a launched podcast inside the PodcastNetwork.org network, a
                live Google Knowledge Panel, and a pre-sold audience of 5,000+
                opted-in readers ready on launch day.
              </p>
              <p className="measure">
                Coaching, courses, and standalone ghostwriting all leave the
                author holding the coordination problem: write the book, then
                figure out the audience, then chase the knowledge panel, then
                hope the launch lands. Every one of those decisions gets made
                in sequence, and the calendar stretches to two or three years.
                This package runs the four pillars in parallel from Day 1
                against the same 180-day clock, under one operator, with a
                single handoff to Legacy Publishing at Day 90. Day 180 the book
                launches into an audience that already said yes.
              </p>
            </div>
          </div>
        </Section>

        <Section className="border-t border-ink/8">
          <Eyebrow>What&apos;s included.</Eyebrow>
          <h2 className="text-display-2 mt-4">Five commitments.</h2>
          <div className="mt-10 space-y-5">
            {INCLUDED.map((item, i) => (
              <div
                key={item.title}
                className="grid gap-4 rounded-xl border border-ink/8 bg-papyrus p-7 md:grid-cols-[200px_1fr]"
              >
                <div>
                  <p className="text-caption tracking-[0.12em] text-foil-dark">
                    0{i + 1}
                  </p>
                  <h3 className="text-h3 mt-1 font-(family-name:--font-display) font-bold">
                    {item.title}
                  </h3>
                </div>
                <p className="text-body-sm text-slate">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="border-t border-ink/8">
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
            <div>
              <Eyebrow>The Legacy JV.</Eyebrow>
              <h2 className="text-display-2 mt-4">
                The publishing partner is built in.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="measure">
                Legacy Publishing is our elite publishing partner. Manuscript
                handoff happens at Day 90. Legacy handles cover, interior
                layout, ARC copies, blurb sourcing, retail distribution, and
                the publish. Legacy takes 10 percent of net book sales as
                royalty. There is no upfront fee to Legacy beyond your $30,000
                payment to PodcastNetwork.org. Legacy is application-only in
                its own right, and admission to the Pre-Sold Author Package
                includes admission to Legacy for the resulting title.
              </p>
              <div className="rounded-lg border border-foil/40 bg-foil/10 p-5">
                <p className="text-body-sm">
                  You own the book rights. Legacy operates on the 10 percent
                  net royalty structure with no advance and no upfront fee.
                  Full disclosure at{" "}
                  <a
                    href="/legal/legacy-jv/"
                    className="text-signal underline underline-offset-2"
                  >
                    the Legacy JV page
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section dark>
          <Eyebrow className="!text-foil">The 6-month timeline.</Eyebrow>
          <h2 className="text-display-2 mt-4 text-papyrus">
            Drag it. This is what six months looks like.
          </h2>
          <div className="mt-10">
            <PlayheadProvider>
              <SixMonthPlayhead keyframes={keyframes} variant="preview" />
            </PlayheadProvider>
          </div>
          <p className="text-caption mt-6 text-fog">
            The full interactive version (with the entity graph mutating in
            real time) lives on{" "}
            <a href="/the-method/" className="text-foil underline">
              the method page
            </a>
            .
          </p>
        </Section>

        <Section>
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
            <div>
              <Eyebrow>The compression, expanded.</Eyebrow>
              <h2 className="text-display-2 mt-4">
                Why six months is possible.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="measure">
                The DIY path runs 24 to 36 months from first draft to shelf. A
                freelance five-pass edit runs $8,000 to $15,000. Cover and
                interior design runs $3,000 to $7,000. A standalone knowledge
                panel engagement with the industry-standard vendor runs 12 to
                24 months at $30,000 to $80,000. A launch PR retainer runs
                $8,000 to $15,000 per month. Guest-booking services run $3,000
                to $7,000 per month with mixed results. At the low end, that
                lands north of $50,000 in vendor costs, takes two to three
                years, and produces four disconnected deliverables that were
                never designed to compound against each other.
              </p>
              <p className="measure">
                Three things compress the clock. The podcast catalog compresses
                discovery: your voice is already on tape, and ghostwriting
                interviews mine it directly. Parallel workstreams remove the
                waiting: entity work starts on day one while the manuscript and
                the pre-sell run concurrently. Entity-first sequencing means
                Google&apos;s indexing clock (the slowest external dependency)
                starts at the earliest possible moment instead of after the
                book ships. One operator holding the through-line is what makes
                the parallelism hold.
              </p>
            </div>
          </div>
        </Section>

        <Section className="border-t border-ink/8">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <Eyebrow>Who it&apos;s for.</Eyebrow>
              <h2 className="text-h1 mt-4 font-(family-name:--font-display)">
                Authors with existing signal.
              </h2>
              <p className="measure mt-5 text-slate">
                Non-fiction authors, 90 to 180+ days before launch, with real
                platform in play: a mailing list of 5,000+, a podcast doing
                25,000+ monthly downloads, a built-in retail channel, or a
                platform in progress with real traction and a clear trajectory.
              </p>
            </div>
            <div>
              <Eyebrow>Who it&apos;s not for.</Eyebrow>
              <h2 className="text-h1 mt-4 font-(family-name:--font-display)">
                Authors starting from zero.
              </h2>
              <p className="measure mt-5 text-slate">
                We turn down applicants who have not put the reps in on their
                own audience yet. This package takes an author with existing
                signal and produces a coordinated launch machine around that
                signal in six months. It does not build an author from nothing,
                and pretending otherwise would break the cohort for everyone
                else.
              </p>
            </div>
          </div>
        </Section>

        <Section className="border-t border-ink/8">
          <Eyebrow>After you apply.</Eyebrow>
          <h2 className="text-display-2 mt-4">Three steps.</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "The diagnostic",
                b: "The application opens with the schema validator. Paste your URL, see your current authority baseline, then answer six questions. About 10 minutes.",
              },
              {
                n: "2",
                t: "The review",
                b: "We respond within two business days. Accepted applicants get a 20-minute discovery call within one week.",
              },
              {
                n: "3",
                t: "The kickoff",
                b: "Contract and payment finalize within two weeks. Kickoff typically lands three to four weeks after application. Day 1 starts the clock.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="rounded-xl border border-ink/8 bg-papyrus p-7"
              >
                <p className="text-caption tracking-[0.12em] text-foil-dark">
                  Step {s.n}
                </p>
                <h3 className="text-h3 mt-2">{s.t}</h3>
                <p className="text-body-sm mt-3 text-slate">{s.b}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section className="border-t border-ink/8">
          <Eyebrow>Questions.</Eyebrow>
          <h2 className="text-display-2 mt-4">Everything we get asked.</h2>
          <div className="mt-10">
            <FAQBlock items={faq} />
          </div>
          <div className="mt-14 text-center">
            <p className="text-h4">
              Application-only. $30,000. 180 days from Day 1 to book launch.
            </p>
            <div className="mt-6">
              <Button href="/apply/" variant="primary" size="lg">
                Start your application
              </Button>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
