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
    <div className="space-y-8 max-w-5xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          Section 3
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Voice Corpus Analysis
        </h1>
        <p className="mt-2 text-base text-neutral-600 max-w-2xl">
          Your 23-dimension voice profile, built from your actual writing and
          speaking. Not a personality test. A pattern read.
        </p>
      </header>

      {(wordCount > 0 || sourceCount > 0) && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Corpus</p>
            <p className="mt-2 text-2xl font-semibold text-neutral-950 tabular-nums">{wordCount.toLocaleString()}</p>
            <p className="text-xs text-neutral-500">words analyzed</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Sources</p>
            <p className="mt-2 text-2xl font-semibold text-neutral-950 tabular-nums">{sourceCount}</p>
            <p className="text-xs text-neutral-500">docs, podcasts, notes</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Dimensions</p>
            <p className="mt-2 text-2xl font-semibold text-neutral-950 tabular-nums">{dimensions.length || 23}</p>
            <p className="text-xs text-neutral-500">scored + noted</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Version</p>
            <p className="mt-2 text-2xl font-semibold text-neutral-950 tabular-nums">v0.1</p>
            <p className="text-xs text-neutral-500">v0.2 wires real data</p>
          </div>
        </section>
      )}

      {summary && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-950 mb-2">Summary</h2>
          <p className="text-neutral-700">{summary}</p>
        </section>
      )}

      {dimensions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-neutral-950 mb-4">The 23 dimensions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {dimensions.map((d, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold text-neutral-900">{d.name}</p>
                  {d.scoreLabel && (
                    <span className="text-sm font-medium text-neutral-700">{d.scoreLabel}</span>
                  )}
                </div>
                {d.note && <p className="text-sm text-neutral-600 mt-1">{d.note}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {doc?.html && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm prose prose-neutral max-w-none">
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </section>
      )}
    </div>
  )
}
