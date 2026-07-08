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
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { homeSchema, faqItemsForUi } from '@/lib/schema-graph'
import { Button } from '@/components/Button'

export const metadata: Metadata = {
  title: 'PodcastNetwork.org. Google authority, built through your podcast',
  description:
    'Google and AI have already decided who you are. Run a free instant report of what they actually know, then see the application-only answer engine optimization builds that fix it: the Brand SERP Build and the Pre-Sold Author Build.',
  alternates: { canonical: '/' },
}

/* Section 2: the quiz gateway as a dark card directly under the hero.
 * Brett ruled 2026-07-07: keep (alongside the case-study timeline); both
 * to be drafted into the copy lock post-pitch. */
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

/* Live case studies as a timeline, adapted from the Tailwind Plus Stats
 * "Timeline" section (harvested from Brett's Plus session 2026-07-07).
 * Months, phases, and milestones come from data/case-studies.json;
 * nothing renders the data cannot back. Date accents stay ink on white
 * per the solar rule (solar is CTA-only on white surfaces). */
function CaseStudyTimeline({ studies }: { studies: CaseStudyStatic[] }) {
  const featured = studies.find((c) => c.variant === 'featured')
  const inLaunch = studies
    .filter((c) => c.variant === 'in-launch')
    .sort((a, b) => (a.currentMonth ?? 0) - (b.currentMonth ?? 0))

  const items = [
    ...inLaunch.map((s) => ({
      key: s.slug,
      marker: `Month ${s.currentMonth} of ${s.totalMonths}`,
      title: `${s.title}. ${s.currentPhase}.`,
      description: s.nextMilestone
        ? `Next milestone: ${s.nextMilestone.label}. Published by ${s.publisher}.`
        : `Published by ${s.publisher}.`,
    })),
    ...(featured
      ? [
          {
            key: featured.slug,
            marker: 'Month 6 of 6. Launched.',
            title: `${featured.title}, published by ${featured.publisher} on June 24, 2026.`,
            description:
              'We ran the six-month arc on ourselves: the podcast, the pre-sell, the finished book. The case study we can prove because we still own it.',
          },
        ]
      : []),
  ]

  return (
    <FadeIn>
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.key}>
            <div className="flex items-center text-sm/6 font-semibold text-neutral-950">
              <svg viewBox="0 0 4 4" aria-hidden="true" className="mr-4 size-1 flex-none">
                <circle r={2} cx={2} cy={2} fill="currentColor" />
              </svg>
              {item.marker}
              <div
                aria-hidden="true"
                className="absolute -ml-2 h-px w-screen -translate-x-full bg-neutral-950/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
              />
            </div>
            <p className="mt-6 text-lg/8 font-semibold tracking-tight text-neutral-950">
              {item.title}
            </p>
            <p className="mt-1 text-base/7 text-neutral-600">{item.description}</p>
          </div>
        ))}
      </div>
    </FadeIn>
  )
}

/* Pricing band + proof timeline. */
function Packages({ studies }: { studies: CaseStudyStatic[] }) {
  return (
    <div id="packages" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
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
        <CaseStudyTimeline studies={studies} />
      </Container>
    </div>
  )
}

/* The playbooks, adapted from the Tailwind Plus "Split with image"
 * content section (harvested from Brett's Plus session 2026-07-07).
 * Reframed per Brett: the books are the published systems behind the
 * builds and the way to study the method before applying. Whole cover
 * panel links to Amazon. Covers served locally from public/books. */
const BOOKS = [
  {
    slug: 'ai-or-die',
    eyebrow: 'The Brand SERP Build playbook',
    title: 'AI or Die',
    subtitle:
      'The Small Business Survival Guide to the Artificial Intelligence Revolution',
    narrative:
      "How Google's Knowledge Graph and the AI answer engines decide who gets recognized, and how to install yourself in that layer. The Brand SERP Build runs this system on you.",
    credit: 'By Mike Partners & Brett K. Moore',
    format: 'Paperback & Kindle. $17.99 / $9.99.',
    href: 'https://www.amazon.com/dp/B0H343DR1L',
    src: '/books/ai-or-die.jpg',
    width: 1707,
    height: 2560,
    reverse: false,
  },
  {
    slug: 'the-book-on-how-to-write-a-book',
    eyebrow: 'The Pre-Sold Author Build playbook',
    title: 'The Book on How to Write a Book',
    subtitle: 'A Systems Approach to Quickly Write and Sell a Book as an Executive',
    narrative:
      'How an executive writes a real book from their own voice and sells it before it ships. The Pre-Sold Author Build runs this system on your book.',
    credit: 'By Mike Partners',
    format: 'Paperback & Kindle. $17.99 / $9.99.',
    href: 'https://www.amazon.com/dp/B0H2Z1H7DR',
    src: '/books/the-book-on-how-to-write-a-book.jpg',
    width: 1716,
    height: 2560,
    reverse: true,
  },
]

