import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { AssessmentFlow } from '@/components/assessment/AssessmentFlow'

export const metadata: Metadata = {
  title: 'The Deeper Assessment',
  description:
    'Ten questions, about three minutes. Get a personalized recommendation for which build fits what you are trying to accomplish: the Knowledge Panel Install or the Pre-Sold Author Package.',
  alternates: { canonical: '/assessment/' },
}

export default function AssessmentPage() {
  return (
    <>
      <PageIntro
        eyebrow="The deeper assessment"
        title="Ten questions. A precise recommendation."
      >
        <p>
          The instant report shows what Google sees. This assessment works out
          what to do about it. One question per screen, about three minutes,
          and a recommendation at the end that names the build, the price, and
          the reasons in plain language.
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
