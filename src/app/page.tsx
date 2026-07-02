import { type Metadata } from 'next'
import Link from 'next/link'

import caseStudies from '../../data/case-studies.json'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { GridListItem } from '@/components/GridList'
import { SectionIntro } from '@/components/SectionIntro'
import { HeroBand } from '@/components/home/HeroBand'
import { LogoMarquee, type MarqueeItem } from '@/components/home/LogoMarquee'
import {
  LiveCaseStudyCard,
  type CaseStudyStatic,
} from '@/components/case-studies/LiveCaseStudyCard'
import { YouSearchDemo } from '@/components/demo/YouSearchDemo'
import { FounderAnchorLive } from '@/components/founders/FounderAnchorLive'
import { FAQBlock } from '@/components/ui/FAQBlock'
import { HOME_FAQ } from '@/content/home-faq'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { homeSchema } from '@/lib/schema-graph'

export const metadata: Metadata = {
  title:
    'PodcastNetwork.org. This is what a Knowledge Panel looks like from the inside',
  description:
    'PodcastNetwork.org builds live entity graphs for executives and authors who want Google to know exactly who they are. Six months. One package. Real signals.',
  alternates: { canonical: '/' },
}

const PILLARS = [
  {
    title: 'The Book',
    body: 'Legacy Publishing produces your book under the JV. Ghostwrite from your podcast catalog, or a five-pass edit on a manuscript you bring. Cover, layout, production files, all delivered by day 180.',
  },
  {
    title: 'The Podcast',
    body: 'Your show launches inside our network in the first 30 days. Artwork, distribution, launch sequence. The podcast is the engine that feeds the book, the entity, and the audience.',
  },
  {
    title: 'The Knowledge Panel',
    body: 'Entity Home, Wikidata Q-number, and Google Knowledge Graph indexing. We start on day one and finish inside the six months. The industry standard for this alone is twelve to twenty-four months.',
  },
  {
    title: 'The Pre-Sold Audience',
    body: 'Twelve to fifteen top-tier guest appearances in your category, sequenced into a list build. Five thousand pre-orders is the target, locked in before your book is on shelves.',
  },
]

function Package() {
  return (
    <>
      <SectionIntro
        eyebrow="One package"
        title="Four workstreams. One clock. One team."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          The Pre-Sold Author Package is a single integrated build. Book,
          podcast, entity, audience. Delivered in six months. Priced at
          $30,000.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2"
          >
            {PILLARS.map((pillar) => (
              <GridListItem key={pillar.title} title={pillar.title}>
                {pillar.body}
              </GridListItem>
            ))}
          </ul>
        </FadeInStagger>
        <FadeIn>
          <p className="mt-12">
            <Link
              href="/the-package"
              className="text-base font-semibold text-signal transition hover:text-signal-dark"
            >
              See the full package <span aria-hidden="true">&rarr;</span>
            </Link>
          </p>
        </FadeIn>
      </Container>
    </>
  )
}

function YouSearchBand() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <FadeIn>
        <section
          aria-label="See your own entity graph"
          className="-mx-6 bg-viz-ink px-6 py-20 text-papyrus sm:mx-0 sm:rounded-4xl sm:py-28 md:px-12"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2>
              <span className="mb-6 block font-display text-base font-semibold text-foil">
                See yours
              </span>
              <span className="block font-display text-4xl font-medium tracking-tight text-balance text-white sm:text-5xl">
                Type your name. See what Google sees.
              </span>
            </h2>
            <p className="mt-6 text-xl text-neutral-300">
              We fan out to SerpAPI, Wikidata, and Google&apos;s Knowledge
              Graph in real time and render whatever&apos;s there. For most
              people, most of it&apos;s empty. That&apos;s the honest answer,
              and it&apos;s the starting line.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-4xl">
            <YouSearchDemo />
          </div>
        </section>
      </FadeIn>
    </Container>
  )
}

