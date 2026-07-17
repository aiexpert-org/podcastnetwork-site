/*
 * Portal author lookup helpers. v0.2 pattern:
 *   - The canonical author identity lives in Supabase (portal_authors table).
 *   - This file keeps a static PORTAL_AUTHORS array for display copy that is
 *     not on the DB yet (cohort label, currentPhase copy, book subtitle).
 *   - Server code that needs the DB row calls fetchAuthorRow() below.
 *
 * Adding a new Pre-Sold Author Package client:
 *   1. Create the auth.users row in Supabase Studio (invite by email).
 *   2. Insert a portal_authors row with slug + display_name + user_id.
 *   3. Add a matching entry here for the display copy.
 *   4. Create content/portal/{slug}/ with the seven MDX files.
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export type AuthorEntry = {
  slug: string
  name: string // canonical byline uses "Brett K. Moore" form with period after K on public-facing copy
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
    currentPhase: 'Phase 2 · Training Data Collection',
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

export type PortalAuthorRow = {
  id: string
  slug: string
  display_name: string
  book_title: string | null
  book_cover_url: string | null
  current_phase: number
  user_id: string | null
}

export async function fetchAuthorRowBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<PortalAuthorRow | null> {
  const { data } = await supabase
    .from('portal_authors')
    .select('id, slug, display_name, book_title, book_cover_url, current_phase, user_id')
    .eq('slug', slug)
    .maybeSingle()
  return (data as PortalAuthorRow | null) ?? null
}

export async function fetchAuthorRowForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<PortalAuthorRow | null> {
  const { data } = await supabase
    .from('portal_authors')
    .select('id, slug, display_name, book_title, book_cover_url, current_phase, user_id')
    .eq('user_id', userId)
    .maybeSingle()
  return (data as PortalAuthorRow | null) ?? null
}
