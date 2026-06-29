import { type Metadata } from 'next'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { HeroMosaicBackground } from '@/components/HeroMosaic'

export const metadata: Metadata = {
  description:
    'Done-for-you personal brand infrastructure. Google Knowledge Panel, Wikipedia, press features, podcast bookings, and the full digital footprint that makes authors and executives recognizable online.',
}

const services = [
  {
    label: 'Search',
    title: 'Google Knowledge Panel',
    body: 'We build and verify the authoritative panel that surfaces next to your name in Google search results. This is the guaranteed deliverable in every engagement.',
  },
  {
    label: 'Reference',
    title: 'Wikipedia & Wikidata',
    body: 'We research, draft, and submit your Wikipedia author page and Wikidata entry so the encyclopedic record reflects who you actually are.',
  },
  {
    label: 'Credits',
    title: 'IMDB Profile',
    body: 'If you have appeared on screen, on stage, or in a podcast that qualifies, we build and verify the IMDB page so the credits trail back to you.',
  },
  {
    label: 'Home base',
    title: 'Author Website + Schema',
    body: 'We ship a personal-brand home page, or we add the structured-data markup to your existing site so Google can read who you are without guessing.',
  },
  {
    label: 'Press',
    title: 'Press & Media Features',
    body: 'We pitch your story to journalists at publications your readers actually read. Earned coverage, not paid placement.',
  },
  {
    label: 'Distribution',
    title: 'Podcast Bookings',
    body: 'We book you on the shows where your buyer is already listening. Pre-qualified audiences, real conversations, durable URLs you can point press to.',
  },
  {
    label: 'Social proof',
    title: 'Reviews & Reputation',
    body: 'We drive authentic reviews on Amazon, Goodreads, and the channels that matter for your category. The signal that turns a Google search into a buy decision.',
  },
  {
    label: 'Strategy',
    title: 'Personal Brand Strategy',
    body: 'Before anything ships, we lock your positioning, the story, and the audience. Every piece of infrastructure points the same direction.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Brand Audit and Onboarding',
    body: 'We map your current digital footprint, name the gaps, and write a custom rollout plan for your launch.',
  },
  {
    n: '02',
    title: 'Build the Foundation',
    body: 'Website, Schema markup, Knowledge Panel, Wikipedia submission, IMDB, Wikidata. The authoritative infrastructure, built right the first time.',
  },
  {
    n: '03',
    title: 'Pitch, Place, Amplify',
    body: 'Our team pitches press, books podcasts, and drives reviews. Third-party validation Google and readers actually trust.',
  },
  {
    n: '04',
    title: 'Ongoing Optimization',
    body: 'We monitor your presence, update your profiles, and keep adding to it. Personal brand authority compounds when you keep feeding it.',
  },
]

const without = [
  'No Google Knowledge Panel',
  'No Wikipedia page',
  'Scattered or no press coverage',
  'Zero podcast presence',
  'Missing from IMDB and Wikidata',
  'Website with no Schema markup',
  'Few or no credible reviews',
]

const withUs = [
  'Verified Google Knowledge Panel',
  'Wikipedia and Wikidata presence',
  'Earned press features and media mentions',
  'Booked on relevant podcasts',
  'IMDB profile established',
  'Schema-optimized author website',
  'Authentic reviews that build trust',
]

const payInFull = [
  'Complete brand audit and strategy',
  'Google Knowledge Panel (guaranteed)',
  'Wikipedia and Wikidata submission',
  'IMDB profile setup',
  'Author website or Schema markup',
  'Press pitching and media placement',
  'Podcast booking campaign',
  'Review generation campaign',
  '12 months of brand monitoring',
]

const monthly = [
  'Everything in Pay in Full',
  'Spread the investment over 12 months',
  'Month-by-month progress reports',
  'Direct access to your brand manager',
  'Flexible start date',
]

