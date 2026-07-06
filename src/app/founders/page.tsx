import { type Metadata } from 'next'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { GridList, GridListItem } from '@/components/GridList'
import { PageIntro } from '@/components/PageIntro'
import { SectionIntro } from '@/components/SectionIntro'
import { FoundersGraphInset } from '@/components/founders/FoundersGraphInset'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { foundersSchema } from '@/lib/schema-graph'
import foundersData from '../../../data/founders.json'

export const metadata: Metadata = {
  title: 'Founders. We ran the method on ourselves first',
  description:
    'Brett K. Moore and Mike Partners, co-founders of PodcastNetwork.org. Co-authors of AI or Die. The entity visibility method tested on themselves before anyone else.',
  alternates: { canonical: '/founders/' },
}

export default function FoundersPage() {
  const brett = foundersData['brett-k-moore']
  const mike = foundersData['mike-partners']

  return (
    <>
      <SchemaGraph schema={foundersSchema()} />

      <PageIntro
        eyebrow="The founders"
        title="We ran the method on ourselves first."
      >
        <p>
          We are Brett K. Moore and Mike Partners, co-founders of
          PodcastNetwork.org. Fifty-fifty. That split was locked on day one and
          it has not moved. We co-authored AI or Die, launched it through our
          own sequence, and built the machine that pre-sold it. Then we
          realized the machine was the product.
        </p>
      </PageIntro>

      <Container className="mt-16 sm:mt-20">
        <FadeIn>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {[brett, mike].map((founder) => (
              <Link
                key={founder.id}
                href={`/founders/${founder.id}/`}
                className="group rounded-3xl bg-neutral-50 p-8 ring-1 ring-neutral-950/5 transition hover:bg-neutral-100"
              >
                <p className="font-display text-xl font-semibold text-neutral-950">
                  {founder.name}
                </p>
                <p className="mt-1 text-sm font-semibold text-neutral-600">
                  {founder.role}
                </p>
                <p className="mt-4 text-base text-neutral-600">
                  {founder.bio}
                </p>
                <p className="mt-4 text-sm font-semibold text-neutral-950 transition group-hover:text-neutral-700">
                  Full profile <span aria-hidden="true">&rarr;</span>
                </p>
              </Link>
            ))}
          </div>
        </FadeIn>
      </Container>

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
              The alternative is more coordination, earlier. A build that
              produces the book, the podcast, the voice clone, and the entity
              visibility in parallel, so they mature together. By the time the
              book lists, the audience has already opted in, the podcast has
              already been running, and Google already recognizes the author.
              That is the Pre-Sold Author Package. Making Google recognize you
              in the first place, and keeping it accurate for a year, is the
              Brand SERP Build. PodcastNetwork.org runs both.
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
          PodcastNetwork.org sits in the middle. You talk to one operator, pick
          the package that fits, and get it delivered by one team.
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
            Publishing partner. Application-only publisher operating at
            10 percent of net book sales with no upfront fee. Books produced in
            the Pre-Sold Author Package can publish through Legacy as an option.
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
