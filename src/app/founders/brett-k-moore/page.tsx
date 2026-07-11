import { type Metadata } from 'next'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { brettProfileSchema } from '@/lib/schema-graph'

export const metadata: Metadata = {
  title: 'Brett K Moore. Co-founder and CEO of PodcastNetwork.org',
  description:
    'Brett K Moore is the co-founder and CEO of PodcastNetwork.org, co-author of AI or Die, and a multi-business operator building entity visibility infrastructure for executives and authors.',
  alternates: { canonical: '/founders/brett-k-moore/' },
}

export default function BrettPage() {
  return (
    <>
      <SchemaGraph schema={brettProfileSchema()} />

      <PageIntro
        eyebrow="Co-founder + CEO"
        title="Brett K Moore"
      >
        <p>
          Co-founder and CEO of PodcastNetwork.org. Co-author of{' '}
          <em>AI or Die</em>. Multi-business operator based in Indianapolis
          running a portfolio of companies across AI consulting, podcast
          production, book publishing, and entity visibility.
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
              PodcastNetwork.org was built to fix that gap. The company installs
              the structured data, Knowledge Panel signals, and entity
              infrastructure that makes Google and AI engines recognize a person
              as a real entity. Two packages do the work: the Brand SERP Build
              (focused on Knowledge Panel acquisition and maintenance) and the
              Pre-Sold Author Package (a 180-day build that produces a book, a
              podcast, and the full entity layer in parallel so the audience is
              already there when the book ships).
            </p>

            <p>
              Brett and Mike tested the method on themselves first. They
              co-authored <em>AI or Die</em>, ran it through their own
              Pre-Sold Author sequence, and used it as the live proof that the
              system works. The book was not just a product. It was the case
              study. Every metric, every Knowledge Graph entry, every Wikidata
              record was seeded using the same process clients go through.
            </p>

            <p>
              Outside of PodcastNetwork.org, Brett operates several businesses.
              AI Expert is the sister firm that builds the AI-native
              architecture underneath the sequence: transcript-to-manuscript
              pipelines, guest-booking tooling, and the structured-data
              workflows that Google indexes fastest. Apex Podcast Co handles
              ongoing white-glove podcast production after the initial build,
              run as a 50/50 partnership with Randy Highsmith. Legacy
              Publishing is the application-only publisher that can take books
              produced through the Pre-Sold Author Package to market at 10
              percent of net book sales with no upfront fee.
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
              Mike Partners, Co-founder <span aria-hidden="true">&rarr;</span>
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
