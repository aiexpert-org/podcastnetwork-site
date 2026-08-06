'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

import { Badge } from '@/components/portal/CatalystBadge'
import { QuizRunner } from './QuizRunner'

type QuizResultRow = {
  id: string
  dominant_archetype: string | null
  secondary_archetype: string | null
  archetype_scores: Record<string, number>
  submitted_at: string
}

type Archetype = {
  id: string
  name: string
  shortDescription: string
  keyStrength: string
  communicationStyle: string
  watchOut: string
  worksWellWith: string[]
}

type Question = {
  id: string
  archetype: string
  weight?: number
  text: string
}

type Scale = {
  min: number
  max: number
  labels: Record<string, string>
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function QuizResult({
  latest,
  history,
  archetypes,
  questions,
  scale,
}: {
  latest: QuizResultRow
  history: QuizResultRow[]
  archetypes: Archetype[]
  questions: Question[]
  scale: Scale
}) {
  const router = useRouter()
  const [showRetake, setShowRetake] = useState(false)

  const byId = new Map<string, Archetype>()
  for (const a of archetypes) byId.set(a.id, a)

  const dominant = latest.dominant_archetype
    ? byId.get(latest.dominant_archetype)
    : null
  const secondary = latest.secondary_archetype
    ? byId.get(latest.secondary_archetype)
    : null

  const scoreEntries = Object.entries(latest.archetype_scores).sort(
    (a, b) => b[1] - a[1],
  )
  const maxScore = Math.max(...scoreEntries.map(([, v]) => v), 1)

  if (showRetake) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowRetake(false)}
          className="text-sm text-portal-ink underline underline-offset-4"
        >
          Back to your last result
        </button>
        <QuizRunner
          questions={questions}
          scale={scale}
          archetypes={archetypes}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-muted">
            Your latest result
          </p>
          <Badge color="zinc">{formatDate(latest.submitted_at)}</Badge>
        </div>

        {dominant && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-portal-amber">
              Dominant
            </p>
            <h2 className="font-portal-serif text-3xl font-semibold text-portal-ink">
              {dominant.name}
            </h2>
            <p className="mt-2 max-w-2xl text-base text-portal-muted">
              {dominant.shortDescription}
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-portal-muted">
                  Key strength
                </dt>
                <dd className="mt-1 text-sm text-portal-ink">
                  {dominant.keyStrength}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-portal-muted">
                  Communication style
                </dt>
                <dd className="mt-1 text-sm text-portal-ink">
                  {dominant.communicationStyle}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-portal-muted">
                  Watch out
                </dt>
                <dd className="mt-1 text-sm text-portal-ink">
                  {dominant.watchOut}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-portal-muted">
                  Pairs well with
                </dt>
                <dd className="mt-1 text-sm text-portal-ink">
                  {dominant.worksWellWith
                    .map((id) => byId.get(id)?.name ?? id)
                    .join(', ')}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {secondary && (
          <div className="mt-8 border-t border-portal-line pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-portal-amber">
              Secondary
            </p>
            <h3 className="font-portal-serif text-2xl font-semibold text-portal-ink">
              {secondary.name}
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-portal-muted">
              {secondary.shortDescription}
            </p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
        <h3 className="font-portal-serif text-lg font-semibold text-portal-ink">
          Score breakdown
        </h3>
        <ul className="mt-4 space-y-3">
          {scoreEntries.map(([id, score]) => {
            const arch = byId.get(id)
            const pct = Math.round((score / maxScore) * 100)
            return (
              <li key={id}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium text-portal-ink">
                    {arch?.name ?? id}
                  </span>
                  <span className="text-xs text-portal-muted tabular-nums">
                    {score}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-portal-line">
                  <div
                    className={clsx(
                      'h-full rounded-full',
                      id === latest.dominant_archetype
                        ? 'bg-portal-amber'
                        : id === latest.secondary_archetype
                          ? 'bg-portal-amber/60'
                          : 'bg-portal-ink/25',
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setShowRetake(true)}
          className="inline-flex items-center justify-center rounded-xl border border-portal-line bg-portal-surface px-4 py-2 text-sm font-medium text-portal-ink transition hover:bg-portal-amber-tint/60"
        >
          Retake the quiz
        </button>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="text-xs text-portal-muted underline underline-offset-4"
        >
          Refresh
        </button>
      </div>

      {history.length > 1 && (
        <section className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
          <h3 className="font-portal-serif text-lg font-semibold text-portal-ink">
            History
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {history.map((h) => (
              <li
                key={h.id}
                className="flex items-center justify-between border-b border-portal-line py-2 last:border-b-0"
              >
                <span className="text-portal-ink">
                  {byId.get(h.dominant_archetype ?? '')?.name ??
                    h.dominant_archetype ??
                    'Unknown'}
                </span>
                <span className="text-portal-muted">
                  {formatDate(h.submitted_at)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
