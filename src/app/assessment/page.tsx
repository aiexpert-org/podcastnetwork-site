import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { AssessmentFlow } from '@/components/assessment/AssessmentFlow'

export const metadata: Metadata = {
  title: 'The Google Authority Quiz',
  description:
    'Six questions most executives get wrong, answered as you go. Three minutes, and you finish with a Google Authority Briefing: what a Knowledge Panel is, what the market charges, and the five things to demand from any vendor.',
  alternates: { canonical: '/assessment/' },
}

export default function AssessmentPage() {
  return (
    <>
      <PageIntro
        eyebrow="The three-minute quiz"
        title="Do you know what Google says about you?"
      >
        <p>
          Six questions most people get wrong, and you learn the answer to
          each one as you go. At the end: your Google Authority Briefing, with
          what the market charges and the five things to demand from any
          vendor you hire, including us.
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
