import { type Metadata } from 'next'

import { Border } from '@/components/Border'
import { Button } from '@/components/Button'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { SectionIntro } from '@/components/SectionIntro'
import { FAQBlock } from '@/components/ui/FAQBlock'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { faqItemsForUi, knowledgePanelSchema } from '@/lib/schema-graph'
import { KNOWLEDGE_PANEL_INSTALL } from '@/content/packages'

export const metadata: Metadata = {
  title: 'The Knowledge Panel Install. $10,000, 12 months',
  description:
    'A twelve-month build that makes Google and the AI answer engines recognize you as a real entity. Knowledge Panel, Wikipedia and Wikidata, podcast, press, and a year of monthly verification. Application only.',
  alternates: { canonical: '/knowledge-panel-install/' },
}

const KP = KNOWLEDGE_PANEL_INSTALL

const INCLUDED = [
  {
    title: 'The Knowledge Panel',
    body: 'A Google Knowledge Panel with its full qualifying signal set: the schema stack, a Wikidata Q-number, a Wikipedia submission attempt, and first-page ownership of your brand search. This is the piece most people mean when they say they want Google to take them seriously.',
  },
  {
    title: 'The AI Answer Engines',
    body: 'Coverage across the major AI assistants people now ask instead of Google, with monthly testing across the full year. Forty-eight tests over twelve months confirm the answer engines describe you accurately and consistently, and flag drift the moment it appears.',
  },
  {
    title: 'The Podcast and IMDb',
    body: 'A podcast with three episodes you record, launched and produced for you, which earns your IMDb Person page through the podcast credit. Setup, branding, hosting, and distribution are handled for you.',
  },
  {
    title: 'The Signal Set',
    body: 'A placed article on an industry-relevant publication, five press releases distributed, three podcast guest placements on shows doing 10,000+ monthly downloads, social handle consistency, and search cleanup. The signals Google reads when it decides whether you are a real, notable entity.',
  },
  {
    title: 'The Year of Reporting',
    body: 'Twelve monthly executive reports, four quarterly Knowledge Panel verifications, and ongoing monitoring infrastructure. Building the panel is the start. Keeping it accurate and defended for a full year is the rest.',
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
    body: 'Contract and payment finalize within two weeks. Kickoff typically lands three to four weeks after application. Day 1 starts the twelve-month clock.',
  },
]

export default function KnowledgePanelInstallPage() {
  const faq = faqItemsForUi([
    'what-does-knowledge-panel-install-cover',
    'twelve-months-not-24',
    'knowledge-panel-mechanics',
    'no-podcast-yet',
    'optional-podcast-setup',
    'both-packages-together',
    'is-this-just-for-real-estate',
    'payment-terms',
    'refund',
    'knowledge-panel-versus-diy',
    'application-timeline',
  ])

  return (
    <>
      <SchemaGraph schema={knowledgePanelSchema()} />

      <PageIntro
        eyebrow="The Knowledge Panel Install"
        title="Make Google recognize you as a real entity, and keep proving it for a year."
      >
        <p>
          One package. One price. {KP.priceDisplay}. Twelve months. Application
          only. A Google Knowledge Panel, coverage across the AI answer engines,
          a Wikipedia and Wikidata attempt, a launched podcast, and a full year
          of monthly verification and reporting.
        </p>
        <div className="mt-8 flex">
          <Button href="/apply">Start your application</Button>
        </div>
      </PageIntro>

      <SectionIntro
        eyebrow="What it is"
        title="An identity Google can read."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-10">
        <FadeIn>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base text-neutral-600 lg:grid-cols-2">
            <p>
              A Knowledge Panel is the box Google shows when it is confident it
              knows who you are. It only appears once Google has enough
              structured, corroborated signal to treat you as a notable entity.
              The Knowledge Panel Install builds that signal set on purpose: the
              schema stack, a Wikidata entry, a Wikipedia attempt, a podcast, an
              IMDb page, press, and clean search results, all pointing at one
              consistent identity.
            </p>
            <p>
              The same signals feed the AI answer engines people now ask instead
              of Google. When someone asks an assistant who you are, the answer
              is only as good as the entity data behind it. This build sets that
              data up and then tests it every month for a year, so the panel and
              the answers stay accurate long after the work is done.
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
        title="The full twenty-two."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          {KP.priceDisplay} over {KP.timelineDisplay}. Time investment is{' '}
          {KP.timeInvestment.toLowerCase()}
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeIn>
          <ul
            role="list"
            className="grid max-w-4xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2"
          >
            {KP.deliverables.map((d) => (
              <li key={d} className="flex gap-3 text-base text-neutral-600">
                <span aria-hidden="true" className="mt-1 text-foil-dark">
                  &#8226;
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
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
                Anyone who wants Google to know them.
              </h2>
              <p className="mt-5 text-base text-neutral-600">
                Executives, authors, entrepreneurs, and professionals who want a
                formal, Google-recognized personal brand. You do not need a book
                and you do not need an existing audience. You need to be someone
                worth recognizing and willing to record three podcast episodes.
              </p>
            </div>
            <div>
              <p className="font-display text-sm font-semibold tracking-wider text-foil-dark uppercase">
                What we are honest about
              </p>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-neutral-950">
                Wikipedia is an attempt, not a promise.
              </h2>
              <p className="mt-5 text-base text-neutral-600">
                Wikipedia has its own editors and its own notability bar that no
                vendor controls. We make a strong submission attempt and one
                resubmission if the first does not land. The Knowledge Panel,
                Wikidata, schema, and answer-engine work do not depend on
                Wikipedia accepting the article.
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
              Application only. {KP.priceDisplay}. Twelve months from Day 1.
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
