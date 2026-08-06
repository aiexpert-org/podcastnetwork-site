import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/portal/supabase-server'

/*
 * Magic-link entry point. Supabase generates and sends the email through
 * its built-in dispatcher. shouldCreateUser is false so only invited
 * authors get a link; unknown addresses get a silent no-op response and
 * we return the same "check your inbox" shape either way so the login
 * page cannot be used to probe the author list.
 */
export async function POST(request: Request) {
  let email = ''
  let next: string | null = null
  try {
    const body = await request.json()
    email = String(body.email ?? '').trim().toLowerCase()
    next = body.next ?? null
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request.' },
      { status: 400 },
    )
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { ok: false, error: 'Enter a valid email.' },
      { status: 400 },
    )
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    new URL(request.url).origin

  const redirectTo = `${origin}/api/auth/callback${
    next ? `?next=${encodeURIComponent(next)}` : ''
  }`

  const supabase = await getSupabaseServerClient()
  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: false,
    },
  })

  return NextResponse.json({ ok: true })
}
