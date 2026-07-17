'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { getSupabaseBrowserClient } from '@/lib/portal/supabase-browser'

const ERR_COPY: Record<string, string> = {
  expired:
    'That link expired or was already used. Request a fresh one below.',
  missing_code:
    'That sign-in link is missing its code. Request a new one below.',
  no_author_row:
    'You signed in, but your account is not on the portal author list yet. Email brett@podcastnetwork.org and we will finish the setup.',
}

export default function PortalLoginPage() {
  const params = useSearchParams()
  const next = params.get('next')
  const err = params.get('err')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState<string | null>(null)

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setMessage(null)
    try {
      const res = await fetch('/api/portal/request-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, next }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong.')
        return
      }
      setStatus('sent')
    } catch {
      setStatus('error')
      setMessage('Network error. Try again.')
    }
  }

  async function onOAuth(provider: 'google' | 'apple') {
    setStatus('sending')
    setMessage(null)
    const supabase = getSupabaseBrowserClient()
    const origin =
      typeof window !== 'undefined' ? window.location.origin : ''
    const redirectTo = `${origin}/api/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ''
    }`
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    })
    if (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  const errCopy = err ? (ERR_COPY[err] ?? err) : null

  return (
    <div className="portal-scope min-h-screen bg-portal-cream text-portal-ink flex flex-col justify-center px-6 py-16">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-widest text-portal-muted hover:text-portal-ink"
        >
          PodcastNetwork.org
        </Link>
        <h1 className="mt-6 font-portal-serif text-3xl font-semibold tracking-tight text-portal-ink">
          Your portal.
        </h1>
        <p className="mt-3 text-base text-portal-muted">
          Sign in with the email you started with. We will send a link that
          keeps you signed in for the next 30 days on this device.
        </p>

        {errCopy && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {errCopy}
          </div>
        )}

        {status === 'sent' ? (
          <div className="mt-8 rounded-2xl border border-portal-line bg-white p-6">
            <h2 className="font-portal-serif text-lg font-semibold text-portal-ink">
              Check your inbox.
            </h2>
            <p className="mt-2 text-sm text-portal-muted">
              If <span className="font-medium">{email}</span> is on the portal list,
              a sign-in link is on its way. It works once and expires in 15 minutes.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-4 text-sm text-portal-ink underline underline-offset-4"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={onEmailSubmit} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-portal-ink"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-portal-line bg-white px-4 py-3 text-base text-portal-ink shadow-sm focus:border-portal-ink focus:outline-none focus:ring-2 focus:ring-portal-ink/10"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex w-full items-center justify-center rounded-xl bg-portal-ink px-5 py-3 text-sm font-semibold text-portal-cream shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === 'sending' ? 'Sending...' : 'Send my sign-in link'}
              </button>
              {status === 'error' && message && (
                <p className="text-sm text-red-700">{message}</p>
              )}
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-portal-line" />
              <span className="text-xs uppercase tracking-widest text-portal-muted">
                or
              </span>
              <div className="h-px flex-1 bg-portal-line" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onOAuth('google')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-portal-line bg-white px-4 py-3 text-sm font-medium text-portal-ink shadow-sm transition hover:bg-portal-cream"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z"/>
                  <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.5 7.4 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.6.4-2.4V6.5H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l4-3.1z"/>
                  <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.5 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"/>
                </svg>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => onOAuth('apple')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-portal-line bg-white px-4 py-3 text-sm font-medium text-portal-ink shadow-sm transition hover:bg-portal-cream"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
                  <path d="M17.5 12.5c0-2.9 2.4-4.3 2.5-4.4-1.4-2-3.5-2.3-4.3-2.3-1.8-.2-3.5 1.1-4.4 1.1-.9 0-2.3-1.1-3.8-1-2 0-3.8 1.1-4.8 2.9-2.1 3.6-.5 8.9 1.5 11.8 1 1.4 2.1 3 3.6 3 1.5-.1 2-.9 3.8-.9 1.8 0 2.2.9 3.8.9 1.6 0 2.6-1.4 3.6-2.9.7-1 1.4-2.2 1.7-3.5-2-.7-3.2-2.7-3.2-4.7zm-3-8.6c.8-1 1.4-2.4 1.2-3.9-1.2.1-2.7.8-3.5 1.8-.8.9-1.5 2.3-1.3 3.7 1.4.1 2.7-.7 3.6-1.6z"/>
                </svg>
                Continue with Apple
              </button>
            </div>
          </>
        )}

        <p className="mt-8 text-xs text-portal-muted">
          Trouble signing in? Email brett@podcastnetwork.org.
        </p>
      </div>
    </div>
  )
}
