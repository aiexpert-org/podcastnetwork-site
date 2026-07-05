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
  title: 'PodcastNetwork.org. Google authority, built through your podcast',
  description:
    'Google and AI have already decided who you are. Run a free instant report of what they actually know, then see the two application-only builds that fix it: the Knowledge Panel Install and the Pre-Sold Author Package.',
  alternates: { canonical: '/' },
}

/* Section 2: the definition block. Written for answer engines to lift whole
 * and for a first-time visitor to orient in one paragraph. */
function Definition() {
  return (
    <div id="proof" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
      <Container>
        <FadeIn>
          <div className="border-y border-neutral-950/10 py-10">
            <h2 className="font-display text-2xl font-medium tracking-tight text-neutral-950">
              What PodcastNetwork.org does
            </h2>
            <p className="mt-4 max-w-3xl text-base text-neutral-600">
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

/* Section 3: the quiz gateway. The hero owns the stakes sentence now, so
 * this section's job is the stitch: the report showed the record, the quiz
 * teaches how to take control of it. The headline keeps the command form
 * because the hero owns the decided-who-you-are line on this page. */
function AssessmentGateway() {
  return (
    <div id="assessment" className="scroll-mt-24">
      <SectionIntro
        eyebrow="The three-minute quiz"
        title="Take control of your Google Knowledge Panel."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          The report shows what Google and AI know about you today. In three
          minutes, learn how that record gets written and how to take control
          of what they say about you.
        </p>
      </SectionIntro>
      <Container className="mt-10">
        <FadeIn>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="/assessment/">Take the quiz</Button>
            <p className="text-sm text-neutral-600">
              Free. About three minutes.
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
        <h3 className="font-display text-sm font-semibold tracking-wider text-neutral-950 uppercase">
          {pkg.name}
        </h3>
        <p className="mt-4 font-display text-4xl font-medium tracking-tight text-neutral-950">
          {pkg.priceDisplay}
        </p>
        <p className="mt-1 text-sm text-neutral-600">
          {pkg.timelineDisplay}, application only
        </p>
        {pkg.payment && (
          <p className="mt-1 text-sm text-neutral-600">
            {pkg.payment.planDisplay}
          </p>
        )}
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
        <div className="mt-8 pt-2">
          <Button href="/apply/">Apply for this build</Button>
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
        <FadeInStagger>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <PathCard pkg={KNOWLEDGE_PANEL_INSTALL} anchorId="knowledge-panel" />
            <PathCard pkg={PRE_SOLD_AUTHOR} anchorId="pre-sold-author" />
          </div>
        </FadeInStagger>

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
              or without you. We can prove it. Enter your website or LinkedIn
              profile and see what they actually know about you, and
              what&apos;s missing.
            </p>
          </div>
          <InstantReport />
        </Container>
      </div>

      {/* Section 2: definition block */}
      <Definition />

      {/* Section 3: quiz gateway */}
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
