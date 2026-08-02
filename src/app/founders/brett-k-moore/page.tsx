import { type Metadata } from 'next'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { brettProfileSchema } from '@/lib/schema-graph'

export const metadata: Metadata = {
  title: 'Brett K. Moore. Co-Founder and CEO of PodcastNetwork.org',
  description:
    'Brett K. Moore is the Co-Founder and CEO of PodcastNetwork.org, the network and relationship-engine infrastructure behind his portfolio of businesses.',
  alternates: { canonical: '/founders/brett-k-moore/' },
}

export default function BrettPage() {
  return (
    <>
      <SchemaGraph schema={brettProfileSchema()} />

      <PageIntro
        eyebrow="Co-Founder and CEO, PodcastNetwork.org"
        title="Brett K. Moore"
      >
        <p>
          Co-Founder and CEO of PodcastNetwork.org. Co-author of{' '}
          <em>AI or Die</em>. Multi-business operator based in Indianapolis
          running a portfolio of companies across AI consulting and podcast
          production.
        </p>
      </PageIntro>

      <Container className="mt-16 sm:mt-24">
        <FadeIn>
          <div className="max-w-3xl text-base text-neutral-600 [&>p+p]:mt-6">
            <p>
              Brett started his career building networks between operators and
              the audiences they needed to reach. Fifteen years of that work
              taught him one thing: the people who win are the ones who show up
              in the right place before the conversation starts. Not after.
              Before. That insight became the foundation for everything
              PodcastNetwork.org does today.
            </p>

            <p>
              In 2024, Brett and Mike Partners launched PodcastNetwork.org as a
              fifty-fifty partnership. The original thesis was simple. Most
              executives, authors, and entrepreneurs have real expertise but
              zero digital footprint where it counts. Google does not recognize
              them. AI answer engines return nothing when someone asks about
              them. And every deal, every reference check, every meeting prep
              starts with a search. If you are invisible in that moment, you
              lose before you walk into the room.
            </p>

            <p>
              PodcastNetwork.org is what came out of that. It designs, builds,
              and operates private podcast networks, plus the relationship
              engine that sits underneath them. Shows, guests, bookings, and
              introductions run through one system, and the network compounds
              as more of them do.
            </p>

            <p>
              Outside of PodcastNetwork.org, Brett operates several businesses.
              AI Expert is the sister firm that builds the AI-native
              architecture underneath the network: guest-booking and outreach
              tooling, and the structured data workflows the search and answer
              engines read. Apex Podcast Co handles ongoing white-glove podcast
              production, run as a 50/50 partnership with Randy Highsmith.
            </p>

            <p>
              Brett runs all of this from Indianapolis with a small, focused
              team. No layers of account managers. No handoffs between
              departments. One operator, one method, and a stack of AI tools
              that make the whole thing move faster than any traditional agency
              could.
            </p>

            <p className="font-semibold text-neutral-950">
              Connect with Brett
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/in/brettkmoore"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/brettkmoore"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  X
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/brettkmoore"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@brettkmoore"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.threads.net/@brettkmoore"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  Threads
                </a>
              </li>
              <li>
                <a
                  href="https://brettkmoore.com"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  brettkmoore.com
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/founders/mike-partners/"
              className="text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
            >
              Mike Partners, Co-Founder and CAIO{' '}
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/founders/"
              className="text-sm font-semibold text-neutral-600 transition hover:text-neutral-950"
            >
              All founders <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </FadeIn>
      </Container>

      <ContactSection />
    </>
  )
}
