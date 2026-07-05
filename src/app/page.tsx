import { type Metadata } from 'next'
import Link from 'next/link'

import caseStudies from '../../data/case-studies.json'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { SectionIntro } from '@/components/SectionIntro'
import { InstantReport } from '@/components/home/PresenceScoreHero'
import { PricingSection } from '@/components/home/PricingSection'
import { type CaseStudyStatic } from '@/components/case-studies/LiveCaseStudyCard'
import { FAQBlock } from '@/components/ui/FAQBlock'
import { HOME_FAQ } from '@/content/home-faq'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { homeSchema } from '@/lib/schema-graph'
import { Button } from '@/components/Button'
import {
  BRAND_SERP_BUILD,
  PRE_SOLD_AUTHOR_BUILD,
} from '@/content/packages'

export const metadata: Metadata = {
  title: 'PodcastNetwork.org. Google authority, built through your podcast',
  description:
    'Google and AI have already decided who you are. Run a free instant report of what they actually know, then see the application-only builds that fix it: the Brand SERP Build and the Pre-Sold Author Build.',
  alternates: { canonical: '/' },
}

/* Section 3: the definition block. Written for answer engines to lift whole
 * and for a first-time visitor to orient in one paragraph. Heading-left,
 * paragraph-right grid. Renders inside the full-viewport sticky wrapper in
 * Home (the CCM curtain), so it carries no section margin of its own. */
