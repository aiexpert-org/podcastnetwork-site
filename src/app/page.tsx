import { type Metadata } from 'next'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { GridList, GridListItem } from '@/components/GridList'
import { PageIntro } from '@/components/PageIntro'
import { SectionIntro } from '@/components/SectionIntro'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { homeSchema } from '@/lib/schema-graph'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'PodcastNetwork.org. Network and relationship-engine infrastructure',
  description:
    "The network and relationship-engine infrastructure behind Brett K. Moore's shows and brands. PodcastNetwork.org does not sell directly.",
  alternates: { canonical: '/' },
}

/* Positioning section. PodcastNetwork.org is infrastructure for the rest
 * of the portfolio, so this page states what it is and stops there. */
function WhatThisIs() {
  return (
    <div id="what-this-is" className="scroll-mt-24">
      <SectionIntro
        title="What this is"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          PodcastNetwork.org designs, builds, and operates private podcast
          networks, plus the relationship engine that sits underneath them. It
          is co-founded by Brett K. Moore (Co-Founder and CEO) and Mike
          Partners (Co-Founder and CAIO). The network compounds over time.
          Every show, every guest, and every introduction adds to it, and the
          rest of the portfolio draws on that infrastructure instead of
          building its own from scratch.
        </p>
      </SectionIntro>
    </div>
  )
}

/* Where the actual client work lives. Both destinations are sibling
 * businesses, so these are plain outbound links. */
function WhereTheWorkLives() {
  return (
    <div id="elsewhere" className="scroll-mt-24">
      <SectionIntro
        title="Looking to work with Brett?"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          PodcastNetwork.org does not sell directly. If you are looking for
          AI-native services, that work lives at AgentSphere. If you are
          looking for book development, that work now lives at PodcastAuthor.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <GridList>
          <GridListItem title="AgentSphere">
            AI-native services.{' '}
            <a
              href="https://agntsphere.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
            >
              agntsphere.com
            </a>
          </GridListItem>
          <GridListItem title="PodcastAuthor">
            Book development.{' '}
            <a
              href="https://podcastauthor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
            >
              podcastauthor.com
            </a>
          </GridListItem>
        </GridList>
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
              Brett K. Moore. Co-Founder and CEO.
            </p>
            <p className="mt-1 text-base font-semibold text-neutral-950">
              Mike Partners. Co-Founder and CAIO.
            </p>
            <p className="mt-4 max-w-2xl text-base text-neutral-600">
              We built PodcastNetwork.org to run the shows and the
              relationship engine underneath them.
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

      {/* Section 1: positioning. */}
      <PageIntro
        eyebrow="NETWORK INFRASTRUCTURE"
        title="PodcastNetwork.org runs the network. It does not sell one."
      >
        <p>
          This is the relationship engine and show infrastructure behind Brett
          K. Moore&apos;s portfolio. It powers the podcast work inside
          AgentSphere and the tour work inside PodcastAuthor. There is nothing
          for sale on this page.
        </p>
      </PageIntro>

      {/* Section 2: what this is */}
      <WhatThisIs />

      {/* Section 3: where the client work lives */}
      <WhereTheWorkLives />

      {/* Section 4: founders teaser */}
      <FoundersTeaser />

      {/* Section 5: terminal contact block */}
      <div id="apply-cta" className="scroll-mt-24">
        <ContactSection />
      </div>
    </>
  )
}
