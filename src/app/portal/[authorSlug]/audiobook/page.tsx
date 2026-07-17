import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { PhaseBadge } from '@/components/portal/PhaseBadge'
import { ProgressBar } from '@/components/portal/ProgressBar'

type Chapter = {
  number: number
  title: string
  status: 'pending' | 'in-progress' | 'review' | 'complete'
  phase?: string
  sampleUrl?: string
}

export default async function AudiobookPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  const doc = await loadPortalDoc(authorSlug, 'audiobook')
  const chapters = (doc?.data.chapters as Chapter[] | undefined) ?? []
  const currentPhase = (doc?.data.currentPhase as string) ?? 'Recording'
  const progress = (doc?.data.progress as number) ?? 0

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          Section 1
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Audiobook Production
        </h1>
        <p className="mt-2 text-base text-neutral-600 max-w-2xl">
          Current phase: <span className="font-medium text-neutral-900">{currentPhase}</span>
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <ProgressBar value={progress} label="Overall production" />
      </section>

      {chapters.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-neutral-950 mb-4">Chapters</h2>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-500">Chapter</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-500">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-500">Phase</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {chapters.map((c) => (
                  <tr key={c.number}>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900 tabular-nums">{c.number}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700">{c.title}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{c.phase ?? '—'}</td>
                    <td className="px-4 py-3"><PhaseBadge phase={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
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
