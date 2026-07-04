import { type Metadata } from 'next'
import Link from 'next/link'

import pnKeyframes from '../../../data/pn-playhead-keyframes.json'
import { Border } from '@/components/Border'
import { Button } from '@/components/Button'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { SectionIntro } from '@/components/SectionIntro'
import { PlayheadProvider } from '@/components/demo/PlayheadContext'
import { SixMonthPlayhead } from '@/components/demo/SixMonthPlayhead'
import { FAQBlock } from '@/components/ui/FAQBlock'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { faqItemsForUi, packageSchema } from '@/lib/schema-graph'
import type { Keyframe } from '@/lib/entity-graph'
import { PRE_SOLD_AUTHOR } from '@/content/packages'

export const metadata: Metadata = {
  title: 'The Pre-Sold Author Package. $36,000, 6 months',
  description:
    'A finished book from your own voice, plus the podcast, the voice clone, and the authority infrastructure to position it for pre-sales. Six months. Application only. Pre-sales depend on execution and market fit.',
  alternates: { canonical: '/the-package/' },
}

const keyframes = (pnKeyframes as { keyframes: Keyframe[] }).keyframes

const PACKAGE_FAQ_IDS = [
  'what-does-pre-sold-author-cover',
  'six-months-not-24',
  'manuscript-in-hand',
  'no-podcast-yet',
  'legacy-jv',
  'pre-sold-audience-mechanics',
  'both-packages-together',
  'is-this-just-for-real-estate',
  'payment-terms',
  'refund',
  'what-if-i-slip',
  'versus-diy',
  'application-timeline',
]

const INCLUDED = [
  {
    title: 'The Book',
    body: 'Eight private interviews become the raw material for your book. Our editorial team shapes your voice into a finished manuscript, delivered by month three. From there you have a publishing option through Legacy Publishing at 10 percent of net royalties, so you keep roughly 90 percent, with cover, interior layout, ARC copies, and retail distribution handled for you.',
  },
  {
    title: 'The Podcast',
    body: 'A launched show, either four episodes recorded with guests or three to five audio-only episodes produced from your voice clone. Branding, hosting, and distribution to the major directories are handled for you. The podcast earns your IMDb Person page through the podcast credit and feeds the authority build.',
  },
  {
    title: 'The Voice Clone',
    body: 'An audio voice clone and a voice corpus, both exclusive to this package. The voice clone lets us produce audio in your voice for the podcast and beyond, and the corpus is yours to keep. This is the differentiator that makes the book and podcast pipeline move at six-month speed.',
  },
  {
    title: 'The Authority Build',
    body: 'Bio pages, contributor citation surfaces, a Wikidata Person entry, author profiles across the major distribution platforms, and a full website if you do not already have one. Podcast tour placements and a coordinated launch sequence position the book for pre-sales in its launch window.',
  },
  {
    title: 'The Operators',
    body: 'Brett and Mike hold the through-line across the full six months. One team, one contract, one price. No add-ons required to hit the deliverables.',
  },
]

const STEPS = [
  {
    title: 'The diagnostic',
    body: 'The application opens with the schema validator. Paste your URL, see your current authority baseline, then answer six questions. About 10 minutes.',
  },
  {
    title: 'The review',
    body: 'We respond within two business days. Accepted applicants get a 20-minute discovery call within one week.',
  },
  {
    title: 'The kickoff',
    body: 'Contract and payment finalize within two weeks. Kickoff typically lands three to four weeks after application. Day 1 starts the clock.',
  },
]

