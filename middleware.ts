import { NextRequest, NextResponse } from 'next/server'
import { verifyPortalSession } from '@/lib/portal/auth'

/*
 * Client Portal auth wall. Every /portal/* path except /portal/login/ and
 * the /api/portal/* routes is gated by an HMAC-signed session cookie.
 *
 * The session cookie (pn_portal_session) carries {email, authorSlug,
 * issuedAt, expiresAt}. Middleware runs on the Edge runtime, so the
 * verification path uses Web Crypto (subtle.HMAC) — no Node crypto import.
 *
 * If the cookie is missing or invalid, we bounce to /portal/login/ with a
 * ?next= param so the callback can return the visitor to the page they were
 * asking for.
 */
export const config = {
  matcher: ['/portal/:path*'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Login page is public.
  if (pathname === '/portal/login' || pathname === '/portal/login/') {
    return NextResponse.next()
  }

  const cookie = request.cookies.get('pn_portal_session')
  const session = cookie ? await verifyPortalSession(cookie.value) : null

  if (!session) {
    const loginUrl = new URL('/portal/login/', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Enforce that the authorSlug in the URL matches the session's slug — no
  // sideways access to another author's portal via URL guessing.
  const match = pathname.match(/^\/portal\/([^/]+)/)
  if (match && match[1] !== 'login' && session.authorSlug !== match[1]) {
    return NextResponse.redirect(
      new URL(`/portal/${session.authorSlug}/`, request.url),
    )
  }

  return NextResponse.next()
}
