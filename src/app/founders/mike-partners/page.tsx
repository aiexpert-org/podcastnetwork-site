import { type Metadata } from 'next'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { mikeProfileSchema } from '@/lib/schema-graph'

export const metadata: Metadata = {
  title: 'Mike Partners. Co-founder and Chief AI Officer of PodcastNetwork.org',
  description:
    'Mike Partners is the co-founder and Chief AI Officer of PodcastNetwork.org, co-author of AI or Die, and author of The Book on How to Write a Book. He builds the AI tooling and outreach systems that power the entity visibility method.',
  alternates: { canonical: '/founders/mike-partners/' },
}

export default function MikePage() {
  return (
    <>
      <SchemaGraph schema={mikeProfileSchema()} />

      <PageIntro
        eyebrow="Co-founder + Chief AI Officer"
        title="Mike Partners"
      >
        <p>
          Co-founder and Chief AI Officer of PodcastNetwork.org. Co-author of{' '}
          <em>AI or Die</em>. Author of{' '}
          <em>The Book on How to Write a Book</em>. Career operator turned
          author who builds the AI tooling and outreach systems that power the
          entity visibility method.
        </p>
      </PageIntro>

      <Container className="mt-16 sm:mt-24">
        <FadeIn>
          <div className="max-w-3xl text-base text-neutral-600 [&>p+p]:mt-6">
            <p>
              Mike came to PodcastNetwork.org from the operator side. Before
              co-founding the company with Brett, he spent years building and
              running systems across multiple businesses. Not marketing systems.
              Operational ones. The kind that move data between tools, trigger
              sequences without human babysitting, and keep a small team
              punching above its weight. That background shaped everything about
              how PodcastNetwork.org actually works under the hood.
            </p>

            <p>
              When Brett and Mike started PodcastNetwork.org in 2024, Mike took
              the Chief AI Officer role because the company needed someone who
              could build the machine, not just describe it. The entity
              visibility method requires a stack of interconnected systems:
              cold outreach engineering, AI-driven transcript-to-manuscript
              pipelines, structured data workflows, Wikidata seeding sequences,
              and multi-LLM orchestration that ties all of it together. Mike
              designed and built that stack.
            </p>

            <p>
              Mike is also the operational anchor across Brett&apos;s joint
              companies. He runs the AI tooling and outreach surface across
              Create Church Media, PodcastNetwork.org, Legacy Publishing, and
              AI Expert. That cross-company view means every improvement Mike
              makes to one system ripples across all of them. A faster outreach
              sequence built for one client becomes the default for the next
              cohort. A better transcript pipeline built for AI Expert becomes
              the production baseline at PodcastNetwork.org.
            </p>

            <p>
              Before <em>AI or Die</em>, Mike wrote{' '}
              <em>The Book on How to Write a Book</em>. That project taught
              him the publishing process from the inside. When it came time to
              design the Pre-Sold Author Package, Mike already knew where
              traditional publishing breaks down: the gap between finishing a
              manuscript and having anyone care that it exists. The Pre-Sold
              Author sequence was designed to close that gap by building the
              audience, the podcast, and the entity layer in parallel with the
              book itself.
            </p>

            <p>
              <em>AI or Die</em> was the proof run. Mike and Brett co-authored
              it, launched it through their own Pre-Sold Author sequence, and
              used every metric as the live case study. The book was not a side
              project. It was the test that proved the method works under real
              conditions, with real timelines, and real stakes.
            </p>

            <p>
              Mike operates from a simple principle: if the system cannot run
              without constant human intervention, the system is not done yet.
              Every workflow at PodcastNetwork.org is built to that standard.
              Airtable systems, GHL automation, multi-LLM operations, cold
              outreach engineering. All of it is designed to move faster than
              any traditional agency staffing model could support.
            </p>

            <p className="font-semibold text-neutral-950">
              Connect with Mike
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/in/mikepartners/"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/mikepartners"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/mikepartners"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@mike.partners"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://mike.partners"
                  className="text-neutral-950 underline decoration-neutral-950/30 transition hover:decoration-neutral-950"
                  rel="me noopener"
                  target="_blank"
                >
                  mike.partners
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/founders/brett-k-moore/"
              className="text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
            >
              Brett K Moore, Co-founder <span aria-hidden="true">&rarr;</span>
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
