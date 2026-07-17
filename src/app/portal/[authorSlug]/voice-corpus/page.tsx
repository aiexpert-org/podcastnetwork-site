import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'

type Dimension = {
  name: string
  score?: number
  scoreLabel?: string
  note?: string
}

export default async function VoiceCorpusPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  const doc = await loadPortalDoc(authorSlug, 'voice-corpus')
  const dimensions = (doc?.data.dimensions as Dimension[] | undefined) ?? []
  const summary = (doc?.data.summary as string | undefined) ?? null
  const wordCount = (doc?.data.corpusWordCount as number | undefined) ?? 0
  const sourceCount = (doc?.data.corpusSourceCount as number | undefined) ?? 0

  return (
    <div className="max-w-5xl space-y-8">
      <header>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-muted">
          Section 3
        </p>
        <h1 className="mt-2 font-portal-serif text-4xl font-semibold tracking-tight text-portal-ink">
          Voice Corpus Analysis
        </h1>
        <p className="mt-2 max-w-2xl text-base text-portal-muted">
          Your 23-dimension voice profile, built from your actual writing and
          speaking. Reads as a pattern map of how you already sound.
        </p>
      </header>

      {(wordCount > 0 || sourceCount > 0) && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-portal-line bg-portal-surface p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-portal-muted">
              Corpus
            </p>
            <p className="mt-2 font-portal-serif text-2xl font-semibold text-portal-ink tabular-nums">
              {wordCount.toLocaleString()}
            </p>
            <p className="text-xs text-portal-muted">words analyzed</p>
          </div>
          <div className="rounded-2xl border border-portal-line bg-portal-surface p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-portal-muted">
              Sources
            </p>
            <p className="mt-2 font-portal-serif text-2xl font-semibold text-portal-ink tabular-nums">
              {sourceCount}
            </p>
            <p className="text-xs text-portal-muted">docs, podcasts, notes</p>
          </div>
          <div className="rounded-2xl border border-portal-line bg-portal-surface p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-portal-muted">
              Dimensions
            </p>
            <p className="mt-2 font-portal-serif text-2xl font-semibold text-portal-ink tabular-nums">
              {dimensions.length || 23}
            </p>
            <p className="text-xs text-portal-muted">scored + noted</p>
          </div>
          <div className="rounded-2xl border border-portal-line bg-portal-surface p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-portal-muted">
              Version
            </p>
            <p className="mt-2 font-portal-serif text-2xl font-semibold text-portal-ink tabular-nums">
              v0.2
            </p>
            <p className="text-xs text-portal-muted">real data wires in next</p>
          </div>
        </section>
      )}

      {summary && (
        <section className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
          <h2 className="mb-2 font-portal-serif text-xl font-semibold text-portal-ink">
            Summary
          </h2>
          <p className="text-portal-ink-soft">{summary}</p>
        </section>
      )}

      {dimensions.length > 0 && (
        <section>
          <h2 className="mb-4 font-portal-serif text-xl font-semibold text-portal-ink">
            The 23 dimensions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {dimensions.map((d, i) => (
              <div
                key={i}
                className="rounded-xl border border-portal-line bg-portal-surface p-4"
              >
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold text-portal-ink">{d.name}</p>
                  {d.scoreLabel && (
                    <span className="text-sm font-medium text-portal-amber">
                      {d.scoreLabel}
                    </span>
                  )}
                </div>
                {d.note && (
                  <p className="mt-1 text-sm text-portal-muted">{d.note}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {doc?.html && (
        <section className="prose-portal rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </section>
      )}
    </div>
  )
}
