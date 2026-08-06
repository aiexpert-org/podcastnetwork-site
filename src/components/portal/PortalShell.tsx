'use client'

import { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import type { AuthorEntry } from '@/lib/portal/authors'

/*
 * PortalShell is the Catalyst-shaped SidebarLayout wrapper for /portal/*.
 *
 * Desktop (lg+): fixed 288px sidebar on the left, main column on the right
 * with a sticky top bar and a scrolling content area.
 * Mobile: slide-in drawer sidebar triggered from a hamburger in the top bar.
 *
 * Everything sits inside a .portal-scope div so the portal token palette
 * and font stack apply without leaking into the marketing chrome.
 */
export function PortalShell({
  author,
  currentPhase,
  bookTitle,
  bookCoverUrl,
  children,
}: {
  author: AuthorEntry
  currentPhase?: string
  bookTitle?: string
  bookCoverUrl?: string | null
  children: React.ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="portal-scope min-h-screen">
      {/* Skip link for keyboard + screen reader users */}
      <a
        href="#portal-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-portal-ink focus:px-3 focus:py-2 focus:text-sm focus:text-portal-cream"
      >
        Skip to portal content
      </a>

      <div className="flex min-h-screen">
        <Sidebar
          authorSlug={author.slug}
          authorName={author.name}
          bookTitle={bookTitle ?? author.bookTitle}
        />

        {/* Mobile drawer overlay */}
        <div
          className={clsx(
            'fixed inset-0 z-40 bg-portal-ink/60 backdrop-blur-sm transition-opacity lg:hidden',
            drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          onClick={() => setDrawerOpen(false)}
          aria-hidden={!drawerOpen}
        />
        <div
          className={clsx(
            'fixed inset-y-0 left-0 z-50 w-72 transform bg-portal-cream shadow-xl transition-transform lg:hidden',
            drawerOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Portal navigation"
        >
          <Sidebar
            authorSlug={author.slug}
            authorName={author.name}
            bookTitle={bookTitle ?? author.bookTitle}
            variant="drawer"
            onNavigate={() => setDrawerOpen(false)}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            author={author}
            currentPhase={currentPhase}
            bookCoverUrl={bookCoverUrl}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
          <main
            id="portal-main"
            className="flex-1 bg-portal-cream px-4 py-8 sm:px-6 lg:px-10"
          >
            {children}
          </main>
          <footer className="border-t border-portal-line bg-portal-cream px-4 py-6 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-3 text-xs text-portal-muted sm:flex-row sm:items-center sm:justify-between">
              <p>
                PodcastNetwork.org Client Portal. Concierge fulfillment for the
                Pre-Sold Author Package.
              </p>
              <p>
                Questions? Email{' '}
                <Link
                  href="mailto:brett@podcastnetwork.org"
                  className="font-medium text-portal-ink underline underline-offset-4"
                >
                  brett@podcastnetwork.org
                </Link>
                .
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
