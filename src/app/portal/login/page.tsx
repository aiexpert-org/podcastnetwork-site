'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PortalLoginPage() {
  const params = useSearchParams()
  const next = params.get('next')
  const err = params.get('err')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
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

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center px-6 py-16">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-900">
          PodcastNetwork.org
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-950">
          Your portal
        </h1>
        <p className="mt-3 text-base text-neutral-600">
          Enter the email you signed up with. We&#39;ll send a link that signs you
          in for the next 30 days on this device.
        </p>

        {err === 'expired' && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            That link expired or was already used. Request a fresh one below.
          </div>
        )}

        {status === 'sent' ? (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-950">Check your inbox</h2>
            <p className="mt-2 text-sm text-neutral-600">
              If <span className="font-medium">{email}</span> is on the portal list,
              a sign-in link is on its way. It works once and expires in 15 minutes.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-4 text-sm text-neutral-700 underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-950 shadow-sm focus:border-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950/10"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex w-full items-center justify-center rounded-xl bg-solar px-5 py-3 text-sm font-semibold text-neutral-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {status === 'sending' ? 'Sending...' : 'Send my sign-in link'}
            </button>
            {status === 'error' && message && (
              <p className="text-sm text-red-700">{message}</p>
            )}
          </form>
        )}

        <p className="mt-8 text-xs text-neutral-500">
          Trouble signing in? Email brett@podcastnetwork.org.
        </p>
      </div>
    </div>
  )
}
