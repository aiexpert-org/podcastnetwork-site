import { type Metadata } from 'next'
import Link from 'next/link'
import clsx from 'clsx'

import caseStudies from '../../data/case-studies.json'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { SectionIntro } from '@/components/SectionIntro'
import { InstantReport } from '@/components/home/PresenceScoreHero'
import {
  LiveCaseStudyCard,
  type CaseStudyStatic,
} from '@/components/case-studies/LiveCaseStudyCard'
import { FAQBlock } from '@/components/ui/FAQBlock'
import { HOME_FAQ } from '@/content/home-faq'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { homeSchema } from '@/lib/schema-graph'
import { Button } from '@/components/Button'
import {
  BOTH_PACKAGES_PRICE_DISPLAY,
  KNOWLEDGE_PANEL_INSTALL,
  PRE_SOLD_AUTHOR,
  SHARED_FLOOR,
  type PackageMeta,
} from '@/content/packages'

export const metadata: Metadata = {
  title: 'PodcastNetwork.org. Google authority, built through your podcast',
  description:
    'Google and AI have already decided who you are. Run a free instant report of what they actually know, then see the two application-only builds that fix it: the Knowledge Panel Install and the Pre-Sold Author Package.',
  alternates: { canonical: '/' },
}

/* Section 3: the definition block. Written for answer engines to lift whole
 * and for a first-time visitor to orient in one paragraph. Heading-left,
 * paragraph-right grid so the band uses its full width (Brett, 2026-07-05:
 * the single narrow column read as a spacing bug). */
