import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { PhaseBadge, type Phase } from '@/components/portal/PhaseBadge'
import { Badge } from '@/components/portal/CatalystBadge'

type ChapterNote = {
  chapter: string
  theme?: string
  status: Phase
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

  const isPlaceholder = chapters.length === 0 && themes.length === 0

  return (
    <div className="max-w-5xl space-y-8">
      <header>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-muted">
          Section 2
        </p>
        <h1 className="mt-2 font-portal-serif text-4xl font-semibold tracking-tight text-portal-ink">
          Manuscript Editorial Review
        </h1>
        <p className="mt-2 max-w-2xl text-base text-portal-muted">
          Deep editorial pass on your book. Themes surfaced, chapter-by-chapter
          feedback, gaps flagged.
        </p>
      </header>

      {isPlaceholder && (
        <section className="rounded-2xl border border-portal-amber/40 bg-portal-amber-tint/40 p-5">
          <div className="flex items-start gap-3">
            <Badge color="amber">In review</Badge>
            <p className="text-sm text-portal-ink">
              The full editorial pass is landing this week. When it lands, this
              page renders themes surfaced, chapter-by-chapter status, and
              inline rewrite notes.
            </p>
          </div>
        </section>
      )}

      {themes.length > 0 && (
        <section className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
          <h2 className="mb-4 font-portal-serif text-xl font-semibold text-portal-ink">
            Themes surfaced
          </h2>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <Badge key={t} color="zinc">
                {t}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {chapters.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-portal-serif text-xl font-semibold text-portal-ink">
            Chapter by chapter
          </h2>
          {chapters.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-portal-serif text-base font-semibold text-portal-ink">
                    {c.chapter}
                  </h3>
                  {c.theme && (
                    <p className="mt-0.5 text-sm text-portal-muted">
                      Theme: {c.theme}
                    </p>
                  )}
                </div>
                <PhaseBadge phase={c.status} />
              </div>
              {c.strengths && c.strengths.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-portal-muted">
                    Strengths
                  </p>
                  <ul className="space-y-1 text-sm text-portal-ink">
                    {c.strengths.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {c.gaps && c.gaps.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-portal-muted">
                    Gaps
                  </p>
                  <ul className="space-y-1 text-sm text-portal-ink">
                    {c.gaps.map((g, j) => (
                      <li key={j}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
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
