/*
 * Portal author allowlist. v0.1 is a hardcoded array; v0.2 will sync from a
 * GHL custom field (`portal_active`) on the contact record.
 *
 * Adding an author to the portal:
 *   1. Add an entry to PORTAL_AUTHORS below.
 *   2. Create content/portal/{slug}/ with the six MDX files.
 *   3. Trigger a Vercel deploy — no code changes required beyond this file.
 */

export type AuthorEntry = {
  slug: string
  name: string          // canonical form; use "Brett K. Moore" with period after K on bylines
  email: string
  bookTitle: string
  bookSubtitle?: string
  currentPhase: string
  cohort?: string
}

export const PORTAL_AUTHORS: AuthorEntry[] = [
  {
    slug: 'steve-chua',
    name: 'Steve Chua',
    email: 'stevechuaintl@gmail.com',
    bookTitle: 'TBD',
    bookSubtitle: 'Pilot author for the PN.org Pre-Sold Author Package.',
    currentPhase: 'Voice Corpus + Manuscript Editorial Review',
    cohort: 'Pre-Sold Author Pilot',
  },
]

export function findAuthorByEmail(email: string): AuthorEntry | null {
  const normalized = email.trim().toLowerCase()
  return (
    PORTAL_AUTHORS.find((a) => a.email.toLowerCase() === normalized) ?? null
  )
}

export function findAuthorBySlug(slug: string): AuthorEntry | null {
  return PORTAL_AUTHORS.find((a) => a.slug === slug) ?? null
}
