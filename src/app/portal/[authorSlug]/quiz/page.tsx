import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { getSupabaseServerClient } from '@/lib/portal/supabase-server'
import { QuizRunner } from './QuizRunner'
import { QuizResult } from './QuizResult'
import questions from '../../../../../content/portal/quiz/questions.json'
import archetypes from '../../../../../content/portal/quiz/archetypes.json'

type QuizResultRow = {
  id: string
  dominant_archetype: string | null
  secondary_archetype: string | null
  archetype_scores: Record<string, number>
  submitted_at: string
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  const doc = await loadPortalDoc(authorSlug, 'quiz')
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let history: QuizResultRow[] = []
  if (user) {
    const { data } = await supabase
      .from('portal_quiz_results')
      .select('id, dominant_archetype, secondary_archetype, archetype_scores, submitted_at')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
    history = (data as QuizResultRow[] | null) ?? []
  }

  const latest = history[0] ?? null

  return (
    <div className="max-w-5xl space-y-8">
      <header>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-muted">
          Section 4
        </p>
        <h1 className="mt-2 font-portal-serif text-4xl font-semibold tracking-tight text-portal-ink">
          Communication DNA Quiz
        </h1>
        <p className="mt-2 max-w-2xl text-base text-portal-muted">
          The Pentatype family of assessments in an 8-archetype configuration
          for authors. Your dominant + secondary archetype anchors every piece
          of copy PodcastNetwork.org writes on your behalf.
        </p>
        <p className="mt-3 text-xs text-portal-muted">
          v0.2 scaffold: 16 sample questions across 8 archetypes. The full
          95-question deck lands in v0.2.1.
        </p>
      </header>

      {doc?.html && (
        <section className="prose-portal rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </section>
      )}

      {latest ? (
        <QuizResult
          latest={latest}
          history={history}
          archetypes={archetypes.archetypes}
          questions={questions.questions}
          scale={questions.meta.scale}
        />
      ) : (
        <QuizRunner
          questions={questions.questions}
          scale={questions.meta.scale}
          archetypes={archetypes.archetypes}
        />
      )}
    </div>
  )
}
