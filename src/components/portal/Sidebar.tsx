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
    { href: `${base}/audiobook/`, label: 'Audiobook', description: 'Production progress + samples' },
    { href: `${base}/manuscript/`, label: 'Manuscript', description: 'Editorial review + notes' },
    { href: `${base}/voice-corpus/`, label: 'Voice Corpus', description: '23-dimension analysis' },
    { href: `${base}/quiz/`, label: 'Communication DNA', description: 'Your archetype quiz' },
    { href: `${base}/learn/`, label: 'Learn', description: 'Voice + craft primers' },
    { href: `${base}/deliverables/`, label: 'Deliverables', description: 'Everything we ship you' },
  ]
}

export function Sidebar({ authorSlug, authorName, bookTitle }: {
  authorSlug: string
  authorName: string
  bookTitle: string
}) {
  const pathname = usePathname()
  const nav = buildNav(authorSlug)

  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-neutral-200 lg:bg-white">
      <div className="px-6 py-8 border-b border-neutral-200">
        <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-900">
          PodcastNetwork.org
        </Link>
        <div className="mt-3">
          <p className="text-lg font-semibold text-neutral-950">{authorName}</p>
          <p className="text-sm text-neutral-500">{bookTitle}</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Portal">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/portal/${authorSlug}/` && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'block rounded-lg px-3 py-2.5 transition',
                isActive
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100',
              )}
            >
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className={clsx(
                'block text-xs',
                isActive ? 'text-neutral-300' : 'text-neutral-500',
              )}>
                {item.description}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-6 border-t border-neutral-200">
        <form action="/api/portal/logout" method="POST">
          <button
            type="submit"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
