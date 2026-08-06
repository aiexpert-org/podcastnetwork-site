'use client'

import clsx from 'clsx'
import type { AuthorEntry } from '@/lib/portal/authors'

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TopBar({
  author,
  currentPhase,
  bookCoverUrl,
  onOpenDrawer,
}: {
  author: AuthorEntry
  currentPhase?: string
  bookCoverUrl?: string | null
  onOpenDrawer?: () => void
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-portal-line bg-portal-cream/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-portal-line bg-portal-surface text-portal-ink lg:hidden"
            aria-label="Open navigation"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-muted">
              Client Portal
            </p>
            <p className="font-portal-serif text-sm text-portal-ink">
              {currentPhase ?? author.currentPhase}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold text-portal-ink">
                {author.name}
              </p>
              {author.cohort && (
                <p className="text-xs text-portal-muted">{author.cohort}</p>
              )}
            </div>
            <div
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-full border border-portal-line bg-portal-amber/10 text-sm font-semibold text-portal-ink',
              )}
              aria-hidden
            >
              {initialsFor(author.name)}
            </div>
          </div>

          {bookCoverUrl ? (
            <div className="hidden h-10 w-8 overflow-hidden rounded-sm shadow-md sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bookCoverUrl}
                alt={`${author.name} book cover`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div
              className="hidden h-10 w-8 items-center justify-center rounded-sm border border-portal-line bg-portal-amber-tint text-[0.5rem] font-semibold uppercase tracking-widest text-portal-muted sm:flex"
              title="Book cover placeholder"
            >
              cover
            </div>
          )}

          <form action="/api/portal/logout" method="POST" className="hidden lg:block">
            <button
              type="submit"
              className="inline-flex items-center rounded-xl border border-portal-line bg-portal-surface px-3 py-1.5 text-xs font-medium text-portal-ink transition hover:bg-portal-amber-tint/60"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
