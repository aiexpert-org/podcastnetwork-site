import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'

type Module = {
  title: string
  description: string
  duration?: string
  status: 'pending' | 'in-progress' | 'review' | 'complete'
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  const doc = await loadPortalDoc(authorSlug, 'learn')
  const modules = (doc?.data.modules as Module[] | undefined) ?? [
    { title: 'Voice Foundations', description: 'How your voice shows up on the page and on the mic.', status: 'pending' },
    { title: 'Writing Craft Primers', description: 'Line-level and structural essentials for author-led books.', status: 'pending' },
    { title: 'Communication Development', description: 'Sharpening how you speak on podcasts, stages, and interviews.', status: 'pending' },
  ]

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          Section 5
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Learning Modules
        </h1>
        <p className="mt-2 text-base text-neutral-600 max-w-2xl">
          Short, sharp modules on voice, craft, and communication. Take them
          in any order, on your schedule.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {modules.map((m, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-950">{m.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{m.description}</p>
            {m.duration && (
              <p className="mt-3 text-xs text-neutral-500">Approx {m.duration}</p>
            )}
            <p className="mt-4 text-xs uppercase tracking-widest text-neutral-500 font-semibold">Coming in v0.2</p>
          </div>
        ))}
      </section>

      {doc?.html && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm prose prose-neutral max-w-none">
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </section>
      )}
    </div>
  )
}
