import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { QuizPlaceholder } from '@/components/portal/QuizPlaceholder'

export default async function QuizPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  const doc = await loadPortalDoc(authorSlug, 'quiz')

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          Section 4
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Communication DNA Quiz
        </h1>
        <p className="mt-2 text-base text-neutral-600 max-w-2xl">
          The 95-question Pentatype assessment. Five archetypes: Concierge,
          Strategist, Analyst, Visionary, Advocate. Your result anchors every
          piece of copy PodcastNetwork.org writes on your behalf.
        </p>
      </header>

      {doc?.html && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm prose prose-neutral max-w-none">
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </section>
      )}

      <QuizPlaceholder />
    </div>
  )
}
