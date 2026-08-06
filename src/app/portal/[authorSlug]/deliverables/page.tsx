import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'

type Deliverable = {
  label: string
  kind: 'pdf' | 'audio' | 'skill' | 'image' | 'zip' | 'link' | 'other'
  status: 'pending' | 'in-progress' | 'review' | 'complete'
  url?: string
  note?: string
}

export default async function DeliverablesPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  const doc = await loadPortalDoc(authorSlug, 'deliverables')
  const items = (doc?.data.items as Deliverable[] | undefined) ?? []

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          Section 6
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Deliverables Vault
        </h1>
        <p className="mt-2 text-base text-neutral-600 max-w-2xl">
          Every artifact PodcastNetwork.org ships to you. PDFs, skill installs,
          audiobook files, marketing assets — all in one place.
        </p>
      </header>

      {items.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <ul className="divide-y divide-neutral-200">
            {items.map((d, i) => (
              <li key={i} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-neutral-900">{d.label}</p>
                  {d.note && <p className="text-sm text-neutral-500 mt-0.5">{d.note}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">{d.kind}</span>
                  {d.url && d.status === 'complete' ? (
                    <a
                      href={d.url}
                      className="inline-flex items-center rounded-lg bg-neutral-950 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-sm text-neutral-500">Coming</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
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
