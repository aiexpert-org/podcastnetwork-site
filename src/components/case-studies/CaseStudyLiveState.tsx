import caseStudies from '../../../data/case-studies.json'
import {
  LiveCaseStudyCard,
  type CaseStudyStatic,
} from '@/components/case-studies/LiveCaseStudyCard'

/*
 * Server-side lookup so MDX case studies can drop in their live-state card
 * with a slug instead of importing the data file.
 */
export function CaseStudyLiveState({ slug }: { slug: string }) {
  const study = (
    caseStudies as unknown as Record<string, CaseStudyStatic | string>
  )[slug]

  if (!study || typeof study === 'string') return null

  return <LiveCaseStudyCard data={study} headingLevel="h2" />
}