export default function ThePackagePage() {
  const faq = faqItemsForUi(PACKAGE_FAQ_IDS)

  return (
    <>
      <SchemaGraph schema={packageSchema()} />

      <PageIntro
        eyebrow="The Pre-Sold Author Package"
        title="A finished book from your own voice, plus the authority infrastructure to launch it."
      >
        <p>
          One package. One price. {PRE_SOLD_AUTHOR.priceDisplay}. Six months.
          Application only. You bring the expertise. We produce the book, the
          podcast, the voice clone, and the author authority around it, and
          position all of it for pre-sales in the launch window.
        </p>
        <div className="mt-8 flex">
          <Button href="/apply">Start your application</Button>
        </div>
      </PageIntro>

      <SectionIntro
        eyebrow="What it is"
        title="A single integrated build."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-10">
        <FadeIn>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base text-neutral-600 lg:grid-cols-2">
            <p>
              The Pre-Sold Author Package is a six-month sequence that produces
              a finished book from your own voice, a launched podcast, an audio
              voice clone, and the author authority infrastructure around all of
              it. Eight private interviews feed the manuscript. The manuscript
              is delivered by month three. The publishing option runs through
              Legacy Publishing at 10 percent of net royalties.
            </p>
            <p>
              The name is the goal. The package is built to position you for
              pre-sales through authority and audience infrastructure: a real
              podcast, a recognized author entity, launch-window amplification,
              and a coordinated launch sequence. Actual pre-sales depend on
              execution and market fit. We do not guarantee a pre-order number,
              and any operator who does is selling you a story.
            </p>
          </div>
        </FadeIn>
      </Container>

      <SectionIntro
        eyebrow="What's included"
        title="Five commitments."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-16">
        <FadeInStagger>
          <div className="space-y-16">
            {INCLUDED.map((item, i) => (
              <FadeIn key={item.title}>
                <Border className="grid grid-cols-1 gap-6 pt-12 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr] md:gap-12">
                  <div>
                    <p className="font-display text-sm font-semibold tracking-wider text-foil-dark uppercase">
                      0{i + 1}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-neutral-950">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-base text-neutral-600">{item.body}</p>
                </Border>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>
      </Container>

      <SectionIntro
        eyebrow="Every deliverable"
        title="The full sixteen."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          {PRE_SOLD_AUTHOR.priceDisplay} over {PRE_SOLD_AUTHOR.timelineDisplay}.
          Time investment is {PRE_SOLD_AUTHOR.timeInvestment.toLowerCase()}
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeIn>
          <ul
            role="list"
            className="grid max-w-4xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2"
          >
            {PRE_SOLD_AUTHOR.deliverables.map((d) => (
              <li
                key={d}
                className="flex gap-3 text-base text-neutral-600"
              >
                <span aria-hidden="true" className="mt-1 text-foil-dark">
                  &#8226;
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </Container>

      <SectionIntro
        eyebrow="The Legacy option"
        title="The publishing partner is built in, and optional."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-10">
        <FadeIn>
          <div className="max-w-3xl space-y-6 text-base text-neutral-600">
            <p>
              Legacy Publishing is our elite publishing partner. Once your
              manuscript is finished, you have the option to publish through
              Legacy. Legacy handles cover, interior layout, ARC copies, blurb
              sourcing, and retail distribution, and takes 10 percent of net
              book sales as royalty. There is no upfront fee to Legacy beyond
              your {PRE_SOLD_AUTHOR.priceDisplay} payment to PodcastNetwork.org.
              Publishing through Legacy is an option for the book, not a
              required step.
            </p>
            <div className="rounded-3xl border border-foil/40 bg-foil/10 p-6">
              <p className="text-sm text-neutral-950">
                You own the book rights. Legacy operates on the 10 percent net
                royalty structure with no advance and no upfront fee, so you
                keep roughly 90 percent. Full disclosure at{' '}
                <Link
                  href="/legal/legacy-jv/"
                  className="font-semibold text-signal transition hover:text-signal-dark"
                >
                  the Legacy JV page
                </Link>
                .
              </p>
            </div>
          </div>
        </FadeIn>
      </Container>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn>
          <div className="-mx-6 bg-viz-ink px-6 py-16 text-papyrus sm:mx-0 sm:rounded-4xl sm:py-20 md:px-12">
            <h2>
              <span className="mb-6 block font-display text-base font-semibold text-foil">
                The 6-month timeline
              </span>
              <span className="block font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
                Drag it. This is what six months looks like.
              </span>
            </h2>
            <div className="mt-10">
              <PlayheadProvider>
                <SixMonthPlayhead keyframes={keyframes} variant="preview" />
              </PlayheadProvider>
            </div>
            <p className="mt-6 text-sm text-fog">
              The full interactive version (with the entity graph mutating in
              real time) lives on{' '}
              <Link
                href="/the-method/"
                className="font-semibold text-foil transition hover:text-foil-bright"
              >
                the method page
              </Link>
              .
            </p>
          </div>
        </FadeIn>
      </Container>

      <SectionIntro
        eyebrow="The compression, expanded"
        title="Why six months is possible."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-10">
        <FadeIn>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base text-neutral-600 lg:grid-cols-2">
            <p>
              The do-it-yourself path runs two to three years from first draft
              to shelf and stacks up vendor costs along the way: developmental
              and line editing, cover and interior design, a launch publicist,
              and a guest-booking service, each hired separately, each on its
              own clock. At the low end that lands north of $50,000 and produces
              disconnected pieces that were never designed to compound against
              each other.
            </p>
            <p>
              Three things compress the clock. The interviews and the voice
              clone mean the book is built from your voice at speed instead of
              months of blank-page drafting. Parallel workstreams remove the
              waiting: the podcast, the manuscript, and the authority build all
              run at once. And one team holding the through-line is what keeps
              the parallelism from falling apart.
            </p>
          </div>
        </FadeIn>
      </Container>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
            <div>
              <p className="font-display text-sm font-semibold tracking-wider text-foil-dark uppercase">
                Who it&apos;s for
              </p>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-neutral-950">
                Anyone with something worth a book.
              </h2>
              <p className="mt-5 text-base text-neutral-600">
                Executives, authors, entrepreneurs, and professionals who have
                real expertise and want it turned into a published book and the
                author authority around it. You do not need an existing audience
                to qualify. You need something worth saying and the willingness
                to sit for the interviews.
              </p>
            </div>
            <div>
              <p className="font-display text-sm font-semibold tracking-wider text-foil-dark uppercase">
                What we are honest about
              </p>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-neutral-950">
                We build the infrastructure. Sales are earned.
              </h2>
              <p className="mt-5 text-base text-neutral-600">
                This package positions you for pre-sales through authority and
                audience infrastructure. It does not guarantee pre-orders. How
                the launch performs depends on your execution, the strength of
                your existing platform, and market fit. We tell you that up
                front because it is true.
              </p>
            </div>
          </div>
        </FadeIn>
      </Container>

      <SectionIntro
        eyebrow="After you apply"
        title="Three steps."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-16">
        <FadeInStagger>
          <ol
            role="list"
            className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3"
          >
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <FadeIn>
                  <Border position="left" className="pl-8">
                    <p className="font-display text-sm font-semibold tracking-wider text-foil-dark uppercase">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-neutral-950">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-base text-neutral-600">{s.body}</p>
                  </Border>
                </FadeIn>
              </li>
            ))}
          </ol>
        </FadeInStagger>
      </Container>

      <SectionIntro
        eyebrow="Questions"
        title="Everything we get asked."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-16">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <FAQBlock items={faq} />
          </div>
          <div className="mt-14 text-center">
            <p className="font-display text-xl font-medium text-neutral-950">
              Application only. {PRE_SOLD_AUTHOR.priceDisplay}. Six months from
              Day 1 to launch window.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href="/apply">Start your application</Button>
            </div>
          </div>
        </FadeIn>
      </Container>

      <ContactSection />
    </>
  )
}
