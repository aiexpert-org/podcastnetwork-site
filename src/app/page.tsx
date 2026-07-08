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
  title: 'PodcastNetwork.org. Answer engine optimization, built through your podcast',
  description:
    'Google and AI have already decided who you are. Run a free instant report of what they actually know, then see the application-only answer engine optimization builds that fix it: the Brand SERP Build and the Pre-Sold Author Build.',
  alternates: { canonical: '/' },
}

/* Section 2: the quiz gateway as a dark card directly under the hero.
 * NOTE: the 2026-07-05 copy lock's flow omits this section; retained
 * pending explicit word because it is the homepage's direct quiz path. */
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

/* Pricing section. The "In the wild" case study band was removed
 * 2026-07-08 per copy lock flow alignment (Seth pitch). */
function Packages() {
  return (
    <div id="packages" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
      <PricingSection />
    </div>
  )
}

/* Two-book showcase, per the 2026-07-05 copy lock: the one place on the
 * homepage where names appear as authors. Covers are the full-resolution
 * flat covers (Brett-approved art), served locally from public/books,
 * committed byte-perfect via the browser upload path. */
function TwoBookShowcase() {
  return (
    <div id="books" className="mt-24 scroll-mt-24 sm:mt-32 lg:mt-40">
      <SectionIntro eyebrow="We wrote the books" title="Two builds. Two books.">
        <p>
          Brand SERP Build is the AI-visibility system from AI or Die,
          installed on you. Pre-Sold Author Build is the write-and-presell
          system from The Book on How to Write a Book, installed on your
          book.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeIn>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-950/10">
              <div className="flex items-center justify-center bg-neutral-50 p-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/books/ai-or-die.jpg"
                  alt="AI or Die book cover"
                  width={1707}
                  height={2560}
                  className="h-72 w-auto rounded-md shadow-xl ring-1 ring-neutral-950/10"
                />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display text-xl font-medium tracking-tight text-neutral-950">
                  AI or Die
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  The Small Business Survival Guide to the Artificial
                  Intelligence Revolution
                </p>
                <p className="mt-3 text-sm font-semibold text-neutral-950">
                  By Mike Partners &amp; Brett K. Moore
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  Paperback &amp; Kindle. $17.99 / $9.99.
                </p>
                <a
                  href="https://www.amazon.com/dp/B0H343DR1L"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-6 text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
                >
                  Buy on Amazon <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-950/10">
              <div className="flex items-center justify-center bg-neutral-50 p-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/books/the-book-on-how-to-write-a-book.jpg"
                  alt="The Book on How to Write a Book cover"
                  width={1716}
                  height={2560}
                  className="h-72 w-auto rounded-md shadow-xl ring-1 ring-neutral-950/10"
                />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display text-xl font-medium tracking-tight text-neutral-950">
                  The Book on How to Write a Book
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  A Systems Approach to Quickly Write and Sell a Book as an
                  Executive
                </p>
                <p className="mt-3 text-sm font-semibold text-neutral-950">
                  By Mike Partners
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  Paperback &amp; Kindle. $17.99 / $9.99.
                </p>
                <a
                  href="https://www.amazon.com/dp/B0H2Z1H7DR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-6 text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
                >
                  Buy on Amazon <span aria-hidden="true">&rarr;</span>
                </a>
                <p className="mt-4 text-xs text-neutral-500">
                  30+ authors published using this system.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}

/* FAQ, per the copy lock: three concept sections, always visible, with the
 * questions pulled from the same payload the FAQPage JSON-LD emits. */
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
        eyebrow="Three questions people ask"
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
  return (
    <>
      <SchemaGraph schema={homeSchema()} />

      {/* Section 1: hero + Tier 1 Instant Report + trust bar. H1 locked;
          subhead and trust bar per the 2026-07-05 copy lock. */}
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

      {/* Section 2: quiz gateway, dark card (retained; see note above) */}
      <AssessmentGateway />

      {/* Section 3: three-tier pricing */}
      <Packages />

      {/* Section 4: two-book showcase */}
      <TwoBookShowcase />

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