function PlaybooksShowcase() {
  return (
    <div id="books" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
      <SectionIntro eyebrow="The playbooks" title="We wrote the systems we sell.">
        <p>
          Every build follows a system we published first. Read either book
          to see the full method before you apply.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <div className="space-y-16 lg:space-y-24">
          {BOOKS.map((book) => (
            <FadeIn key={book.slug}>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
                <a
                  href={book.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${book.title} on Amazon`}
                  className={
                    book.reverse
                      ? 'group flex items-center justify-center rounded-3xl bg-neutral-50 p-10 ring-1 ring-neutral-950/5 lg:order-last lg:p-16'
                      : 'group flex items-center justify-center rounded-3xl bg-neutral-50 p-10 ring-1 ring-neutral-950/5 lg:p-16'
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.src}
                    alt={`${book.title} book cover`}
                    width={book.width}
                    height={book.height}
                    className="h-80 w-auto rounded-md shadow-xl ring-1 ring-neutral-950/10 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl"
                  />
                </a>
                <div>
                  <p className="text-sm font-semibold tracking-wider text-neutral-500 uppercase">
                    {book.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-neutral-950 sm:text-3xl">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-base text-neutral-600">{book.subtitle}</p>
                  <p className="mt-6 text-base/7 text-neutral-600">{book.narrative}</p>
                  <p className="mt-6 text-sm font-semibold text-neutral-950">
                    {book.credit}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">{book.format}</p>
                  <a
                    href={book.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
                  >
                    Read it on Amazon <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </div>
  )
}

/* FAQ, per the copy lock: three concept sections, always visible, with the
 * questions pulled from the same payload the FAQPage JSON-LD emits.
 * Eyebrow reworded per Brett 2026-07-07 (the locked "Three questions"
 * sat over seven questions). */
const FAQ_GROUPS = [
  {
    heading: 'About the diagnostic.',
    ids: ['diagnostic-data', 'diagnostic-storage'],
  },
  {
    heading: 'About the builds.',
    ids: ['vs-seo-agency', 'why-6-to-12-months', 'why-reddit'],
  },
  {
    heading: 'About delivery and results.',
    ids: ['panel-guarantee', 'what-do-i-own'],
  },
]

function Faq() {
  return (
    <div id="faq" className="scroll-mt-24">
      <SectionIntro
        eyebrow="Questions people ask"
        title="Frequently asked questions"
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-16">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            {FAQ_GROUPS.map((group) => (
              <div key={group.heading} className="mt-10 first:mt-0">
                <h3 className="font-display text-sm font-semibold tracking-wider text-neutral-950 uppercase">
                  {group.heading}
                </h3>
                <div className="mt-4">
                  <FAQBlock items={faqItemsForUi(group.ids)} />
                </div>
              </div>
            ))}
            <p className="mt-8 text-sm text-neutral-600">
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

/* Founders sub-section, per the copy lock: the second and last place
 * names appear on the homepage. The /founders route is still redirected
 * to the homepage; reviving it is tracked as a follow-up. */
function FoundersTeaser() {
  return (
    <div id="founders-teaser" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
      <Container>
        <FadeIn>
          <div className="border-t border-neutral-950/10 pt-12">
            <p className="text-base font-semibold text-neutral-950">
              Brett K. Moore. Co-founder + CEO.
            </p>
            <p className="mt-1 text-base font-semibold text-neutral-950">
              Mike Partners. Co-founder + Chief AI Officer.
            </p>
            <p className="mt-4 max-w-2xl text-base text-neutral-600">
              We built PodcastNetwork.org to install the entity
              infrastructure Google and AI already trust, for people who
              need to be recognized without waiting for the algorithm to
              catch up.
            </p>
            <Link
              href="/founders/"
              className="mt-6 inline-block text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
            >
              Read the full story <span aria-hidden="true">&rarr;</span>
            </Link>
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

      {/* Section 1: hero + Tier 1 Instant Report. Eyebrow + brand-agnostic
          subhead per Brett; no trust bar (removed 2026-07-07). */}
      <div id="report" className="scroll-mt-24">
        <Container className="mt-24 sm:mt-32 md:mt-40">
          {/* Transform-only entrance: this block holds the LCP headline, so it
              must be visible before hydration. */}
          <div className="pn-rise max-w-3xl">
            <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
              Answer engine optimization
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-6xl">
              Google and AI have already decided who you are.
            </h1>
            <p className="mt-6 text-xl text-neutral-600">
              Every deal, meeting, and reference check starts with a search in
              Google or an AI chat, and what comes up gets shaped with or
              without you. Enter your website or LinkedIn to see what they know
              about you and what&apos;s missing.
            </p>
          </div>
          <InstantReport />
        </Container>
      </div>

      {/* Section 2: quiz gateway, dark card (kept per Brett 2026-07-07) */}
      <AssessmentGateway />

      {/* Section 3: three-tier pricing + proof timeline */}
      <Packages studies={studies} />

      {/* Section 4: the playbooks */}
      <PlaybooksShowcase />

      {/* Section 5: FAQ */}
      <Faq />

      {/* Section 6: founders teaser */}
      <FoundersTeaser />

      {/* Section 7: terminal CTA */}
      <div id="apply-cta" className="scroll-mt-24">
        <ContactSection />
      </div>
    </>
  )
}
