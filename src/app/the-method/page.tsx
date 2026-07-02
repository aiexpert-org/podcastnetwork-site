import { type Metadata } from 'next'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { SectionIntro } from '@/components/SectionIntro'
import { PlayheadProvider } from '@/components/demo/PlayheadContext'
import { MethodBand } from '@/components/method/MethodBand'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { methodSchema } from '@/lib/schema-graph'

export const metadata: Metadata = {
  title: 'The Method. Six months. Six moves. One entity',
  description:
    'The 180-day arc PodcastNetwork.org runs on every client: discovery, manuscript, podcast, pre-sell, knowledge panel, launch. Four pillars in parallel from Day 1.',
  alternates: { canonical: '/the-method/' },
}

const MONTHS = [
  {
    anchor: 'month-1',
    label: 'Month 1',
    title: 'Discovery',
    body: 'Intake calls, voice work, audience mapping. We read your transcripts, keynotes, and prior writing to capture rhythm and cadence, then define the exact reader profile, the top 30 podcasts in your category, and the retail channel path. The Wikidata Q-number seeds in week one; the Entity Home (your canonical, machine-readable web presence) is built by Day 30. Podcast branding, hosting, and distribution stand up in parallel, and the show launches at Day 30 with a trailer plus three episodes.',
    artifacts:
      'Discovery memo · Pre-sell strategy doc · Editorial outline · Wikidata Q-number · Entity Home',
  },
  {
    anchor: 'month-2',
    label: 'Month 2',
    title: 'Manuscript kickoff',
    body: 'Ghostwriting path: structured interviews run two to three sessions per week, with transcripts flowing to the editorial team continuously. Manuscript-in-hand path: the five-pass edit begins immediately (developmental read, structural pass, line edit). Meanwhile the guest-booking list is built, pitch material is written, and the first outreach wave of 12 to 20 pitches goes out.',
    artifacts:
      'Interview transcripts or edit passes · Guest-booking target list · First outreach wave',
  },
  {
    anchor: 'month-3',
    label: 'Month 3',
    title: 'Podcast arc begins',
    body: 'The show is in-market with weekly episodes and the download curve builds. The first tranche of top-tier guest appearances lands. Google Knowledge Graph pickup from the Wikidata seed typically arrives in this window (60 to 120 days from submission), which is the early signal the Day 180 panel target is on track.',
    artifacts:
      'Weekly episodes · First guest appearances · Google KG entity pickup',
  },
  {
    anchor: 'month-4',
    label: 'Month 4',
    title: 'Pre-sell sequence',
    body: 'The waitlist opens with a book-preview lead magnet. Guest appearances drive signups, your own list gets the announce sequence, and the list grows through the middle third of the timeline. The manuscript wraps: ghostwritten drafts complete by Day 90, edited manuscripts by Day 60 to 75.',
    artifacts: 'Waitlist landing page · Lead magnet · Completed manuscript',
  },
  {
    anchor: 'month-5',
    label: 'Month 5',
    title: 'Knowledge Panel and launch list',
    body: 'Manuscript handoff to Legacy Publishing at Day 90 kicks off cover design, interior layout, ARC copies, and blurb outreach. The Google Knowledge Panel matures (live in most cases by Day 150 to 180). Pre-order conversion runs, and the final guest appearances drive the last surge of list growth toward the 5,000+ target.',
    artifacts:
      'Legacy production pipeline · Live Knowledge Panel · Scaling pre-order list',
  },
  {
    anchor: 'month-6',
    label: 'Month 6',
    title: 'Book launch and handoff',
    body: 'Retail placement locks. Media hits schedule across launch week. The book launches at Day 180 into a pre-sold audience of 5,000+ opted-in readers, onto a live Knowledge Panel, with a running podcast that keeps compounding after launch. You own the show, the entity, and the audience.',
    artifacts:
      'Launch-week cadence · 5,000+ pre-orders · Live panel · Published book',
  },
] as const

export default function TheMethodPage() {
  return (
    <>
      <SchemaGraph schema={methodSchema()} />

      <PageIntro eyebrow="The method" title="Six months. Six moves. One entity.">
        <p>
          The playhead below is the same one on the homepage. It&apos;s the
          actual arc we ran on AI or Die, and the same arc we run on every
          client. Drag through the months and watch the entity graph build.
        </p>
      </PageIntro>

      <PlayheadProvider>
        <MethodBand />
      </PlayheadProvider>

      <SectionIntro
        eyebrow="Parallel from day 1"
        title="The core insight is sequencing."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-10">
        <FadeIn>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base text-neutral-600 lg:grid-cols-2">
            <p>
              Most author launches run everything in sequence. Write the book
              first (18 to 36 months). Then start building the audience (12+
              months). Then apply for a knowledge panel through a standalone
              vendor (12 to 24 months). Then coordinate a launch. Stacked
              end-to-end, that is a three-to-five-year calendar for a single
              title, and by the time the book ships, the earliest
              audience-building work is stale.
            </p>
            <p>
              The 180-day timeline works because the four pillars run in
              parallel from Day 1. The book is being written while the podcast
              is launching while the knowledge panel is seeding while the
              audience is being pre-sold. Nothing waits on anything else until
              Day 90, when the finished manuscript hands off to Legacy
              Publishing and the launch machinery locks into its final 90 days.
            </p>
          </div>
        </FadeIn>
      </Container>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div className="divide-y divide-neutral-950/10 border-t border-neutral-950/10">
          {MONTHS.map((m) => (
            <FadeIn key={m.anchor}>
              <section
                id={m.anchor}
                className="grid grid-cols-1 gap-6 py-14 md:grid-cols-[180px_1fr] md:gap-12"
              >
                <p className="font-display pt-2 text-sm font-semibold tracking-wider text-foil-dark uppercase">
                  {m.label}
                </p>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-neutral-950 sm:text-3xl">
                    {m.title}
                  </h3>
                  <p className="mt-4 max-w-3xl text-base text-neutral-600">
                    {m.body}
                  </p>
                  <p className="mt-4 text-sm text-neutral-600">
                    Artifacts: {m.artifacts}
                  </p>
                </div>
              </section>
            </FadeIn>
          ))}
        </div>
      </Container>

      <SectionIntro
        eyebrow="The handoff"
        title="Where Legacy takes over."
        className="mt-24 sm:mt-32 lg:mt-40"
        id="handoff"
      />
      <Container className="mt-10">
        <FadeIn>
          <div className="max-w-3xl space-y-6 text-base text-neutral-600">
            <p>
              Legacy Publishing is the publishing fulfillment partner inside
              the package. Manuscript handoff happens at Day 90. Legacy runs
              cover design, interior layout, ARC copies, blurb sourcing, and
              retail distribution, and earns 10 percent of net book sales as
              royalty. There is no upfront fee to Legacy beyond your $30,000
              payment to PodcastNetwork.org, and you retain author rights.
            </p>
            <p>
              Full disclosure of the JV structure lives at{' '}
              <Link
                href="/legal/legacy-jv/"
                className="font-semibold text-signal transition hover:text-signal-dark"
              >
                the Legacy JV disclosure page
              </Link>
              .
            </p>
          </div>
        </FadeIn>
      </Container>

      <ContactSection />
    </>
  )
}