function Definition() {
  return (
    <div id="proof" className="w-full scroll-mt-24">
      <Container>
        <FadeIn>
          <div className="grid grid-cols-1 gap-x-12 gap-y-6 border-y border-neutral-950/10 py-12 lg:grid-cols-3">
            <h2 className="font-display text-2xl font-medium tracking-tight text-neutral-950">
              What PodcastNetwork.org does
            </h2>
            <p className="text-base text-neutral-600 lg:col-span-2">
              PodcastNetwork.org builds Google authority for executives,
              authors, and entrepreneurs who want a formal, Google-recognized
              personal brand. The mechanism is a podcast: recorded
              conversations become the credits, citations, and content that
              Google&apos;s Knowledge Graph and the AI answer engines read as
              proof you are real. Two application-only builds deliver it: the{' '}
              {BRAND_SERP_BUILD.priceDisplay} Brand SERP Build and the{' '}
              {PRE_SOLD_AUTHOR_BUILD.priceDisplay} Pre-Sold Author Build.
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}

/* Section 2: the quiz gateway as a dark card directly under the hero
 * (Brett, 2026-07-05: the black ContactSection block is the strongest
 * thing on the page, so the quiz invitation gets the same treatment).
 * The headline keeps the command form because the hero owns the
 * decided-who-you-are line on this page. */
function AssessmentGateway() {
  return (
    <div id="assessment" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
      <Container>
        <FadeIn className="-mx-6 rounded-4xl bg-neutral-950 px-6 py-16 sm:mx-0 sm:py-20 md:px-12">
          <div className="mx-auto max-w-4xl">
            <p className="font-display text-sm font-semibold tracking-wider text-neutral-400 uppercase">
              The three-minute quiz
            </p>
            <h2 className="mt-6 font-display text-3xl font-medium text-balance text-white sm:text-4xl">
              Take control of your Google Knowledge Panel.
            </h2>
            <p className="mt-6 max-w-2xl text-base text-neutral-300">
              The report shows what Google and AI know about you today. In
              three minutes, learn how that record gets written and how to
              take control of what they say about you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="/assessment/" invert>
                Take the quiz
              </Button>
              <p className="text-sm text-neutral-400">
                Free. About three minutes.
              </p>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}

/* Live case studies as a stepped stats band, adapted from the Tailwind
 * Plus "Stepped" stats section (Brett's Plus session, 2026-07-05) in the
 * site's monochrome: three cards rising toward the featured build. No
 * fabricated numbers, per the case-study honesty rule: months, phases,
 * and milestones come straight from data/case-studies.json, and the
 * retired per-study routes lost their links instead of redirecting the
 * reader in a circle. The least progressed build sits out rather than
 * padding the band. */
function CaseStudyBand({ studies }: { studies: CaseStudyStatic[] }) {
  const featured = studies.find((c) => c.variant === 'featured')
  const inLaunch = studies
    .filter((c) => c.variant === 'in-launch')
    .sort((a, b) => (b.currentMonth ?? 0) - (a.currentMonth ?? 0))
  const mid = inLaunch[0]
  const small = inLaunch[1]

  return (
    <FadeIn>
      <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-end">
        {small && (
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-neutral-50 p-8 ring-1 ring-neutral-950/5 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
            <p className="flex-none font-display text-3xl font-medium tracking-tight text-neutral-950">
              Month {small.currentMonth} of {small.totalMonths}
            </p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className="text-lg font-semibold tracking-tight text-neutral-950">
                {small.title}. {small.currentPhase}.
              </p>
              {small.nextMilestone && (
                <p className="mt-2 text-base/7 text-neutral-600">
                  Next milestone: {small.nextMilestone.label}. Published by{' '}
                  {small.publisher}.
                </p>
              )}
            </div>
          </div>
        )}
        {mid && (
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-neutral-950 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
            <p className="flex-none font-display text-3xl font-medium tracking-tight text-white">
              Month {mid.currentMonth} of {mid.totalMonths}
            </p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className="text-lg font-semibold tracking-tight text-white">
                {mid.title}. {mid.currentPhase}.
              </p>
              {mid.nextMilestone && (
                <p className="mt-2 text-base/7 text-neutral-400">
                  Next milestone: {mid.nextMilestone.label}. Published by{' '}
                  {mid.publisher}.
                </p>
              )}
            </div>
          </div>
        )}
        {featured && (
          <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-neutral-950/10 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
            <p className="flex-none font-display text-3xl font-medium tracking-tight text-neutral-950">
              Month 6 of 6. Launched.
            </p>
            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
              <p className="text-lg font-semibold tracking-tight text-neutral-950">
                {featured.title}, published by {featured.publisher} on June
                24, 2026.
              </p>
              <p className="mt-2 text-base/7 text-neutral-600">
                We ran the six-month arc on ourselves: the podcast, the
                pre-sell, the finished book. The case study we can prove
                because we still own it.
              </p>
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  )
}

/* Section 4: the three-tier pricing band (Tailwind Plus block, dark with
 * the solar glow) followed by the stepped case-study band. The shared
 * floor block retired 2026-07-05: its rows live in the comparison table. */
function Packages({ studies }: { studies: CaseStudyStatic[] }) {
  return (
    <div id="packages" className="scroll-mt-24">
      <PricingSection />
      <Container>
        <SectionIntro
          eyebrow="In the wild"
          title="Where the current builds stand."
          className="mt-24"
        >
          <p>
            One finished on our own name and two underway for clients.
            Months, phases, and next milestones exactly as they stand today.
            Nothing projected.
          </p>
        </SectionIntro>
        <CaseStudyBand studies={studies} />
      </Container>
    </div>
  )
}

function Faq() {
  return (
    <div id="faq" className="scroll-mt-24">
      <SectionIntro
        eyebrow="Questions"
        title="Frequently asked questions"
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-16">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <FAQBlock items={HOME_FAQ} />
            <p className="mt-6 text-sm text-neutral-600">
              More questions?{' '}
              <Link
                href="/apply/"
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

      {/* Section 1: hero + Tier 1 Instant Report. The anchor lives on a
          wrapping div because Container does not forward unknown props.
          H1 locked per Brett 2026-07-05; the subhead is Brett's primary
          phrasing (2026-07-05 relay), three lines at the max-w-3xl cap. */}
      <div id="report" className="scroll-mt-24">
        <Container className="mt-24 sm:mt-32 md:mt-40">
          {/* Transform-only entrance: this block holds the LCP headline, so it
              must be visible before hydration. */}
          <div className="pn-rise max-w-3xl">
            <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-6xl">
              Google and AI have already decided who you are.
            </h1>
            <p className="mt-6 text-xl text-neutral-600">
              Every deal, meeting, and reference check starts with a search
              in Google or an AI chat, and what comes up gets shaped with or
              without you. Enter your website or LinkedIn to see what they
              know about you and what&apos;s missing.
            </p>
          </div>
          <InstantReport />
        </Container>
      </div>

      {/* Section 2: quiz gateway, dark card */}
      <AssessmentGateway />

      {/* Sections 3 + 4: the CCM sticky-over curtain (Brett's
          createchurchmedia.com reference). The definition pins at the top
          of the viewport and fully occupies it (min-h-screen, content
          centered); the opaque rounded pricing band climbs over it at
          native scroll speed by stacking order alone. No opacity
          animation, no runway: the viewport-height geometry supplies the
          overlap. motion-safe gates the pin, so prefers-reduced-motion
          reads the page in natural block flow. The pricing section itself
          is not sticky: it is three-plus viewports tall, and a sticky
          element taller than its container's remaining space never pins;
          the curtain comes entirely from the previous section pinning. */}
      <div className="relative mt-24 sm:mt-32 lg:mt-40">
        <div className="z-0 flex min-h-screen items-center motion-safe:sticky motion-safe:top-0">
          <Definition />
        </div>
        <div className="relative z-10">
          <Packages studies={studies} />
        </div>
      </div>

      {/* Section 5: FAQ */}
      <Faq />

      {/* Section 6: apply CTA */}
      <div id="apply-cta" className="scroll-mt-24">
        <ContactSection />
      </div>
    </>
  )
}
