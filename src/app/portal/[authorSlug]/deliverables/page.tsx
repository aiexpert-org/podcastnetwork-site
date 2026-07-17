import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { PhaseBadge, type Phase } from '@/components/portal/PhaseBadge'
import { Badge } from '@/components/portal/CatalystBadge'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@/components/portal/CatalystTable'

type Deliverable = {
  label: string
  kind: 'pdf' | 'audio' | 'skill' | 'image' | 'zip' | 'link' | 'other'
  status: Phase
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
    <div className="max-w-5xl space-y-8">
      <header>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-muted">
          Section 6
        </p>
        <h1 className="mt-2 font-portal-serif text-4xl font-semibold tracking-tight text-portal-ink">
          Deliverables Vault
        </h1>
        <p className="mt-2 max-w-2xl text-base text-portal-muted">
          Every artifact PodcastNetwork.org ships to you. PDFs, skill installs,
          audiobook masters, marketing assets. All in one place.
        </p>
      </header>

      {items.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Artifact</TableHeader>
              <TableHeader>Kind</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader className="text-right">Download</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((d, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="font-medium text-portal-ink">{d.label}</div>
                  {d.note && (
                    <div className="mt-1 text-xs text-portal-muted">
                      {d.note}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge color="zinc">{d.kind.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  <PhaseBadge phase={d.status} />
                </TableCell>
                <TableCell className="text-right">
                  {d.url && d.status === 'complete' ? (
                    <a
                      href={d.url}
                      className="inline-flex items-center rounded-lg bg-portal-ink px-3 py-1.5 text-sm font-medium text-portal-cream transition hover:bg-portal-ink-soft"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-sm text-portal-muted">Not yet</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {doc?.html && (
        <section className="prose-portal rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </section>
      )}
    </div>
  )
}
