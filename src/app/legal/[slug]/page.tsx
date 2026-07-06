import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { legalSchema } from '@/lib/schema-graph'

/**
 * Legal placeholder pages, shipped for link integrity. Real content lands
 * after legal review. Blocked from crawl via robots.
 */

const PAGES: Record<string, { name: string; summary: string }> = {
  privacy: {
    name: 'Privacy Policy',
    summary:
      'We collect the information you submit through forms (name, email, application details) and standard analytics data from your visit. Entity lookups on this site are logged without IP addresses or personal identifiers and expire after 30 days. We do not sell your information to third parties.',
  },
  terms: {
    name: 'Terms of Service',
    summary:
      'Use of PodcastNetwork.org is subject to our terms of service, which cover application submission, engagement scope, and payment terms for the Knowledge Panel Install and the Pre-Sold Author Package.',
  },
  'legacy-jv': {
    name: 'Legacy Publishing JV Disclosure',
    summary:
      'PodcastNetwork.org operates a joint venture with Legacy Publishing. The $36,000 Pre-Sold Author Package fee is paid to PodcastNetwork.org and covers the book production and authority build. Publishing through Legacy Publishing is an option for the resulting title; Legacy earns 10 percent of net book sales as royalty, with no upfront fee to the author. Brett K Moore and Mike Partners hold ownership positions in both entities.',
  },
}

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = PAGES[slug]
  if (!page) return {}
  return {
    title: page.name,
    robots: { index: false, follow: true },
    alternates: { canonical: `/legal/${slug}/` },
  }
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = PAGES[slug]
  if (!page) notFound()

  return (
    <>
      <SchemaGraph schema={legalSchema(slug, page.name)} />

      <PageIntro eyebrow="Legal" title={page.name}>
        <p>{page.summary}</p>
      </PageIntro>

      <Container className="mt-16">
        <FadeIn>
          <p className="max-w-3xl text-base text-neutral-600">
            The complete document is in legal review and ships in the next site
            update. Questions in the meantime:{' '}
            <a
              href="mailto:hello@podcastnetwork.org"
              className="font-semibold text-signal transition hover:text-signal-dark"
            >
              hello@podcastnetwork.org
            </a>
            .
          </p>
        </FadeIn>
      </Container>
    </>
  )
}
