import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { findAuthorBySlug } from '@/lib/portal/authors'
import { loadPortalDoc } from '@/lib/portal/mdx'
import { Sidebar } from '@/components/portal/Sidebar'
import { TopBar } from '@/components/portal/TopBar'

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

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ authorSlug: string }>
}) {
  const { authorSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()

  const config = await loadPortalDoc(authorSlug, 'config')
  const bookTitle = (config?.data.bookTitle as string) ?? author.bookTitle
  const currentPhase = (config?.data.currentPhase as string) ?? author.currentPhase

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar
        authorSlug={authorSlug}
        authorName={author.name}
        bookTitle={bookTitle}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar author={author} currentPhase={currentPhase} />
        <main className="flex-1 px-6 py-10 lg:px-10">{children}</main>
      </div>
    </div>
  )
}
