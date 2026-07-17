import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/portal/supabase-server'
import questions from '../../../../../../content/portal/quiz/questions.json'
import archetypes from '../../../../../../content/portal/quiz/archetypes.json'

type Answer = { questionId: string; value: number }
type QuestionEntry = { id: string; archetype: string; weight?: number }
type ArchetypeEntry = { id: string }

function scoreAnswers(answers: Answer[]): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const a of archetypes.archetypes as ArchetypeEntry[]) {
    scores[a.id] = 0
  }
  const qById = new Map<string, QuestionEntry>()
  for (const q of questions.questions as QuestionEntry[]) {
    qById.set(q.id, q)
  }
  for (const answer of answers) {
    const q = qById.get(answer.questionId)
    if (!q) continue
    const weight = q.weight ?? 1
    scores[q.archetype] = (scores[q.archetype] ?? 0) + answer.value * weight
  }
  return scores
}

function pickTop(scores: Record<string, number>) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  return {
    dominant: sorted[0]?.[0] ?? null,
    secondary: sorted[1]?.[0] ?? null,
  }
}

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized.' },
      { status: 401 },
    )
  }

  let answers: Answer[] = []
  try {
    const body = await request.json()
    answers = Array.isArray(body.answers) ? body.answers : []
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request body.' },
      { status: 400 },
    )
  }

  if (answers.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'No answers submitted.' },
      { status: 400 },
    )
  }

  const scores = scoreAnswers(answers)
  const { dominant, secondary } = pickTop(scores)

  const { error } = await supabase.from('portal_quiz_results').insert({
    user_id: user.id,
    answers: answers as unknown as object,
    archetype_scores: scores,
    dominant_archetype: dominant,
    secondary_archetype: secondary,
  })

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    )
  }

  // Fire the GHL webhook best-effort. The write to Supabase is the source
  // of truth; a GHL failure should not cost the user their result.
  const ghlUrl = process.env.GHL_QUIZ_WEBHOOK_URL
  if (ghlUrl && dominant) {
    try {
      await fetch(ghlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          archetype: dominant,
          secondary_archetype: secondary,
          scores,
          source: 'portal_quiz_v0_2_scaffold',
        }),
      })
    } catch {
      // swallow — the Supabase write already succeeded
    }
  }

  return NextResponse.json({
    ok: true,
    dominant,
    secondary,
    scores,
  })
}
