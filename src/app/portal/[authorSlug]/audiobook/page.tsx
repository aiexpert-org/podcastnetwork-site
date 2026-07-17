import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { PhaseBadge, type Phase } from '@/components/portal/PhaseBadge'
import { ProgressBar } from '@/components/portal/ProgressBar'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@/components/portal/CatalystTable'
import { Badge } from '@/components/portal/CatalystBadge'
import clsx from 'clsx'

type Chapter = {
  number: number
  title: string
  status: Phase
  phase?: string
  sampleUrl?: string
}

type PhaseDef = { number: number; name: string; short: string }

const PIPELINE_PHASES: PhaseDef[] = [
  { number: 1, name: 'Voice Discovery', short: 'Kickoff, sample capture, voice brief.' },
  { number: 2, name: 'Training Data Collection', short: 'Structured reads for the voice clone corpus.' },
  { number: 3, name: 'Voice Model Training', short: 'Clone training against the delivered corpus.' },
  { number: 4, name: 'Chapter Generation', short: 'Per-chapter generation with QC pass.' },
  { number: 5, name: 'Master and Deliver', short: 'Mastering, final QC, delivery of masters.' },
]

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
  const currentPhaseNumber =
    typeof doc?.data.currentPhaseNumber === 'number'
      ? (doc.data.currentPhaseNumber as number)
      : 2
  const currentPhaseLabel =
    (doc?.data.currentPhase as string) ??
    PIPELINE_PHASES.find((p) => p.number === currentPhaseNumber)?.name ??
    'Voice Discovery'
  const progress = (doc?.data.progress as number) ?? 0

  return (
    <div className="max-w-5xl space-y-8">
      <header>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-muted">
          Section 1
        </p>
        <h1 className="mt-2 font-portal-serif text-4xl font-semibold tracking-tight text-portal-ink">
          Audiobook Production
        </h1>
        <p className="mt-2 max-w-2xl text-base text-portal-muted">
          Current phase:{' '}
          <span className="font-medium text-portal-ink">
            Phase {currentPhaseNumber} · {currentPhaseLabel}
          </span>
        </p>
      </header>

      <section className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
        <ProgressBar value={progress} label="Overall production" />
      </section>

      <section>
        <h2 className="mb-4 font-portal-serif text-xl font-semibold text-portal-ink">
          Pipeline
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PIPELINE_PHASES.map((p) => {
            const state =
              p.number < currentPhaseNumber
                ? 'done'
                : p.number === currentPhaseNumber
                  ? 'active'
                  : 'upcoming'
            return (
              <li
                key={p.number}
                className={clsx(
                  'rounded-2xl border p-4 shadow-sm',
                  state === 'done' && 'border-emerald-200 bg-emerald-50/60',
                  state === 'active' && 'border-portal-amber bg-portal-amber-tint',
                  state === 'upcoming' && 'border-portal-line bg-portal-surface',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-portal-mono text-xs text-portal-muted">
                    Phase {p.number}
                  </span>
                  {state === 'done' && <Badge color="emerald">Complete</Badge>}
                  {state === 'active' && <Badge color="amber">Active</Badge>}
                </div>
                <p className="mt-2 font-semibold text-portal-ink">{p.name}</p>
                <p className="mt-1 text-xs text-portal-muted">{p.short}</p>
              </li>
            )
          })}
        </ol>
      </section>

      {chapters.length > 0 && (
        <section>
          <h2 className="mb-4 font-portal-serif text-xl font-semibold text-portal-ink">
            Chapters
          </h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Chapter</TableHeader>
                <TableHeader>Title</TableHeader>
                <TableHeader>Phase</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Sample</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {chapters.map((c) => (
                <TableRow key={c.number}>
                  <TableCell className="font-mono tabular-nums text-portal-ink">
                    {String(c.number).padStart(2, '0')}
                  </TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell className="text-portal-muted">
                    {c.phase ?? '—'}
                  </TableCell>
                  <TableCell>
                    <PhaseBadge phase={c.status} />
                  </TableCell>
                  <TableCell>
                    {c.sampleUrl ? (
                      <a
                        href={c.sampleUrl}
                        className="text-sm font-medium text-portal-ink underline underline-offset-4"
                      >
                        Listen
                      </a>
                    ) : (
                      <span className="text-xs text-portal-muted">
                        Not yet
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
