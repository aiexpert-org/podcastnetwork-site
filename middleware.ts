import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

/*
 * Client Portal auth wall (v0.2). Every /portal/* path except
 * /portal/login/ is gated by a Supabase session cookie.
 *
 * @supabase/ssr's createServerClient reads and refreshes the session
 * cookies (sb-*-auth-token) on Edge. Missing or expired session bounces
 * to /portal/login/ with a ?next= param.
 *
 * The URL-slug guard from v0.1 stays as defense-in-depth: the slug in
 * the URL must match the portal_authors row that owns the current user.
 * If it does not match, redirect to the correct slug.
 */
export const config = {
  matcher: ['/portal/:path*'],
}

type CookieRecord = { name: string; value: string; options?: CookieOptions }

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/portal/login' || pathname === '/portal/login/') {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieRecord[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/portal/login/', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Slug guard. The signed-in user's portal_authors row owns exactly one
  // slug. If the URL asks for a different slug, redirect to their own.
  const match = pathname.match(/^\/portal\/([^/]+)/)
  if (match && match[1] !== 'login') {
    const { data: author } = await supabase
      .from('portal_authors')
      .select('slug')
      .eq('user_id', user.id)
      .maybeSingle()

    if (author?.slug && author.slug !== match[1]) {
      return NextResponse.redirect(
        new URL(`/portal/${author.slug}/`, request.url),
      )
    }
  }

  return response
}