function Hero() {
  return (
    <div className="relative">
      <HeroMosaicBackground />
      <Container className="relative mt-24 sm:mt-32 lg:mt-40">
        <FadeIn className="max-w-3xl">
          <p className="font-display text-sm font-semibold tracking-wider text-neutral-700 uppercase">
            PodcastNetwork.org. Personal brand infrastructure.
          </p>
          <h1 className="mt-6 font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-7xl">
            Done-For-You Personal Brand Launch
          </h1>
          <p className="mt-6 font-display text-2xl text-neutral-800 sm:text-3xl">
            When someone Googles your name, every result should already be
            in your favor.
          </p>
          <p className="mt-6 max-w-2xl text-xl text-neutral-700">
            We build the full digital presence: Google Knowledge Panel,
            Wikipedia, IMDB, press features, podcast bookings, and the author
            website that ties it all together. Done for you, by our team.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#apply"
              className="inline-flex items-center rounded-full bg-[var(--color-cta)] px-6 py-3 text-base font-semibold text-[var(--color-cta-ink)] transition hover:bg-[var(--color-cta-hover)]"
            >
              Launch My Personal Brand
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center rounded-full bg-neutral-950 px-6 py-3 text-base font-semibold text-white transition hover:bg-neutral-800"
            >
              See What is Included
            </Link>
          </div>
        </FadeIn>
      </Container>
      <div className="h-24 sm:h-32" />
    </div>
  )
}

function Problem() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40" id="problem">
      <FadeIn className="max-w-3xl">
        <p className="font-display text-sm font-semibold tracking-wider text-neutral-700 uppercase">
          The Problem
        </p>
        <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-neutral-950 sm:text-5xl">
          Great authors and executives are invisible online.
        </h2>
        <p className="mt-6 text-lg text-neutral-700">
          You have done the work. You wrote the book, ran the company,
          accumulated the expertise. But when a journalist, a podcast host, or
          a prospect Googles your name, nothing comes up. That gap is the
          problem we exist to fix.
        </p>
      </FadeIn>
      <FadeInStagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:gap-12">
        <FadeIn>
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10">
            <p className="font-display text-sm font-semibold tracking-wider text-neutral-500 uppercase">
              Without Us
            </p>
            <ul role="list" className="mt-6 space-y-3 text-neutral-700">
              {without.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-neutral-400">
                    ×
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
        <FadeIn>
          <div className="rounded-3xl border border-neutral-950 bg-neutral-950 p-8 text-white sm:p-10">
            <p className="font-display text-sm font-semibold tracking-wider text-[var(--color-brand-yellow)] uppercase">
              With Us
            </p>
            <ul role="list" className="mt-6 space-y-3 text-neutral-200">
              {withUs.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="text-[var(--color-brand-yellow)]"
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </FadeInStagger>
    </Container>
  )
}

function Services() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40" id="services">
      <FadeIn className="max-w-3xl">
        <p className="font-display text-sm font-semibold tracking-wider text-neutral-700 uppercase">
          Your Digital Footprint
        </p>
        <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-neutral-950 sm:text-5xl">
          Everything you need to be recognized as an authority.
        </h2>
        <p className="mt-6 text-lg text-neutral-700">
          We do not just get you press. We build the entire infrastructure of
          personal brand legitimacy.
        </p>
        <p className="mt-4 inline-flex rounded-full bg-[var(--color-cta)] px-4 py-1 text-sm font-semibold text-[var(--color-cta-ink)]">
          Knowledge Panel guaranteed
        </p>
      </FadeIn>
      <FadeInStagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <FadeIn key={s.title}>
            <div className="h-full rounded-3xl border border-neutral-200 bg-white p-6">
              <p className="font-display text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                {s.label}
              </p>
              <h3 className="mt-4 font-display text-lg font-semibold text-neutral-950">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-neutral-700">{s.body}</p>
            </div>
          </FadeIn>
        ))}
      </FadeInStagger>
      <FadeIn className="mt-10 max-w-3xl">
        <p className="text-sm text-neutral-600">
          We guarantee your Google Knowledge Panel. Every other placement is
          actively pursued. Results vary by author platform and timeline.
        </p>
      </FadeIn>
    </Container>
  )
}

function HowItWorks() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40" id="how-it-works">
      <FadeIn className="max-w-3xl">
        <p className="font-display text-sm font-semibold tracking-wider text-neutral-700 uppercase">
          How It Works
        </p>
        <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-neutral-950 sm:text-5xl">
          From invisible to undeniable.
        </h2>
      </FadeIn>
      <FadeInStagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <FadeIn key={step.n}>
            <div className="h-full rounded-3xl border border-neutral-200 bg-white p-6">
              <p className="font-display text-sm font-semibold tracking-wider text-neutral-700 uppercase">
                Step {step.n}
              </p>
              <h3 className="mt-4 font-display text-xl font-semibold text-neutral-950">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-neutral-700">{step.body}</p>
            </div>
          </FadeIn>
        ))}
      </FadeInStagger>
    </Container>
  )
}

