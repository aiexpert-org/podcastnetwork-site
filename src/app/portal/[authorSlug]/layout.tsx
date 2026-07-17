import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import {
  findAuthorBySlug,
  fetchAuthorRowBySlug,
} from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { getSupabaseServerClient } from '@/lib/portal/supabase-server'
import { PortalShell } from '@/components/portal/PortalShell'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ authorSlug: string }>
}): Promise<Metadata> {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  return {
    title: author ? `${author.name} · Portal` : 'Portal',
    robots: { index: false, follow: false },
  }
}

export default async function PortalAuthorLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  // Prefer the live portal_authors row for display fields (book title +
  // cover art). Fall back to the MDX config file, then to the static
  // AuthorEntry so the page renders even before the DB is fully seeded.
  const supabase = await getSupabaseServerClient()
  const dbAuthor = await fetchAuthorRowBySlug(supabase, authorSlug)
  const config = await loadPortalDoc(authorSlug, 'config')

  const bookTitle =
    dbAuthor?.book_title ??
    (config?.data.bookTitle as string) ??
    author.bookTitle
  const bookCoverUrl = dbAuthor?.book_cover_url ?? null
  const currentPhase =
    (config?.data.currentPhase as string) ?? author.currentPhase

  return (
    <PortalShell
      author={author}
      currentPhase={currentPhase}
      bookTitle={bookTitle}
      bookCoverUrl={bookCoverUrl}
    >
      {children}
    </PortalShell>
  )
}
