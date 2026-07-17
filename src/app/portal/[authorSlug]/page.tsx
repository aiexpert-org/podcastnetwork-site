import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { SectionCard } from '@/components/portal/SectionCard'
import { PhaseBadge, type Phase } from '@/components/portal/PhaseBadge'
import { ProgressBar } from '@/components/portal/ProgressBar'

export default async function PortalDashboardPage({
  params,
}: {
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  const config = await loadPortalDoc(authorSlug, 'config')
  const milestones =
    (config?.data.milestones as Array<{
      label: string
      status: Phase
      note?: string
    }>) ?? []
  const overallProgress = (config?.data.overallProgress as number) ?? 0

  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-muted">
          Welcome back
        </p>
        <h1 className="mt-2 font-portal-serif text-4xl font-semibold tracking-tight text-portal-ink">
          {author.name}
        </h1>
        {author.bookSubtitle && (
          <p className="mt-2 max-w-2xl text-base text-portal-muted">
            {author.bookSubtitle}
          </p>
        )}
      </header>

      <section className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-portal-serif text-xl font-semibold text-portal-ink">
            Milestones
          </h2>
          <span className="text-sm text-portal-muted">Pre-Sold Author Package</span>
        </div>
        <ProgressBar value={overallProgress} label="Overall progress" />
        {milestones.length > 0 && (
          <ul className="mt-6 divide-y divide-portal-line">
            {milestones.map((m, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-portal-ink">{m.label}</p>
                  {m.note && (
                    <p className="mt-0.5 text-xs text-portal-muted">{m.note}</p>
                  )}
                </div>
                <PhaseBadge phase={m.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-portal-serif text-xl font-semibold text-portal-ink">
          Your sections
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SectionCard
            href={`/portal/${authorSlug}/audiobook/`}
            eyebrow="Section 1"
            title="Audiobook Production"
            description="Chapter-by-chapter progress, current phase, audio samples for you to review."
            status={<PhaseBadge phase="in-progress" />}
          />
          <SectionCard
            href={`/portal/${authorSlug}/manuscript/`}
            eyebrow="Section 2"
            title="Manuscript Editorial Review"
            description="Deep editorial pass on your book with chapter-by-chapter feedback and rewrite notes."
            status={<PhaseBadge phase="in-progress" />}
          />
          <SectionCard
            href={`/portal/${authorSlug}/voice-corpus/`}
            eyebrow="Section 3"
            title="Voice Corpus Analysis"
            description="Your 23-dimension voice profile rendered as an interactive read."
            status={<PhaseBadge phase="in-progress" />}
          />
          <SectionCard
            href={`/portal/${authorSlug}/quiz/`}
            eyebrow="Section 4"
            title="Communication DNA Quiz"
            description="Sample questions across 8 archetypes. Full 95-question deck lands next."
            status={<PhaseBadge phase="pending" />}
          />
          <SectionCard
            href={`/portal/${authorSlug}/learn/`}
            eyebrow="Section 5"
            title="Learning Modules"
            description="Voice Foundations, writing craft primers, communication development."
            status={<PhaseBadge phase="pending" />}
          />
          <SectionCard
            href={`/portal/${authorSlug}/deliverables/`}
            eyebrow="Section 6"
            title="Deliverables Vault"
            description="Every artifact PodcastNetwork.org ships to you, in one place."
            status={<PhaseBadge phase="in-progress" />}
          />
        </div>
      </section>
    </div>
  )
}
