'use client'

import { createBrowserClient } from '@supabase/ssr'

/*
 * Browser Supabase client. Used by the login page for OAuth handoff
 * (Google, Apple) and by the quiz runner to read the current user.
 */
export function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
