import { NextRequest, NextResponse } from 'next/server'

import { PORTAL_SESSION_COOKIE } from '@/lib/portal/auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/portal/login/', request.url), 303)
  response.cookies.set(PORTAL_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}

export async function GET(request: NextRequest) {
  return POST(request)
}