function Definition() {
  return (
    <div id="proof" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
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
              {KNOWLEDGE_PANEL_INSTALL.priceDisplay} Knowledge Panel Install
              and the {PRE_SOLD_AUTHOR.priceDisplay} Pre-Sold Author Package.
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

function CheckIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

/* Pricing cards adapted from the Tailwind Plus "Two tiers with emphasized
 * left tier" section (harvested from Brett's Plus session, 2026-07-05).
 * The KP Install pops as the featured tier per the KP-first ladder; the
 * PSA sits inset with joined corners. Indigo became ink, the gradient
 * blob stayed home, and the CTA hierarchy is solar for the primary,
 * outline for the upsell. */
function PricingCard({
  pkg,
  anchorId,
  featured = false,
  badge,
}: {
  pkg: PackageMeta
  anchorId: string
  featured?: boolean
  badge?: string
}) {
  return (
    <div
      id={anchorId}
      className={clsx(
        featured
          ? 'relative bg-white shadow-2xl'
          : 'bg-white/60 sm:mx-8 sm:rounded-t-none lg:mx-0 lg:rounded-tr-3xl lg:rounded-bl-none',
        'scroll-mt-24 rounded-3xl p-8 ring-1 ring-neutral-950/10 sm:p-10',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-sm font-semibold tracking-wider text-neutral-950 uppercase">
          {pkg.name}
        </h3>
        {badge && (
          <p className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white">
            {badge}
          </p>
        )}
      </div>
      <p className="mt-4 flex items-baseline gap-x-2">
        <span className="font-display text-5xl font-medium tracking-tight text-neutral-950">
          {pkg.priceDisplay}
        </span>
        <span className="text-base text-neutral-500">total</span>
      </p>
      <p className="mt-2 text-sm text-neutral-600">
        {pkg.timelineDisplay}, application only
      </p>
      {pkg.payment && (
        <p className="mt-1 text-sm text-neutral-600">
          {pkg.payment.planDisplay}
        </p>
      )}
      <p className="mt-6 text-base/7 text-neutral-600">{pkg.tagline}</p>
      <ul role="list" className="mt-8 space-y-3 text-sm/6 text-neutral-600">
        {pkg.differentiators.map((d) => (
          <li key={d} className="flex gap-x-3">
            <CheckIcon className="h-6 w-5 flex-none text-neutral-950" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-neutral-600">
        {pkg.deliverables.length} deliverables in total. {pkg.timeInvestment}
      </p>
      {featured ? (
        <Button href="/apply/" className="mt-8 w-full sm:mt-10">
          Apply for this build
        </Button>
      ) : (
        <Link
          href="/apply/"
          className="mt-8 block rounded-xl border border-neutral-950/15 px-5 py-2.5 text-center text-sm font-semibold text-neutral-950 transition hover:border-neutral-950/40 sm:mt-10"
        >
          Apply for this build
        </Link>
      )}
    </div>
  )
}

/* Section 4: the two packages, the shared floor folded in from the retired
 * package routes, and the live proof cards folded in from the retired
 * case-studies route. */
function Packages({ studies }: { studies: CaseStudyStatic[] }) {
  const featured = studies.find((c) => c.variant === 'featured')
  const inLaunch = studies.filter((c) => c.variant === 'in-launch')

  return (
    <div id="packages" className="scroll-mt-24">
      <SectionIntro
        eyebrow="The fixes"
        title="Two builds: the Knowledge Panel Install and the Pre-Sold Author Package."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          Each one closes gaps the report just showed you. The Knowledge Panel
          Install is for executives who need Google to recognize them as an
          entity: schema, entity graph, citation signals, verified monthly for
          a year. The Pre-Sold Author Package produces a finished book from
          your own voice on top of that authority build. Both standalone, both
          application only. Take both and it&apos;s{' '}
          {BOTH_PACKAGES_PRICE_DISPLAY}, run in parallel on their own
          timelines. No bundle discount, because each one stands on its own.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeIn>
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:grid-cols-2">
            <PricingCard
              pkg={KNOWLEDGE_PANEL_INSTALL}
              anchorId="knowledge-panel"
              featured
              badge="Start here"
            />
            <PricingCard pkg={PRE_SOLD_AUTHOR} anchorId="pre-sold-author" />
          </div>
        </FadeIn>

        <FadeIn>
          <div className="mt-16 rounded-4xl bg-neutral-50 p-8 ring-1 ring-neutral-950/5 sm:p-10">
            <h3 className="font-display text-sm font-semibold tracking-wider text-neutral-950 uppercase">
              The shared floor
            </h3>
            <p className="mt-3 max-w-2xl text-sm text-neutral-600">
              Every client walks away with the same base, whichever build they
              pick. Each package adds its own depth on top of it.
            </p>
            <ul
              role="list"
              className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2"
            >
              {SHARED_FLOOR.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm text-neutral-600"
                >
                  <span aria-hidden="true" className="mt-1 text-neutral-950">
                    &#8226;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <SectionIntro
          eyebrow="In the wild"
          title="Live case studies you can verify."
          className="mt-24"
        >
          <p>
            Live numbers from recent builds, pulled from the same sources
            Google reads and refreshed hourly.
          </p>
        </SectionIntro>
        <FadeInStagger>
          <div className="mt-12">
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
          </div>
        </FadeInStagger>
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
          Stakes sentence first (matches the quiz page pairing), then the
          hand-off to the five-second proof. */}
      <div id="report" className="scroll-mt-24">
        <Container className="mt-24 sm:mt-32 md:mt-40">
          {/* Transform-only entrance: this block holds the LCP headline, so it
              must be visible before hydration. */}
          <div className="pn-rise max-w-3xl">
            <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-6xl">
              Google and AI have already decided who you are.
            </h1>
            <p className="mt-6 text-xl text-neutral-600">
              Every deal, meeting, and reference check starts with a search,
              in Google or in an AI chat, and what comes up gets shaped with
              or without you. Enter your website or LinkedIn profile and see
              what they actually know about you, and what&apos;s missing.
            </p>
          </div>
          <InstantReport />
        </Container>
      </div>

      {/* Section 2: quiz gateway, dark card */}
      <AssessmentGateway />

      {/* Section 3: definition block */}
      <Definition />

      {/* Section 4: the two packages + folded proof */}
      <Packages studies={studies} />

      {/* Section 5: FAQ */}
      <Faq />

      {/* Section 6: apply CTA */}
      <div id="apply-cta" className="scroll-mt-24">
        <ContactSection />
      </div>
    </>
  )
}
