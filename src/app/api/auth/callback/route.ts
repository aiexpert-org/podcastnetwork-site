import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/portal/supabase-server'

/*
 * Supabase auth callback. Handles magic-link redirects and OAuth (Google,
 * Apple) round-trips. Exchanges the ?code= for a session, then bounces to
 * either ?next= or the authenticated user's portal slug.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (!code) {
    return NextResponse.redirect(`${origin}/portal/login/?err=missing_code`)
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      `${origin}/portal/login/?err=${encodeURIComponent(error.message)}`,
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    if (next && next.startsWith('/portal/')) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    const { data: author } = await supabase
      .from('portal_authors')
      .select('slug')
      .eq('user_id', user.id)
      .maybeSingle()
    if (author?.slug) {
      return NextResponse.redirect(`${origin}/portal/${author.slug}/`)
    }
  }

  return NextResponse.redirect(`${origin}/portal/login/?err=no_author_row`)
}
