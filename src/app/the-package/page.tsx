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

export const metadata: Metadata = {
  title: 'The Pre-Sold Author Package. $30,000, 180 days',
  description:
    'A book, a podcast, a knowledge panel, and a pre-sold audience of 5,000+ readers. Delivered in 180 days. One package. One price. Application-only.',
  alternates: { canonical: '/the-package/' },
}

const keyframes = (pnKeyframes as { keyframes: Keyframe[] }).keyframes

const PACKAGE_FAQ_IDS = [
  'what-does-30k-cover',
  'six-months-not-24',
  'manuscript-in-hand',
  'no-podcast-yet',
  'legacy-jv',
  'knowledge-panel-mechanics',
  'pre-sold-audience-mechanics',
  'payment-terms',
  'refund',
  'what-if-i-slip',
  'versus-diy',
  'application-timeline',
]

const INCLUDED = [
  {
    title: 'The Book',
    body: "Two paths in, same price, same timeline. Ghostwriting path: we interview you across your existing podcast catalog, keynotes, and articles; our editorial team shapes the raw voice into a manuscript, draft complete by Day 90. Manuscript-in-hand path: you bring the draft, we run the five-pass edit (developmental, structural, line, copy, proof) with Legacy Publishing's editorial team, complete Day 60 to 75. From Day 90, Legacy takes the handoff: cover, interior layout, ARC copies, blurbs, retail distribution.",
  },
  {
    title: 'The Podcast',
    body: 'A 30-day launch inside the PodcastNetwork.org network. Show branding, cover art, hosting setup, distribution across Apple Podcasts, Spotify, and the major directories, and a sequenced launch cadence. The podcast is in-market by Day 30 and compounds throughout the six months, driving list growth and pre-orders into launch week.',
  },
  {
    title: 'The Knowledge Panel',
    body: 'A live Google Knowledge Panel by Day 180. The mechanics: Entity Home construction, Wikidata Q-number seeding, structured data markup, and Google Knowledge Graph indexing. Wikidata seeding starts Day 1. Entity Home built Day 14 to 30. Google pickup typically 60 to 120 days from seed. The industry standard treats this as a 12 to 24 month standalone engagement.',
  },
  {
    title: 'The Pre-Sold Audience',
    body: '12 to 15 top-tier podcast guest appearances in your category, booked and sequenced across Days 30 to 150. Each appearance drives traffic to a waitlist landing page with a book-preview lead magnet. Waitlist mechanics convert signups into pre-orders in the final 60 days. Target: 5,000+ pre-orders locked before launch day.',
  },
  {
    title: 'The Operators',
    body: 'Brett and Mike hold the through-line for all four pillars across the full 180 days. One operator, one contract, one price. No add-ons required to hit the deliverables.',
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
        eyebrow="The package"
        title="A book, a podcast, a knowledge panel, and a pre-sold audience. Delivered in 180 days."
      >
        <p>
          One package. One price. $30,000. Application-only. The industry
          standard for a knowledge panel alone runs 12 to 24 months. We ship
          all four pillars in six.
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
              The Pre-Sold Author Package is a productized six-month sequence
              that produces four coordinated deliverables on a single timeline:
              a finished book published through Legacy Publishing, a launched
              podcast inside the PodcastNetwork.org network, a live Google
              Knowledge Panel, and a pre-sold audience of 5,000+ opted-in
              readers ready on launch day.
            </p>
            <p>
              Coaching, courses, and standalone ghostwriting all leave the
              author holding the coordination problem: write the book, then
              figure out the audience, then chase the knowledge panel, then
              hope the launch lands. Every one of those decisions gets made in
              sequence, and the calendar stretches to two or three years. This
              package runs the four pillars in parallel from Day 1 against the
              same 180-day clock, under one operator, with a single handoff to
              Legacy Publishing at Day 90. Day 180 the book launches into an
              audience that already said yes.
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
        eyebrow="The Legacy JV"
        title="The publishing partner is built in."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-10">
        <FadeIn>
          <div className="max-w-3xl space-y-6 text-base text-neutral-600">
            <p>
              Legacy Publishing is our elite publishing partner. Manuscript
              handoff happens at Day 90. Legacy handles cover, interior layout,
              ARC copies, blurb sourcing, retail distribution, and the publish.
              Legacy takes 10 percent of net book sales as royalty. There is no
              upfront fee to Legacy beyond your $30,000 payment to
              PodcastNetwork.org. Legacy is application-only in its own right,
              and admission to the Pre-Sold Author Package includes admission
              to Legacy for the resulting title.
            </p>
            <div className="rounded-3xl border border-foil/40 bg-foil/10 p-6">
              <p className="text-sm text-neutral-950">
                You own the book rights. Legacy operates on the 10 percent net
                royalty structure with no advance and no upfront fee. Full
                disclosure at{' '}
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
              The DIY path runs 24 to 36 months from first draft to shelf. A
              freelance five-pass edit runs $8,000 to $15,000. Cover and
              interior design runs $3,000 to $7,000. A standalone knowledge
              panel engagement with the industry-standard vendor runs 12 to 24
              months at $30,000 to $80,000. A launch PR retainer runs $8,000 to
              $15,000 per month. Guest-booking services run $3,000 to $7,000
              per month with mixed results. At the low end, that lands north of
              $50,000 in vendor costs, takes two to three years, and produces
              four disconnected deliverables that were never designed to
              compound against each other.
            </p>
            <p>
              Three things compress the clock. The podcast catalog compresses
              discovery: your voice is already on tape, and ghostwriting
              interviews mine it directly. Parallel workstreams remove the
              waiting: entity work starts on day one while the manuscript and
              the pre-sell run concurrently. Entity-first sequencing means
              Google&apos;s indexing clock (the slowest external dependency)
              starts at the earliest possible moment instead of after the book
              ships. One operator holding the through-line is what makes the
              parallelism hold.
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
                Authors with existing signal.
              </h2>
              <p className="mt-5 text-base text-neutral-600">
                Non-fiction authors, 90 to 180+ days before launch, with real
                platform in play: a mailing list of 5,000+, a podcast doing
                25,000+ monthly downloads, a built-in retail channel, or a
                platform in progress with real traction and a clear trajectory.
              </p>
            </div>
            <div>
              <p className="font-display text-sm font-semibold tracking-wider text-foil-dark uppercase">
                Who we turn down
              </p>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-neutral-950">
                Authors starting from zero.
              </h2>
              <p className="mt-5 text-base text-neutral-600">
                We turn down applicants who have not put the reps in on their
                own audience yet. This package takes an author with existing
                signal and produces a coordinated launch machine around that
                signal in six months. It does not build an author from nothing,
                and pretending otherwise would break the cohort for everyone
                else.
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
              Application-only. $30,000. 180 days from Day 1 to book launch.
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
