import { type Metadata } from 'next'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { SectionIntro } from '@/components/SectionIntro'
import { InstantReport } from '@/components/home/PresenceScoreHero'
import { PricingSection } from '@/components/home/PricingSection'
import { FAQBlock } from '@/components/ui/FAQBlock'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { homeSchema, faqItemsForUi } from '@/lib/schema-graph'
import { Button } from '@/components/Button'

export const metadata: Metadata = {
  title:
    'PodcastNetwork.org. Answer engine optimization for executives, authors, and entrepreneurs',
  description:
    'Google and AI have already decided who you are. Run a free instant report of what they actually know, then see the application-only answer engine optimization builds that fix it: the Brand SERP Build and the Pre-Sold Author Build.',
  alternates: { canonical: '/' },
}

/* Section 2: the quiz gateway as a dark card directly under the hero.
 * Brett ruled 2026-07-07: keep. */
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

/* The plan: month-by-month walk of the first six months, on the Tailwind
 * Plus Stats "Timeline" chassis inside a dark band. Replaces the client
 * case-study band per Brett 2026-07-07 (unknown names carry no proof
 * weight on a one-page site; the real objection after pricing is "what
 * happens after I pay"). Content grounded in the package deliverables
 * and the service schema. Solar markers are ambient-on-dark, allowed by
 * the solar rule. */
const MONTHS = [
  {
    n: 1,
    title: 'The raw material',
    description:
      'Eight private interviews captured. Your Wikidata entry is filed, schema goes live on your site, and the voice corpus records.',
  },
  {
    n: 2,
    title: 'The show goes live',
    description:
      'Your podcast launches and the episode arc begins. The manuscript takes shape from your own transcribed voice.',
  },
  {
    n: 3,
    title: 'The finished manuscript',
    description:
      'Delivered by the end of month three. Cover design, interior layout, and your pre-order page go live with it.',
  },
  {
    n: 4,
    title: 'The pre-sell opens',
    description:
      'The audience sequence starts. Citation surfaces accumulate and Google begins resolving you as an entity.',
  },
  {
    n: 5,
    title: 'The runway',
    description:
      'Podcast tour placements, press and reporting, and the launch sequence line up behind the book.',
  },
  {
    n: 6,
    title: 'Launch',
    description:
      'The book ships to an audience that already said yes. The recognition layer keeps compounding through month twelve.',
  },
]

