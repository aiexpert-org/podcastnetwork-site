import { type Metadata } from 'next'
import Link from 'next/link'

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
  title: 'PodcastNetwork.org. See what Google actually knows about you',
  description:
    'Enter your website or LinkedIn and get an instant report of real findings: Knowledge Graph, Wikidata, owned schema, Lighthouse SEO, Wikipedia, Entity Home. Then see the two builds that fix what is missing.',
  alternates: { canonical: '/' },
}

/* Section 2: the trust bar. One horizontal strip, names and proof, with the
 * two-line founder story beneath it. Specific portfolio numbers are a
 * NEXT-STEPS item awaiting Brett; nothing here is a claim we cannot back. */
function TrustBar() {
  return (
    <div id="proof" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
      <Container>
        <FadeIn>
          <div className="border-y border-neutral-950/10 py-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-6 text-center sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  Built and run by
                </dt>
                <dd className="mt-2 font-display text-lg font-medium text-neutral-950">
                  Brett K Moore + Mike Partners
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  Intake
                </dt>
                <dd className="mt-2 font-display text-lg font-medium text-neutral-950">
                  Application only
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  Proof standard
                </dt>
                <dd className="mt-2 font-display text-lg font-medium text-neutral-950">
                  Live data you can verify
                </dd>
              </div>
            </dl>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-neutral-600">
              The co-founders ran the Pre-Sold Author Package on themselves
              first. Their book AI or Die launched 2026-06-24 under the Legacy
              Publishing JV, and its live numbers render further down this
              page.
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}

/* Section 3: the Tier 2 gateway. Email is captured inside the assessment
 * flow itself (question 9), not here. */
function AssessmentGateway() {
  return (
    <div id="assessment" className="scroll-mt-24">
      <SectionIntro
        eyebrow="The deeper assessment"
        title="Want a deeper analysis?"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          The instant report shows what Google sees. The assessment works out
          what to do about it: ten questions, about three minutes, and a
          personalized recommendation for which build fits what you are trying
          to accomplish.
        </p>
      </SectionIntro>
      <Container className="mt-10">
        <FadeIn>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="/assessment/">Start the assessment</Button>
            <p className="text-sm text-neutral-600">
              Your recommendation renders on screen at the end.
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}

function PathCard({ pkg, anchorId }: { pkg: PackageMeta; anchorId: string }) {
  return (
    <FadeIn className="flex">
      <div
        id={anchorId}
        className="flex w-full scroll-mt-24 flex-col rounded-4xl border border-neutral-950/10 bg-white p-8 sm:p-10"
      >
        <p className="font-display text-sm font-semibold tracking-wider text-neutral-950 uppercase">
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
              <span aria-hidden="true" className="mt-1 text-neutral-950">
                &#8226;
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-neutral-600">
          {pkg.deliverables.length} deliverables in total.{' '}
          {pkg.timeInvestment}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
          <Button href="/apply/">Apply for this build</Button>
          <Link
            href="/assessment/"
            className="text-sm font-semibold text-signal transition hover:text-signal-dark"
          >
            Not sure? Take the assessment{' '}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </FadeIn>
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
        title="Two builds. Each one closes gaps the report just showed you."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          The Knowledge Panel Install is for executives who need Google to
          recognize them as an entity: schema, entity graph, citation signals,
          verified monthly for a year. The Pre-Sold Author Package produces a
          finished book from your own voice on top of that authority build.
          Both standalone, both application only. Take both and it&apos;s{' '}
          {BOTH_PACKAGES_PRICE_DISPLAY}, run in parallel on their own
          timelines. No bundle discount, because each one stands on its own.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <PathCard pkg={KNOWLEDGE_PANEL_INSTALL} anchorId="knowledge-panel" />
            <PathCard pkg={PRE_SOLD_AUTHOR} anchorId="pre-sold-author" />
          </div>
        </FadeInStagger>

        <FadeIn>
          <div className="mt-16 rounded-4xl bg-neutral-50 p-8 ring-1 ring-neutral-950/5 sm:p-10">
            <p className="font-display text-sm font-semibold tracking-wider text-neutral-950 uppercase">
              The shared floor
            </p>
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
          title="Live proof you can check."
          className="mt-24"
        >
          <p>
            These cards pull their numbers from the same APIs Google reads,
            refreshed hourly. AI or Die is the founders&apos; own run of the
            Pre-Sold Author Package.
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
          wrapping div because Container does not forward unknown props. */}
      <div id="report" className="scroll-mt-24">
        <Container className="mt-24 sm:mt-32 md:mt-40">
          {/* Transform-only entrance: this block holds the LCP headline, so it
              must be visible before hydration. */}
          <div className="pn-rise max-w-3xl">
            <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-7xl">
              Your online presence is lacking. We can prove it.
            </h1>
            <p className="mt-6 text-xl text-neutral-600">
              Enter your website or LinkedIn profile and get an instant report:
              what Google actually knows about you, what&apos;s missing, and
              which of our two builds fixes each gap.
            </p>
          </div>
          <InstantReport />
        </Container>
      </div>

      {/* Section 2: trust bar */}
      <TrustBar />

      {/* Section 3: Tier 2 gateway */}
      <AssessmentGateway />

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
