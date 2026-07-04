import { type Metadata } from 'next'
import Link from 'next/link'

import caseStudies from '../../data/case-studies.json'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
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
import {
  BOTH_PACKAGES_PRICE_DISPLAY,
  KNOWLEDGE_PANEL_INSTALL,
  PRE_SOLD_AUTHOR,
  SHARED_FLOOR,
  type PackageMeta,
} from '@/content/packages'

export const metadata: Metadata = {
  title:
    'PodcastNetwork.org. Two paths to Google authority',
  description:
    'PodcastNetwork.org builds Google authority for executives, authors, and entrepreneurs. Two standalone paths: a Knowledge Panel Install and a Pre-Sold Author Package. Real signals, application only.',
  alternates: { canonical: '/' },
}

function PathCard({ pkg }: { pkg: PackageMeta }) {
  return (
    <FadeIn className="flex">
      <div className="flex w-full flex-col rounded-4xl border border-neutral-950/10 bg-white p-8 sm:p-10">
        <p className="font-display text-sm font-semibold tracking-wider text-foil-dark uppercase">
          {pkg.name}
        </p>
        <p className="mt-4 font-display text-4xl font-medium tracking-tight text-neutral-950">
          {pkg.priceDisplay}
        </p>
        <p className="mt-1 text-sm text-neutral-600">
          {pkg.timelineDisplay}, application only
        </p>
        <p className="mt-6 text-base text-neutral-600">{pkg.tagline}</p>
        <ul role="list" className="mt-6 space-y-3 text-sm text-neutral-600">
          {pkg.differentiators.map((d) => (
            <li key={d} className="flex gap-3">
              <span aria-hidden="true" className="mt-1 text-foil-dark">
                &#8226;
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 pt-2">
          <Link
            href={pkg.url}
            className="text-base font-semibold text-signal transition hover:text-signal-dark"
          >
            See {pkg.name} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </FadeIn>
  )
}

function TwoPaths() {
  return (
    <>
      <SectionIntro
        eyebrow="Two paths to Google authority"
        title="Pick the build that fits what you are trying to become."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          Two standalone packages. Take the one that matches the goal, or take
          both. An executive who wants both pays {BOTH_PACKAGES_PRICE_DISPLAY}{' '}
          and runs them in parallel on their own timelines. No bundle discount,
          because each one stands on its own.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <PathCard pkg={KNOWLEDGE_PANEL_INSTALL} />
            <PathCard pkg={PRE_SOLD_AUTHOR} />
          </div>
        </FadeInStagger>
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
              We fan out to the same public sources Google reads, in real time,
              and render whatever&apos;s there. For most people, most of
              it&apos;s empty. That&apos;s the honest answer, and it&apos;s the
              starting line.
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
  { name: 'Wikipedia', href: '/knowledge-panel-install/' },
  { name: 'IMDb', href: '/knowledge-panel-install/' },
  { name: 'Amazon', href: '/case-studies/ai-or-die/' },
  { name: 'Goodreads', href: '/case-studies/ai-or-die/' },
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

function SharedFloor() {
  return (
    <>
      <SectionIntro
        eyebrow="The shared floor"
        title="Every client walks away with the same base."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          Both packages launch a podcast, earn an IMDb page through the podcast
          credit, and build a full website if you do not already have one. That
          is the floor. Each package adds its own depth on top of it.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
          >
            {SHARED_FLOOR.map((item) => (
              <li key={item}>
                <FadeIn className="flex gap-3 text-base text-neutral-600">
                  <span aria-hidden="true" className="mt-1 text-foil-dark">
                    &#8226;
                  </span>
                  <span>{item}</span>
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>
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
            PodcastNetwork.org builds live entity graphs for executives,
            authors, and entrepreneurs who want Google to know exactly who they
            are. Two packages, one architecture. Real signals. The graph below
            is ours, and it&apos;s live. Drag the playhead to watch it assemble
            itself.
          </p>
        </div>
      </Container>

      <HeroBand />

      <TwoPaths />

      <YouSearchBand />

      <CaseStudiesPreview studies={studies} />

      <SignalCloud />

      <SharedFloor />

      <Founders />

      <Faq />

      <ContactSection />
    </>
  )
}
