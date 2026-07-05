import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { AssessmentFlow } from '@/components/assessment/AssessmentFlow'

export const metadata: Metadata = {
  title: 'The Google Authority Quiz',
  description:
    'Google has already decided who you are. In three minutes you will know how to take control of your Google Knowledge Panel.',
  alternates: { canonical: '/assessment/' },
}

export default function AssessmentPage() {
  return (
    <>
      <PageIntro
        eyebrow="The three-minute quiz"
        title="Google has already decided who you are."
      >
        <p>
          Every deal, meeting, and reference check now starts with a search,
          and that page gets shaped with or without you. In three minutes you
          will know how to take control of your Google Knowledge Panel.
        </p>
      </PageIntro>

      <Container className="mt-16 sm:mt-20">
        <FadeIn>
          <div className="mx-auto max-w-2xl">
            <AssessmentFlow />
          </div>
        </FadeIn>
      </Container>
    </>
  )
}
