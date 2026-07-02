import { type Metadata } from 'next'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { GridList, GridListItem } from '@/components/GridList'
import { PageIntro } from '@/components/PageIntro'
import { SectionIntro } from '@/components/SectionIntro'
import { FounderAnchorLive } from '@/components/founders/FounderAnchorLive'
import { FoundersGraphInset } from '@/components/founders/FoundersGraphInset'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { foundersSchema } from '@/lib/schema-graph'

export const metadata: Metadata = {
  title: 'Founders. We ran the method on ourselves first',
  description:
    'Brett K Moore and Mike Partners, co-founders of PodcastNetwork.org. Co-authors of AI or Die, the founder-run case study with live metrics refreshing hourly.',
  alternates: { canonical: '/founders/' },
}

export default function FoundersPage() {
  return (
    <>
      <SchemaGraph schema={foundersSchema()} />

      <PageIntro
        eyebrow="The founders"
        title="We ran the method on ourselves first."
      >
        <p>
          We are Brett K Moore and Mike Partners, co-founders of
          PodcastNetwork.org. Fifty-fifty. That split was locked on day one and
          it has not moved. We co-authored AI or Die, launched it through our
          own sequence, and built the machine that pre-sold it. Then we
          realized the machine was the product.
        </p>
      </PageIntro>

      <Container className="mt-16 sm:mt-20">
        <FadeIn>
          <div className="-mx-6 overflow-hidden sm:mx-0 sm:rounded-4xl">
            <FoundersGraphInset />
          </div>
          <p className="mt-4 text-sm text-neutral-600">
            The founder entity subgraph: Brett, Mike, and every indexed signal
            one hop out. Live from the same data Google reads.
          </p>
        </FadeIn>
      </Container>

      <SectionIntro
        eyebrow="Live proof"
        title="The book. The metrics. The receipt."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-16">
        <FadeIn>
          <FounderAnchorLive showCta={false} />
        </FadeIn>
      </Container>

      <SectionIntro
        eyebrow="Why we built PN.org"
        title="Cold launches are a sequencing failure."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-10">
        <FadeIn>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base text-neutral-600 lg:grid-cols-2">
            <p>
              Most authors launch cold. They write for two to three years, they
              land a publisher, and then the book ships into a market that has
              no idea who they are. The retail stack is weak. The knowledge
              panel is nonexistent. The audience is a mailing list they have
              not tended. The book fades in 90 days.
            </p>
            <p>
              The alternative is not more marketing. More marketing after a
              cold launch does not fix a cold launch. The alternative is a
              coordinated six-month sequence that produces the book, the
              podcast, the knowledge panel, and the pre-sold audience in
              parallel. All four pillars mature together. By the time the book
              lists, the audience has already opted in, the podcast has already
              been running, and Google already knows who the author is.
              PodcastNetwork.org is the operator of that sequence.
            </p>
          </div>
        </FadeIn>
      </Container>

      <SectionIntro
        eyebrow="The organizations"
        title="One operator, three partners."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          PodcastNetwork.org sits in the middle. Authors talk to one operator,
          sign one contract, pay one price, and get four pillars delivered in
          parallel.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <GridList>
          <GridListItem title="AI Expert">
            Sister firm. Builds the AI-native architecture underneath the
            sequence: transcript-to-manuscript pipelines, guest-booking
            sequencing tooling, and the structured-data workflows Google
            indexes fastest. Same two co-founders.
          </GridListItem>
          <GridListItem title="Legacy Publishing">
            Publishing partner. Application-only elite publisher operating at
            10 percent of net book sales with no upfront fee. Every book in the
            package publishes through Legacy under the JV.
          </GridListItem>
          <GridListItem title="Apex Podcast Co">
            Production partner. Ongoing white-glove podcast production after
            Day 180, on a separate retainer, for authors who want the show to
            keep growing. Brett is 50/50 with Randy Highsmith on Apex.
          </GridListItem>
        </GridList>
      </Container>

      <ContactSection />
    </>
  )
}
