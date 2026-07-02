import type { Metadata } from "next";
import { PlayheadProvider } from "@/components/demo/PlayheadContext";
import { MethodBand } from "@/components/method/MethodBand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SchemaGraph } from "@/components/seo/SchemaGraph";
import { methodSchema } from "@/lib/schema-graph";

export const metadata: Metadata = {
  title: "The Method — Six months. Six moves. One entity.",
  description:
    "The 180-day arc PodcastNetwork.org runs on every client: discovery, manuscript, podcast, pre-sell, knowledge panel, launch. Four pillars in parallel from Day 1.",
  alternates: { canonical: "/the-method/" },
};

const MONTHS = [
  {
    anchor: "month-1",
    label: "Month 1",
    title: "Discovery.",
    body: "Intake calls, voice work, audience mapping. We read your transcripts, keynotes, and prior writing to capture rhythm and cadence, then define the exact reader profile, the top 30 podcasts in your category, and the retail channel path. The Wikidata Q-number seeds in week one; the Entity Home (your canonical, machine-readable web presence) is built by Day 30. Podcast branding, hosting, and distribution stand up in parallel, and the show launches at Day 30 with a trailer plus three episodes.",
    artifacts: "Discovery memo · Pre-sell strategy doc · Editorial outline · Wikidata Q-number · Entity Home",
  },
  {
    anchor: "month-2",
    label: "Month 2",
    title: "Manuscript kickoff.",
    body: "Ghostwriting path: structured interviews run two to three sessions per week, with transcripts flowing to the editorial team continuously. Manuscript-in-hand path: the five-pass edit begins immediately (developmental read, structural pass, line edit). Meanwhile the guest-booking list is built, pitch material is written, and the first outreach wave of 12 to 20 pitches goes out.",
    artifacts: "Interview transcripts or edit passes · Guest-booking target list · First outreach wave",
  },
  {
    anchor: "month-3",
    label: "Month 3",
    title: "Podcast arc begins.",
    body: "The show is in-market with weekly episodes and the download curve builds. The first tranche of top-tier guest appearances lands. Google Knowledge Graph pickup from the Wikidata seed typically arrives in this window (60 to 120 days from submission), which is the early signal the Day 180 panel target is on track.",
    artifacts: "Weekly episodes · First guest appearances · Google KG entity pickup",
  },
  {
    anchor: "month-4",
    label: "Month 4",
    title: "Pre-sell sequence.",
    body: "The waitlist opens with a book-preview lead magnet. Guest appearances drive signups, your own list gets the announce sequence, and the list grows through the middle third of the timeline. The manuscript wraps: ghostwritten drafts complete by Day 90, edited manuscripts by Day 60 to 75.",
    artifacts: "Waitlist landing page · Lead magnet · Completed manuscript",
  },
  {
    anchor: "month-5",
    label: "Month 5",
    title: "Knowledge Panel and launch list.",
    body: "Manuscript handoff to Legacy Publishing at Day 90 kicks off cover design, interior layout, ARC copies, and blurb outreach. The Google Knowledge Panel matures (live in most cases by Day 150 to 180). Pre-order conversion runs, and the final guest appearances drive the last surge of list growth toward the 5,000+ target.",
    artifacts: "Legacy production pipeline · Live Knowledge Panel · Scaling pre-order list",
  },
  {
    anchor: "month-6",
    label: "Month 6",
    title: "Book launch and handoff.",
    body: "Retail placement locks. Media hits schedule across launch week. The book launches at Day 180 into a pre-sold audience of 5,000+ opted-in readers, onto a live Knowledge Panel, with a running podcast that keeps compounding after launch. You own the show, the entity, and the audience.",
    artifacts: "Launch-week cadence · 5,000+ pre-orders · Live panel · Published book",
  },
] as const;

export default function TheMethodPage() {
  return (
    <>
      <SchemaGraph schema={methodSchema()} />
      <Header />
      <main>
        <Section>
          <Eyebrow>The method.</Eyebrow>
          <h1 className="text-display-1 mt-4 max-w-4xl">
            Six months. Six moves. One entity.
          </h1>
          <p className="text-lead measure mt-6 text-slate">
            The playhead below is the same one on the homepage. It&apos;s the
            actual arc we ran on AI or Die, and the same arc we run on every
            client. Drag through the months and watch the entity graph build.
          </p>
        </Section>

        <PlayheadProvider>
          <MethodBand />
        </PlayheadProvider>

        <Section>
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
            <div>
              <Eyebrow>Parallel from day 1.</Eyebrow>
              <h2 className="text-display-2 mt-4">
                The core insight is sequencing.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="measure">
                Most author launches run everything in sequence. Write the book
                first (18 to 36 months). Then start building the audience (12+
                months). Then apply for a knowledge panel through a standalone
                vendor (12 to 24 months). Then coordinate a launch. Stacked
                end-to-end, that is a three-to-five-year calendar for a single
                title, and by the time the book ships, the earliest
                audience-building work is stale.
              </p>
              <p className="measure">
                The 180-day timeline works because the four pillars run in
                parallel from Day 1. The book is being written while the
                podcast is launching while the knowledge panel is seeding while
                the audience is being pre-sold. Nothing waits on anything else
                until Day 90, when the finished manuscript hands off to Legacy
                Publishing and the launch machinery locks into its final 90
                days.
              </p>
            </div>
          </div>
        </Section>

        <div className="border-t border-ink/8">
          <Container>
            <div className="divide-y divide-ink/8">
              {MONTHS.map((m) => (
                <section
                  key={m.anchor}
                  id={m.anchor}
                  className="grid gap-6 py-14 md:grid-cols-[180px_1fr] md:gap-12"
                >
                  <p className="text-eyebrow pt-2 text-foil-dark">{m.label}</p>
                  <div>
                    <h3 className="text-h2 font-(family-name:--font-display)">
                      {m.title}
                    </h3>
                    <p className="measure mt-4 text-slate">{m.body}</p>
                    <p className="text-caption mt-4 text-slate/80">
                      Artifacts: {m.artifacts}
                    </p>
                  </div>
                </section>
              ))}
            </div>
          </Container>
        </div>

        <Section id="handoff" className="border-t border-ink/8">
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
            <div>
              <Eyebrow>The handoff.</Eyebrow>
              <h2 className="text-display-2 mt-4">Where Legacy takes over.</h2>
            </div>
            <div className="space-y-5">
              <p className="measure">
                Legacy Publishing is the publishing fulfillment partner inside
                the package. Manuscript handoff happens at Day 90. Legacy runs
                cover design, interior layout, ARC copies, blurb sourcing, and
                retail distribution, and earns 10 percent of net book sales as
                royalty. There is no upfront fee to Legacy beyond your $30,000
                payment to PodcastNetwork.org, and you retain author rights.
              </p>
              <p className="measure text-slate">
                Full disclosure of the JV structure lives at{" "}
                <a
                  href="/legal/legacy-jv/"
                  className="text-signal underline underline-offset-2 hover:decoration-foil"
                >
                  the Legacy JV disclosure page
                </a>
                .
              </p>
            </div>
          </div>
          <div className="mt-14 text-center">
            <Button href="/the-package/" variant="primary" size="lg">
              See the full package →
            </Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
