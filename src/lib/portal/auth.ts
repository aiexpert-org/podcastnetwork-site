/*
 * Portal session + magic-link tokens. Web Crypto HMAC-SHA256, base64url
 * encoded so both the Edge runtime (middleware) and the Node runtime
 * (route handlers) can call the same helpers without importing node:crypto.
 *
 * Session cookie: pn_portal_session, 30-day TTL, HttpOnly + Secure + SameSite=Lax.
 * Magic link token: 15-minute TTL, single-hop (embedded in the callback URL).
 */

export type PortalSession = {
  email: string
  authorSlug: string
  issuedAt: number
  expiresAt: number
}

export type MagicLinkPayload = {
  email: string
  authorSlug: string
  next: string | null
  issuedAt: number
  expiresAt: number
}

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000
const MAGIC_TTL_MS = 15 * 60 * 1000

function getSecret(): string {
  const secret = process.env.PORTAL_SESSION_SECRET
  if (!secret) {
    throw new Error(
      'PORTAL_SESSION_SECRET is not set — the portal cannot sign tokens.',
    )
  }
  return secret
}

function base64url(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload),
  )
  return base64url(new Uint8Array(sig))
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

async function sign(payload: object): Promise<string> {
  const json = JSON.stringify(payload)
  const body = base64url(new TextEncoder().encode(json))
  const sig = await hmac(body)
  return `${body}.${sig}`
}

async function verify<T>(token: string): Promise<T | null> {
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [body, sig] = parts
  const expected = await hmac(body)
  if (!constantTimeEqual(sig, expected)) return null
  try {
    const json = new TextDecoder().decode(base64urlDecode(body))
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

export async function createPortalSession(
  email: string,
  authorSlug: string,
): Promise<string> {
  const now = Date.now()
  return sign({
    email,
    authorSlug,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  } satisfies PortalSession)
}

export async function verifyPortalSession(
  token: string,
): Promise<PortalSession | null> {
  const session = await verify<PortalSession>(token)
  if (!session) return null
  if (Date.now() > session.expiresAt) return null
  return session
}

export async function createMagicLinkToken(
  email: string,
  authorSlug: string,
  next: string | null = null,
): Promise<string> {
  const now = Date.now()
  return sign({
    email,
    authorSlug,
    next,
    issuedAt: now,
    expiresAt: now + MAGIC_TTL_MS,
  } satisfies MagicLinkPayload)
}

export async function verifyMagicLinkToken(
  token: string,
): Promise<Pick<MagicLinkPayload, 'email' | 'authorSlug' | 'next'> | null> {
  const payload = await verify<MagicLinkPayload>(token)
  if (!payload) return null
  if (Date.now() > payload.expiresAt) return null
  return {
    email: payload.email,
    authorSlug: payload.authorSlug,
    next: payload.next,
  }
}

export const PORTAL_SESSION_COOKIE = 'pn_portal_session'
export const PORTAL_SESSION_MAX_AGE_S = Math.floor(SESSION_TTL_MS / 1000)
