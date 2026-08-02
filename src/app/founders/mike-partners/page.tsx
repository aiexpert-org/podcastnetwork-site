import { type Metadata } from 'next'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { mikeProfileSchema } from '@/lib/schema-graph'

export const metadata: Metadata = {
  title: 'Mike Partners. Co-Founder and CAIO of PodcastNetwork.org',
  description:
    'Mike Partners is the Co-Founder and CAIO of PodcastNetwork.org. He builds the AI tooling and outreach systems that run underneath the network.',
  alternates: { canonical: '/founders/mike-partners/' },
}

export default function MikePage() {
  return (
    <>
      <SchemaGraph schema={mikeProfileSchema()} />

      <PageIntro
        eyebrow="Co-Founder and CAIO, PodcastNetwork.org"
        title="Mike Partners"
      >
        <p>
          Co-Founder and CAIO of PodcastNetwork.org. Co-author of{' '}
          <em>AI or Die</em>. Career operator turned author who builds the AI
          tooling and outreach systems that run underneath the network.
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
              the CAIO role because the company needed someone who could build
              the machine. Running a network takes a stack of interconnected
              systems: outreach engineering, guest and booking pipelines,
              structured data workflows, and the multi-LLM orchestration that
              ties all of it together. Mike designed and built that stack.
            </p>

            <p>
              Mike is also the operational anchor across Brett&apos;s joint
              companies. He runs the AI tooling and outreach surface across
              Create Church Media, PodcastNetwork.org, and AI Expert. That
              cross-company view means every improvement Mike makes to one
              system ripples across all of them. A faster outreach sequence
              built for one show becomes the default for the next one.
            </p>

            <p>
              Mike is also a published author. He wrote{' '}
              <em>The Book on How to Write a Book</em> and co-authored{' '}
              <em>AI or Die</em> with Brett.
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
              Brett K. Moore, Co-Founder and CEO{' '}
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
