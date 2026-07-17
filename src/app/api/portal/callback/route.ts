import { NextRequest, NextResponse } from 'next/server'

import {
  PORTAL_SESSION_COOKIE,
  PORTAL_SESSION_MAX_AGE_S,
  createPortalSession,
  verifyMagicLinkToken,
} from '@/lib/portal/auth'

export const runtime = 'nodejs'

/*
 * GET /api/portal/callback?token=...
 *
 * The magic link points here. We verify the token, mint a session cookie,
 * and 302 to the ?next= path (or the author's dashboard).
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/portal/login/?err=missing', request.url))
  }

  const payload = await verifyMagicLinkToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL('/portal/login/?err=expired', request.url))
  }

  const session = await createPortalSession(payload.email, payload.authorSlug)
  const destination =
    payload.next && payload.next.startsWith('/portal/')
      ? payload.next
      : `/portal/${payload.authorSlug}/`

  const response = NextResponse.redirect(new URL(destination, request.url))
  response.cookies.set(PORTAL_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: PORTAL_SESSION_MAX_AGE_S,
  })
  return response
}
