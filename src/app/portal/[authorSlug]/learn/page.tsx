import Link from 'next/link'
import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { Badge } from '@/components/portal/CatalystBadge'

type Module = {
  slug: string
  title: string
  description: string
  duration?: string
  category: string
}

const STUB_MODULES: Module[] = [
  {
    slug: 'voice-foundations',
    title: 'Voice Foundations',
    description:
      'How your voice shows up on the page and on the mic. The 23 dimensions we listen for, and how to read your own corpus.',
    duration: '18 min',
    category: 'Voice',
  },
  {
    slug: 'writing-craft-scene',
    title: 'Writing Craft: Scene',
    description:
      'How to put the reader inside the moment. Sensory anchors, tension, and the difference between a lived scene and a summary.',
    duration: '15 min',
    category: 'Craft',
  },
  {
    slug: 'writing-craft-dialogue',
    title: 'Writing Craft: Dialogue',
    description:
      'How real people actually speak. Rhythm, subtext, and the moves that turn dialogue into character.',
    duration: '14 min',
    category: 'Craft',
  },
  {
    slug: 'writing-craft-chapter-architecture',
    title: 'Writing Craft: Chapter Architecture',
    description:
      'What every chapter needs to earn its own place. Opens, turns, closes, and the reader promise across the book.',
    duration: '20 min',
    category: 'Craft',
  },
  {
    slug: 'communication-development',
    title: 'Communication Development',
    description:
      'How to sharpen the way you speak on podcasts, stages, and interviews. Signature language, response frames, and the trap of the safe answer.',
    duration: '22 min',
    category: 'Communication',
  },
]

export default async function LearnPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  const doc = await loadPortalDoc(authorSlug, 'learn')

  return (
    <div className="max-w-5xl space-y-8">
      <header>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-muted">
          Section 5
        </p>
        <h1 className="mt-2 font-portal-serif text-4xl font-semibold tracking-tight text-portal-ink">
          Learning Modules
        </h1>
        <p className="mt-2 max-w-2xl text-base text-portal-muted">
          Short, sharp modules on voice, craft, and communication. Take them
          in any order, on your schedule. Full curation lands in v0.3; the
          shape below is the stub the pilot walks through this week.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {STUB_MODULES.map((m) => (
          <Link
            key={m.slug}
            href={`/portal/${authorSlug}/learn/${m.slug}/`}
            className="group flex flex-col rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-portal-amber/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <Badge color="amber">{m.category}</Badge>
              {m.duration && (
                <span className="text-xs text-portal-muted tabular-nums">
                  {m.duration}
                </span>
              )}
            </div>
            <h3 className="mt-3 font-portal-serif text-xl font-semibold text-portal-ink group-hover:text-portal-ink-soft">
              {m.title}
            </h3>
            <p className="mt-2 flex-1 text-sm text-portal-muted">
              {m.description}
            </p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-portal-ink group-hover:text-portal-amber">
              Open module
              <span className="ml-1" aria-hidden>
                {'→'}
              </span>
            </span>
          </Link>
        ))}
      </section>

      {doc?.html && (
        <section className="prose-portal rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </section>
      )}
    </div>
  )
}
