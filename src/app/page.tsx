import { type Metadata } from 'next'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { SectionIntro } from '@/components/SectionIntro'
import { InstantReport } from '@/components/home/PresenceScoreHero'
import { PricingSection } from '@/components/home/PricingSection'
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
 * Plus Stats "Timeline" chassis inside a dark band. Content grounded in
 * the package deliverables and the service schema. Solar markers are
 * ambient-on-dark, allowed by the solar rule. */
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
            The arc every build runs, from signing to launch.
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

/* The playbooks. Per Brett 2026-07-07: each book renders as a stylized
 * Amazon listing inside a browser-window frame, on the dark glow panel.
 * Marketplace proof for scrollers who will never click through. Prices
 * intentionally omitted (Amazon controls them). */
const BOOKS = [
  {
    slug: 'ai-or-die',
    eyebrow: 'The Brand SERP Build playbook',
    title: 'AI or Die',
    subtitle:
      'The Small Business Survival Guide to the Artificial Intelligence Revolution',
    narrative:
      "How Google's Knowledge Graph and the AI answer engines decide who gets recognized, and how to install yourself in that layer. The Brand SERP Build runs this system on you.",
    credit: 'Mike Partners & Brett K. Moore',
    href: 'https://www.amazon.com/dp/B0H343DR1L',
    asin: 'B0H343DR1L',
    src: '/books/ai-or-die.jpg',
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
    credit: 'Mike Partners',
    href: 'https://www.amazon.com/dp/B0H2Z1H7DR',
    asin: 'B0H2Z1H7DR',
    src: '/books/the-book-on-how-to-write-a-book.jpg',
    reverse: true,
  },
]

function StarIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ListingWindow({
  title,
  subtitle,
  credit,
  asin,
  src,
}: {
  title: string
  subtitle: string
  credit: string
  asin: string
  src: string
}) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-white/10 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-neutral-100 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-neutral-300" />
        <span className="size-2.5 rounded-full bg-neutral-300" />
        <span className="size-2.5 rounded-full bg-neutral-300" />
        <span className="ml-3 min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 font-mono text-[11px] text-neutral-500 ring-1 ring-neutral-950/5">
          amazon.com/dp/{asin}
        </span>
      </div>
      {/* Listing body */}
      <div className="flex gap-5 p-5 sm:gap-6 sm:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`${title} book cover`}
          width={107}
          height={160}
          className="h-40 w-auto flex-none rounded-sm shadow-md ring-1 ring-neutral-950/10"
        />
        <div className="min-w-0">
          <p className="text-sm/5 font-semibold text-neutral-950">
            {title}: {subtitle}
          </p>
          <p className="mt-1 text-xs text-neutral-600">by {credit}</p>
          <div className="mt-2 flex items-center gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <StarIcon key={i} className="size-3.5 text-amber-400" />
            ))}
            <span className="ml-1.5 text-xs font-medium text-neutral-600">
              5.0
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-neutral-950">
            Paperback &amp; Kindle
          </p>
          <span className="mt-4 inline-block rounded-full bg-solar px-4 py-1.5 text-xs font-semibold text-neutral-950">
            View on Amazon
          </span>
        </div>
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
                      ? 'group relative flex items-center justify-center overflow-hidden rounded-3xl bg-neutral-950 px-6 py-12 sm:px-10 lg:order-last lg:py-16'
                      : 'group relative flex items-center justify-center overflow-hidden rounded-3xl bg-neutral-950 px-6 py-12 sm:px-10 lg:py-16'
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
                  <ListingWindow
                    title={book.title}
                    subtitle={book.subtitle}
                    credit={book.credit}
                    asin={book.asin}
                    src={book.src}
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
                    By {book.credit}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    Paperback &amp; Kindle on Amazon.
                  </p>
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

/* FAQ: questions AND answers always visible per Brett 2026-07-07 (no
 * accordions; the answers are the point). Grouped by buyer objection.
 * Same faqItemsForUi payload the FAQPage JSON-LD emits, so on-page text
 * and schema stay in lockstep. */
const FAQ_GROUPS = [
  {
    heading: 'How it works',
    ids: ['vs-seo-agency', 'why-6-to-12-months', 'why-reddit'],
  },
  {
    heading: 'What you get and keep',
    ids: ['what-do-i-own', 'panel-guarantee'],
  },
  {
    heading: 'The instant report',
    ids: ['diagnostic-data', 'diagnostic-storage'],
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
          <div className="space-y-16">
            {FAQ_GROUPS.map((group) => (
              <div
                key={group.heading}
                className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-neutral-950/10 pt-10 lg:grid-cols-12"
              >
                <h3 className="font-display text-lg font-semibold text-neutral-950 lg:col-span-4">
                  {group.heading}
                </h3>
                <dl className="space-y-10 lg:col-span-8">
                  {faqItemsForUi(group.ids).map((item) => (
                    <div key={item.question}>
                      <dt className="text-base font-semibold text-neutral-950">
                        {item.question}
                      </dt>
                      <dd className="mt-2 text-base/7 text-neutral-600">
                        {item.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            <p className="border-t border-neutral-950/10 pt-8 text-sm text-neutral-600">
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
 * names appear on the homepage. The /founders page is live and in the
 * header nav. */
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
