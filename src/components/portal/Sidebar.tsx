'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

type NavItem = {
  href: string
  label: string
  description: string
}

function buildNav(slug: string): NavItem[] {
  const base = `/portal/${slug}`
  return [
    { href: `${base}/`, label: 'Dashboard', description: 'Everything at a glance' },
    { href: `${base}/audiobook/`, label: 'Audiobook', description: 'Production progress and samples' },
    { href: `${base}/manuscript/`, label: 'Manuscript', description: 'Editorial review and notes' },
    { href: `${base}/voice-corpus/`, label: 'Voice Corpus', description: '23-dimension analysis' },
    { href: `${base}/quiz/`, label: 'Communication DNA', description: 'Your archetype quiz' },
    { href: `${base}/learn/`, label: 'Learning', description: 'Voice and craft primers' },
    { href: `${base}/deliverables/`, label: 'Deliverables', description: 'Everything we ship you' },
  ]
}

export function Sidebar({
  authorSlug,
  authorName,
  bookTitle,
  variant = 'desktop',
  onNavigate,
}: {
  authorSlug: string
  authorName: string
  bookTitle: string
  variant?: 'desktop' | 'drawer'
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const nav = buildNav(authorSlug)

  const containerClass =
    variant === 'desktop'
      ? 'hidden lg:flex lg:w-72 lg:shrink-0 lg:flex-col lg:border-r lg:border-portal-line lg:bg-portal-cream'
      : 'flex h-full w-full flex-col bg-portal-cream'

  return (
    <aside className={containerClass} aria-label="Portal navigation">
      <div className="px-6 py-8">
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-portal-muted hover:text-portal-ink"
        >
          PodcastNetwork.org
        </Link>
        <div className="mt-4">
          <p className="font-portal-serif text-lg font-semibold text-portal-ink">
            {authorName}
          </p>
          <p className="text-sm text-portal-muted">{bookTitle}</p>
        </div>
      </div>
      <div className="mx-6 h-px bg-portal-line" />
      <nav className="flex-1 space-y-0.5 px-4 py-6" aria-label="Portal sections">
        {nav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/portal/${authorSlug}/` &&
              pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                'block rounded-xl px-3 py-2.5 transition-colors',
                isActive
                  ? 'bg-portal-ink text-portal-cream'
                  : 'text-portal-ink hover:bg-portal-amber-tint/60',
              )}
            >
              <span className="block text-sm font-semibold tracking-tight">
                {item.label}
              </span>
              <span
                className={clsx(
                  'block text-xs',
                  isActive ? 'text-portal-cream/70' : 'text-portal-muted',
                )}
              >
                {item.description}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-portal-line px-4 py-5">
        <form action="/api/portal/logout" method="POST">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl border border-portal-line bg-portal-surface px-3 py-2 text-sm font-medium text-portal-ink transition hover:bg-portal-amber-tint/60"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
