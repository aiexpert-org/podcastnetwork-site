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
  title: 'Founders of PodcastNetwork.org',
  description:
    'Brett K. Moore (Co-Founder and CEO) and Mike Partners (Co-Founder and CAIO) run PodcastNetwork.org, the network and relationship-engine infrastructure behind the portfolio.',
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
        title="Two operators and one network."
      >
        <p>
          We are Brett K. Moore (Co-Founder and CEO) and Mike Partners
          (Co-Founder and CAIO). Fifty-fifty. That split was locked on day one
          and it has not moved. We run PodcastNetwork.org, the network and
          relationship-engine infrastructure the rest of the portfolio draws
          on.
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
        title="Every business we run needs the same infrastructure."
        className="mt-24 sm:mt-32 lg:mt-40"
      />
      <Container className="mt-10">
        <FadeIn>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base text-neutral-600 lg:grid-cols-2">
            <p>
              PodcastNetwork.org designs, builds, and operates private podcast
              networks, plus the relationship engine that sits underneath them.
              Shows, guests, bookings, and introductions all run through one
              system instead of a separate one per company.
            </p>
            <p>
              The network compounds over time. Every show, every guest, and
              every introduction adds to it, and the rest of the portfolio
              draws on that infrastructure instead of building its own from
              scratch.
            </p>
          </div>
        </FadeIn>
      </Container>

      <SectionIntro
        eyebrow="The organizations"
        title="One operator, two partners."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          PodcastNetwork.org sits in the middle of the portfolio and runs the
          shared infrastructure the other companies use.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <GridList>
          <GridListItem title="AI Expert">
            Sister firm. Builds the AI-native architecture underneath the
            network: guest-booking and outreach tooling, and the structured
            data workflows the search and answer engines read. Same two
            co-founders.
          </GridListItem>
          <GridListItem title="Apex Podcast Co">
            Production partner. Ongoing white-glove podcast production for
            shows in the network. Brett is 50/50 with Randy Highsmith on Apex.
          </GridListItem>
        </GridList>
      </Container>

      <ContactSection />
    </>
  )
}