function SixMonthPlan() {
  return (
    <div id="plan" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
      <Container>
        <FadeIn className="-mx-6 rounded-4xl bg-neutral-950 px-6 py-16 sm:mx-0 sm:py-20 md:px-12">
          <p className="font-display text-sm font-semibold tracking-wider text-neutral-400 uppercase">
            The plan
          </p>
          <h2 className="mt-6 font-display text-3xl font-medium text-balance text-white sm:text-4xl">
            What the first six months look like.
          </h2>
          <p className="mt-6 max-w-2xl text-base text-neutral-300">
            The same arc every build runs. Month by month, in the order it
            happens.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {MONTHS.map((m) => (
              <div key={m.n}>
                <div className="flex items-center text-sm/6 font-semibold text-solar">
                  <svg
                    viewBox="0 0 4 4"
                    aria-hidden="true"
                    className="mr-4 size-1 flex-none"
                  >
                    <circle r={2} cx={2} cy={2} fill="currentColor" />
                  </svg>
                  Month {m.n}
                  <div
                    aria-hidden="true"
                    className="absolute -ml-2 h-px w-screen -translate-x-full bg-white/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                  />
                </div>
                <p className="mt-4 text-lg/8 font-semibold tracking-tight text-white">
                  {m.title}
                </p>
                <p className="mt-1 text-base/7 text-neutral-300">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}

/* Pricing band. */
function Packages() {
  return (
    <div id="packages" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
      <PricingSection />
    </div>
  )
}

/* The playbooks, on the Tailwind Plus "Split with image" chassis with the
 * covers rendered as CSS 3D paperbacks on dark panels (faint solar glow,
 * ambient-on-dark). The books do two jobs: proof we wrote the method, and
 * a low-commitment first step before the application. */
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
    spine: '#155e66',
    reverse: false,
  },
  {
    slug: 'the-book-on-how-to-write-a-book',
    eyebrow: 'The Pre-Sold Author Build playbook',
    title: 'The Book on How to Write a Book',
    subtitle:
      'A Systems Approach to Quickly Write and Sell a Book as an Executive',
    narrative:
      'How an executive writes a real book from their own voice and sells it before it ships. The Pre-Sold Author Build runs this system on your book.',
    credit: 'By Mike Partners',
    format: 'Paperback & Kindle. $17.99 / $9.99.',
    href: 'https://www.amazon.com/dp/B0H2Z1H7DR',
    src: '/books/the-book-on-how-to-write-a-book.jpg',
    spine: '#0a0a0a',
    reverse: true,
  },
]

function Book3D({
  src,
  alt,
  spine,
}: {
  src: string
  alt: string
  spine: string
}) {
  return (
    <div style={{ perspective: '1000px' }}>
      <div
        className="relative transition-transform duration-500 [transform:rotateY(-30deg)] [transform-style:preserve-3d] group-hover:[transform:rotateY(-16deg)]"
        style={{ width: 220, height: 330 }}
      >
        {/* Front cover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={220}
          height={330}
          className="absolute inset-0 h-full w-full rounded-l-xs rounded-r-md object-cover"
          style={{ transform: 'translateZ(15px)' }}
        />
        {/* Page block on the right edge */}
        <div
          aria-hidden="true"
          className="absolute"
          style={{
            top: 3,
            bottom: 3,
            left: 0,
            width: 29,
            transform: 'translateX(205px) rotateY(90deg)',
            background:
              'linear-gradient(90deg,#e8e6e1 0%,#fdfdfb 8%,#e8e6e1 16%,#fdfdfb 24%,#e8e6e1 32%,#fdfdfb 40%,#e8e6e1 48%,#fdfdfb 56%,#e8e6e1 64%,#fdfdfb 72%,#e8e6e1 80%,#fdfdfb 88%,#e8e6e1 100%)',
          }}
        />
        {/* Back cover */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-l-xs rounded-r-md"
          style={{
            background: spine,
            transform: 'translateZ(-15px)',
            boxShadow: '-12px 0 40px 10px rgba(0,0,0,0.45)',
          }}
        />
      </div>
    </div>
  )
}

function PlaybooksShowcase() {
  return (
    <div id="books" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
      <SectionIntro eyebrow="The playbooks" title="We wrote the systems we sell.">
        <p>
          Every build follows a system we published first. Read the method
          for the price of a paperback, then apply when you&apos;ve seen the
          whole system.
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
                      ? 'group relative flex items-center justify-center overflow-hidden rounded-3xl bg-neutral-950 px-10 py-14 lg:order-last lg:py-20'
                      : 'group relative flex items-center justify-center overflow-hidden rounded-3xl bg-neutral-950 px-10 py-14 lg:py-20'
                  }
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(ellipse 65% 55% at 50% 62%, rgba(255,221,5,0.16), transparent)',
                    }}
                  />
                  <Book3D
                    src={book.src}
                    alt={`${book.title} book cover`}
                    spine={book.spine}
                  />
                </a>
                <div>
                  <p className="text-sm font-semibold tracking-wider text-neutral-500 uppercase">
                    {book.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-neutral-950 sm:text-3xl">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-base text-neutral-600">
                    {book.subtitle}
                  </p>
                  <p className="mt-6 text-base/7 text-neutral-600">
                    {book.narrative}
                  </p>
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
 * Eyebrow reworded per Brett 2026-07-07. Always-open redesign lands in
 * the next pass. */
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
 * names appear on the homepage. The /founders page is live and now in
 * the header nav. */
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
  return (
    <>
      <SchemaGraph schema={homeSchema()} />

      {/* Section 1: hero + Tier 1 Instant Report. Eyebrow + brand-agnostic
          subhead per Brett; no trust bar. */}
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

      {/* Section 2: quiz gateway, dark card */}
      <AssessmentGateway />

      {/* Section 3: three-tier pricing */}
      <Packages />

      {/* Section 4: the six-month plan, dark band */}
      <SixMonthPlan />

      {/* Section 5: the playbooks */}
      <PlaybooksShowcase />

      {/* Section 6: FAQ */}
      <Faq />

      {/* Section 7: founders teaser */}
      <FoundersTeaser />

      {/* Section 8: terminal CTA */}
      <div id="apply-cta" className="scroll-mt-24">
        <ContactSection />
      </div>
    </>
  )
}
