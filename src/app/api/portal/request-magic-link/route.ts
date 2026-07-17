import { NextRequest, NextResponse } from 'next/server'

import { createMagicLinkToken } from '@/lib/portal/auth'
import { findAuthorByEmail } from '@/lib/portal/authors'
import { sendMagicLink } from '@/lib/portal/mail'
import { siteConfig } from '@/lib/site-config'

export const runtime = 'nodejs'

/*
 * POST /api/portal/request-magic-link
 * Body: { email: string, next?: string }
 *
 * Always returns 200 so we don't leak which emails are on the allowlist. If
 * the email matches a portal author, we sign a token, send the link via
 * Resend, and log delivery mode. Otherwise we silently drop.
 */
export async function POST(request: NextRequest) {
  let body: { email?: string; next?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const next = typeof body.next === 'string' && body.next.startsWith('/portal/') ? body.next : null

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Enter a valid email.' }, { status: 400 })
  }

  const author = findAuthorByEmail(email)
  if (!author) {
    // Silent success — no enumeration.
    return NextResponse.json({ ok: true })
  }

  const token = await createMagicLinkToken(email, author.slug, next)
  const callback = new URL('/api/portal/callback', siteConfig.url)
  callback.searchParams.set('token', token)

  const result = await sendMagicLink(email, callback.toString(), author.name)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: 'Mail dispatch failed.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
