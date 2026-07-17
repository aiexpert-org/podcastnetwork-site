import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

type CookieRecord = { name: string; value: string; options?: CookieOptions }

/*
 * Server-side Supabase client for Server Components + Route Handlers.
 * Uses the request's cookie store so the current portal session is
 * visible to auth.getUser() and RLS-scoped queries.
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieRecord[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Called from a Server Component that cannot set cookies. Fine
            // to ignore, the middleware refresh path already writes them.
          }
        },
      },
    },
  )
}

/*
 * Service-role client. Bypasses RLS. Only import from server-side files
 * that need admin access (webhooks, admin routes, sync workers). The
 * service role key must never reach the browser bundle.
 */
export function getSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}
