import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { PhaseBadge } from '@/components/portal/PhaseBadge'

type ChapterNote = {
  chapter: string
  theme?: string
  status: 'pending' | 'in-progress' | 'review' | 'complete'
  gaps?: string[]
  strengths?: string[]
}

export default async function ManuscriptPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  const doc = await loadPortalDoc(authorSlug, 'manuscript-review')
  const chapters = (doc?.data.chapters as ChapterNote[] | undefined) ?? []
  const themes = (doc?.data.themes as string[] | undefined) ?? []

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          Section 2
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Manuscript Editorial Review
        </h1>
        <p className="mt-2 text-base text-neutral-600 max-w-2xl">
          Deep editorial pass on your book. Themes surfaced, chapter-by-chapter
          feedback, gaps flagged.
        </p>
      </header>

      {themes.length > 0 && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-950 mb-4">Themes surfaced</h2>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <span key={t} className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-800">
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {chapters.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-950">Chapter-by-chapter</h2>
          {chapters.map((c, i) => (
            <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-neutral-950">{c.chapter}</h3>
                  {c.theme && <p className="text-sm text-neutral-500 mt-0.5">Theme: {c.theme}</p>}
                </div>
                <PhaseBadge phase={c.status} />
              </div>
              {c.strengths && c.strengths.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">Strengths</p>
                  <ul className="space-y-1 text-sm text-neutral-700">
                    {c.strengths.map((s, j) => <li key={j}>{s}</li>)}
                  </ul>
                </div>
              )}
              {c.gaps && c.gaps.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">Gaps</p>
                  <ul className="space-y-1 text-sm text-neutral-700">
                    {c.gaps.map((g, j) => <li key={j}>{g}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ))}
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