function CaseStudiesPreview({ studies }: { studies: CaseStudyStatic[] }) {
  const featured = studies.find((c) => c.variant === 'featured')
  const inLaunch = studies.filter((c) => c.variant === 'in-launch')

  return (
    <>
      <SectionIntro
        eyebrow="In the wild"
        title="The graphs we have built. And the ones we are building right now."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          Live case studies pull their numbers from the same APIs Google reads.
          Nothing below is a screenshot.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger>
          {featured && (
            <FadeIn>
              <LiveCaseStudyCard data={featured} headingLevel="h3" />
            </FadeIn>
          )}
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {inLaunch.map((c) => (
              <FadeIn key={c.slug} className="flex">
                <div className="w-full">
                  <LiveCaseStudyCard data={c} headingLevel="h3" />
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>
        <FadeIn>
          <p className="mt-12">
            <Link
              href="/case-studies"
              className="text-base font-semibold text-signal transition hover:text-signal-dark"
            >
              See every case study <span aria-hidden="true">&rarr;</span>
            </Link>
          </p>
        </FadeIn>
      </Container>
    </>
  )
}

/* Roster note: this deliberately lists surfaces and shows we can prove
 * (entity graph nodes, live metrics, the network itself), not aspirational
 * press logos. Swap in outlet wordmarks here once real placements exist. */
const SIGNAL_SURFACES: MarqueeItem[] = [
  { name: 'Google Knowledge Graph', href: '/the-method/' },
  { name: 'Wikidata', href: '/the-method/' },
  { name: 'Amazon', href: '/case-studies/ai-or-die/' },
  { name: 'Goodreads', href: '/case-studies/ai-or-die/' },
  { name: 'Spotify', href: '/case-studies/ai-or-die/' },
  { name: 'Apple Podcasts', href: '/the-package/' },
  { name: 'LinkedIn', href: '/founders/' },
  { name: 'X', href: '/founders/' },
]

const NETWORK_ROSTER: MarqueeItem[] = [
  { name: 'AI or Die', href: '/case-studies/ai-or-die/' },
  { name: 'Legacy Publishing', href: '/legal/legacy-jv/' },
  { name: 'Apex Podcast Co', href: '/founders/' },
  { name: 'AI Expert', href: '/founders/' },
  { name: 'In a Moment', href: '/case-studies/michele-okimura/' },
  { name: 'The Next Episode', href: '/the-package/' },
  { name: 'The Buddy Buck Show', href: '/the-package/' },
  { name: 'The Play Free Sports Podcast', href: '/the-package/' },
]

function SignalCloud() {
  return (
    <LogoMarquee
      className="mt-24 sm:mt-32 lg:mt-40"
      eyebrow="Live surfaces in the graph"
      caption="Hover to pause. Every wordmark links to the proof."
      topRow={SIGNAL_SURFACES}
      bottomRow={NETWORK_ROSTER}
    />
  )
}

function Compression() {
  return (
    <>
      <SectionIntro
        eyebrow="The compression"
        title="Six months. Not eighteen. Not twenty-four."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-10">
        <FadeIn>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base text-neutral-600 lg:grid-cols-2">
            <p>
              The industry standard for a Google Knowledge Panel is twelve to
              twenty-four months. That&apos;s the baseline number. It assumes a
              specialist agency working sequentially: write the book, then
              launch a podcast, then submit entity data, then start the
              guest-booking sequence. Each workstream waits for the one before
              it to finish. The clock stretches because the workflow is serial.
            </p>
            <p>
              We parallelize. The podcast catalog compresses discovery.
              Ghostwriting runs concurrent with the pre-sell sequence. Entity
              work starts on day one, not day one-hundred. Guest bookings begin
              as soon as the podcast has three episodes, not thirty. Every
              workstream feeds the others in the same six-month clock.
              That&apos;s the compression, and it&apos;s the reason the pricing
              works at a single flat number.
            </p>
          </div>
        </FadeIn>
      </Container>
    </>
  )
}

function Founders() {
  return (
    <>
      <SectionIntro
        eyebrow="The founders"
        title="We built the arc on ourselves first."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          Brett K Moore and Mike Partners co-founded PodcastNetwork.org and ran
          the Pre-Sold Author Package as its own first case study. AI or Die
          launched 2026-06-24 under the JV with Legacy Publishing. The metrics
          below refresh hourly. Whatever you see is what&apos;s actually
          happening.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeIn>
          <FounderAnchorLive />
        </FadeIn>
      </Container>
    </>
  )
}

function Faq() {
  return (
    <div id="faq">
      <SectionIntro
        eyebrow="Questions"
        title="Asked before you apply"
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-16">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <FAQBlock items={HOME_FAQ} />
            <p className="mt-6 text-sm text-neutral-600">
              More questions?{' '}
              <Link
                href="/apply"
                className="font-semibold text-signal transition hover:text-signal-dark"
              >
                Ask them inside the application{' '}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}

export default function Home() {
  const studies = Object.values(
    caseStudies as unknown as Record<string, CaseStudyStatic | string>,
  ).filter(
    (c): c is CaseStudyStatic =>
      typeof c === 'object' && c !== null && 'slug' in c,
  )

  return (
    <>
      <SchemaGraph schema={homeSchema()} />

      <Container className="mt-24 sm:mt-32 md:mt-44">
        {/* Transform-only entrance: this block holds the LCP headline, so it
            must be visible before hydration. */}
        <div className="pn-rise max-w-3xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-7xl">
            This is what a Knowledge Panel looks like from the inside.
          </h1>
          <p className="mt-6 text-xl text-neutral-600">
            PodcastNetwork.org builds live entity graphs for executives and
            authors who want Google to know exactly who they are. Six months.
            One package. Real signals. The graph below is ours, and it&apos;s
            live. Drag the playhead to watch six months of authority
            architecture assemble itself.
          </p>
        </div>
      </Container>

      <HeroBand />

      <Package />

      <YouSearchBand />

      <CaseStudiesPreview studies={studies} />

      <SignalCloud />

      <Compression />

      <Founders />

      <Faq />

      <ContactSection />
    </>
  )
}
