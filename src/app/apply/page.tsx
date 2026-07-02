import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { ApplyFlow } from '@/components/application/ApplyFlow'
import { SchemaGraph } from '@/components/seo/SchemaGraph'
import { applySchema } from '@/lib/schema-graph'

export const metadata: Metadata = {
  title: 'Apply. The application is the diagnostic',
  description:
    'The intake opens with a live schema validator. Paste your URL, see your current authority baseline, then answer six questions. We respond within two business days.',
  alternates: { canonical: '/apply/' },
}

export default function ApplyPage() {
  return (
    <>
      <SchemaGraph schema={applySchema()} />

      <PageIntro eyebrow="Apply" title="The application is the diagnostic.">
        <p>
          No form fields until we&apos;ve shown you where you stand today. The
          honest map comes first on every engagement we run. About 10 minutes
          end to end. We respond within two business days.
        </p>
      </PageIntro>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn>
          <ApplyFlow />
        </FadeIn>
      </Container>
    </>
  )
}
