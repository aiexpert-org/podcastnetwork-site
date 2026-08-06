'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

type Question = {
  id: string
  archetype: string
  weight?: number
  text: string
}

type Archetype = {
  id: string
  name: string
  shortDescription: string
}

type Scale = {
  min: number
  max: number
  labels: Record<string, string>
}

export function QuizRunner({
  questions,
  scale,
  archetypes,
}: {
  questions: Question[]
  scale: Scale
  archetypes: Archetype[]
}) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const allAnswered = useMemo(
    () => questions.every((q) => typeof answers[q.id] === 'number'),
    [questions, answers],
  )

  const answeredCount = Object.keys(answers).length

  async function onSubmit() {
    if (!allAnswered) {
      setMessage('Answer every question before submitting.')
      setStatus('error')
      return
    }
    setStatus('submitting')
    setMessage(null)
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q.id,
          value: answers[q.id],
        })),
      }
      const res = await fetch('/api/portal/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong.')
        return
      }
      router.refresh()
    } catch {
      setStatus('error')
      setMessage('Network error. Try again.')
    }
  }

  const scaleValues = Array.from(
    { length: scale.max - scale.min + 1 },
    (_, i) => scale.min + i,
  )

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
        <div className="flex items-baseline justify-between">
          <h2 className="font-portal-serif text-xl font-semibold text-portal-ink">
            Rate each statement.
          </h2>
          <span className="text-xs text-portal-muted tabular-nums">
            {answeredCount} / {questions.length}
          </span>
        </div>
        <p className="mt-2 text-sm text-portal-muted">
          There are no right answers. Go with your first read.
        </p>
      </div>

      <ol className="space-y-4">
        {questions.map((q, index) => {
          const selected = answers[q.id]
          return (
            <li
              key={q.id}
              className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-base text-portal-ink">
                  <span className="mr-2 text-xs font-semibold text-portal-muted tabular-nums">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  {q.text}
                </p>
              </div>
              <fieldset className="mt-4">
                <legend className="sr-only">Your answer</legend>
                <div className="grid grid-cols-5 gap-2">
                  {scaleValues.map((v) => {
                    const isSelected = selected === v
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: v }))
                        }
                        aria-pressed={isSelected}
                        className={clsx(
                          'flex flex-col items-center justify-center rounded-xl border px-2 py-2 text-xs transition',
                          isSelected
                            ? 'border-portal-amber bg-portal-amber text-portal-ink font-semibold'
                            : 'border-portal-line bg-portal-cream text-portal-muted hover:border-portal-amber/40',
                        )}
                      >
                        <span className="text-base font-semibold text-portal-ink">
                          {v}
                        </span>
                        <span className="mt-0.5 leading-tight">
                          {scale.labels[String(v)]}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </li>
          )
        })}
      </ol>

      <div className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-portal-ink">
              Ready when you are.
            </p>
            <p className="text-xs text-portal-muted">
              Answers save to your portal record and tag your GHL contact with
              the resulting archetype.
            </p>
          </div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!allAnswered || status === 'submitting'}
            className="inline-flex items-center justify-center rounded-xl bg-portal-ink px-5 py-3 text-sm font-semibold text-portal-cream shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {status === 'submitting' ? 'Submitting...' : 'See my result'}
          </button>
        </div>
        {status === 'error' && message && (
          <p className="mt-3 text-sm text-red-700">{message}</p>
        )}
      </div>

      <details className="rounded-2xl border border-portal-line bg-portal-surface p-6 text-sm text-portal-muted">
        <summary className="cursor-pointer text-portal-ink">
          What are the 8 archetypes?
        </summary>
        <ul className="mt-4 space-y-3">
          {archetypes.map((a) => (
            <li key={a.id}>
              <p className="font-semibold text-portal-ink">{a.name}</p>
              <p>{a.shortDescription}</p>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