function Pricing() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40" id="pricing">
      <FadeIn className="max-w-3xl">
        <p className="font-display text-sm font-semibold tracking-wider text-neutral-700 uppercase">
          Investment
        </p>
        <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-neutral-950 sm:text-5xl">
          One package. Total authority.
        </h2>
        <p className="mt-6 text-lg text-neutral-700">
          Everything we do is included. No menu, no hidden fees. One scope,
          two ways to pay.
        </p>
      </FadeIn>
      <FadeInStagger className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <FadeIn>
          <div className="h-full rounded-3xl border border-neutral-950 bg-neutral-950 p-8 text-white sm:p-10">
            <p className="font-display text-sm font-semibold tracking-wider text-[var(--color-brand-yellow)] uppercase">
              Pay in Full
            </p>
            <p className="mt-4 font-display text-6xl font-medium tracking-tight text-white">
              $10,000
            </p>
            <p className="mt-2 text-sm text-neutral-300">
              One-time payment. Best value.
            </p>
            <ul role="list" className="mt-8 space-y-3 text-neutral-200">
              {payInFull.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="text-[var(--color-brand-yellow)]"
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="#apply"
                className="inline-flex items-center rounded-full bg-[var(--color-cta)] px-6 py-3 text-base font-semibold text-[var(--color-cta-ink)] transition hover:bg-[var(--color-cta-hover)]"
              >
                Get Started
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
            </div>
          </div>
        </FadeIn>
        <FadeIn>
          <div className="h-full rounded-3xl border border-neutral-200 bg-white p-8 sm:p-10">
            <p className="font-display text-sm font-semibold tracking-wider text-neutral-700 uppercase">
              Monthly Plan
            </p>
            <p className="mt-4 font-display text-6xl font-medium tracking-tight text-neutral-950">
              $847
              <span className="text-2xl text-neutral-500">/mo</span>
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              12-month commitment. Same deliverables.
            </p>
            <ul role="list" className="mt-8 space-y-3 text-neutral-700">
              {monthly.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-neutral-950">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="#apply"
                className="inline-flex items-center rounded-full bg-neutral-950 px-6 py-3 text-base font-semibold text-white transition hover:bg-neutral-800"
              >
                Get Started
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
            </div>
          </div>
        </FadeIn>
      </FadeInStagger>
      <FadeIn className="mt-10 max-w-3xl">
        <p className="text-sm text-neutral-600">
          Not sure which option fits? Fill out the form below and we will
          discuss on a call.
        </p>
      </FadeIn>
    </Container>
  )
}

function Apply() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40" id="apply">
      <FadeIn className="max-w-3xl">
        <p className="font-display text-sm font-semibold tracking-wider text-neutral-700 uppercase">
          Get Started
        </p>
        <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-neutral-950 sm:text-5xl">
          Ready to launch your personal brand?
        </h2>
        <p className="mt-6 text-lg text-neutral-700">
          Tell us about yourself and your book or business. We will review
          your current digital presence and reach out to discuss your custom
          launch plan.
        </p>
      </FadeIn>
      <FadeIn className="mt-16 max-w-2xl">
        <form className="space-y-6">
          <label className="block">
            <span className="block font-display text-sm font-semibold tracking-wider text-neutral-950">
              Full Name *
            </span>
            <input
              type="text"
              name="name"
              required
              className="mt-2 block w-full rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-base text-neutral-950 transition focus:border-neutral-950 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="block font-display text-sm font-semibold tracking-wider text-neutral-950">
              Email *
            </span>
            <input
              type="email"
              name="email"
              required
              className="mt-2 block w-full rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-base text-neutral-950 transition focus:border-neutral-950 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="block font-display text-sm font-semibold tracking-wider text-neutral-950">
              Phone (optional)
            </span>
            <input
              type="tel"
              name="phone"
              className="mt-2 block w-full rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-base text-neutral-950 transition focus:border-neutral-950 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="block font-display text-sm font-semibold tracking-wider text-neutral-950">
              Tell us about your book and background *
            </span>
            <textarea
              name="background"
              required
              rows={5}
              className="mt-2 block w-full rounded-2xl border border-neutral-300 bg-transparent px-4 py-3 text-base text-neutral-950 transition focus:border-neutral-950 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-[var(--color-cta)] px-6 py-3 text-base font-semibold text-[var(--color-cta-ink)] transition hover:bg-[var(--color-cta-hover)]"
          >
            Launch My Personal Brand
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </button>
          <p className="text-sm text-neutral-600">
            No commitment. We will reach out within one business day.
          </p>
        </form>
      </FadeIn>
    </Container>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Services />
      <HowItWorks />
      <Pricing />
      <Apply />
    </>
  )
}
