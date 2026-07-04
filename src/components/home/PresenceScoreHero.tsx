'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/Button'
import { track } from '@/lib/track'
import type {
  PresenceCheck,
  PresenceScoreReport,
} from '@/app/api/presence-score/route'

const LOADING_PHASES = [
  'Reading your page',
  'Asking Google Knowledge Graph',
  'Checking Wikidata and Wikipedia',
  'Scoring the gaps',
]

const FIX_LABELS: Record<NonNullable<PresenceCheck['fix']>, string> = {
  kp: 'Fixed by the Knowledge Panel Install',
  psa: 'Fixed by the Pre-Sold Author Package',
  both: 'Fixed by both packages',
}

function bandLine(report: PresenceScoreReport): string {
  if (report.band === 'low') {
    return 'Google barely knows this identity exists. Every signal below is buildable, and each one maps to one of the two packages.'
  }
  if (report.band === 'medium') {
    return 'A partial footprint. Some surfaces corroborate this identity; the missing ones below are what keep a knowledge panel from resolving.'
  }
  return 'A strong footprint. The remaining gaps below are the difference between visible and unmistakable.'
}

function CheckRow({ check }: { check: PresenceCheck }) {
  const passed = check.points === check.max
  return (
    <li className="flex gap-4 py-4">
      <span
        aria-hidden="true"
        className={clsx(
          'mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-bold',
          passed
            ? 'bg-solar text-neutral-950'
            : 'bg-neutral-100 text-neutral-500 ring-1 ring-neutral-950/10',
        )}
      >
        {passed ? '✓' : '✕'}
      </span>
      <div>
        <p className="text-sm font-semibold text-neutral-950">
          {check.label}
          <span className="ml-2 font-mono text-xs font-medium text-neutral-500">
            {check.points}/{check.max}
          </span>
        </p>
        <p className="mt-1 text-sm text-neutral-600">{check.detail}</p>
        {check.fix && (
          <p className="mt-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {FIX_LABELS[check.fix]}
          </p>
        )}
      </div>
    </li>
  )
}

export function PresenceScoreHero() {
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done' | 'error'>(
    'idle',
  )
  const [phaseLabel, setPhaseLabel] = useState(LOADING_PHASES[0])
  const [report, setReport] = useState<PresenceScoreReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!url.trim() || phase === 'loading') return

      setPhase('loading')
      setError(null)
      setReport(null)
      track('presence_score_run')

      let phaseIndex = 0
      const ticker = window.setInterval(() => {
        phaseIndex = Math.min(phaseIndex + 1, LOADING_PHASES.length - 1)
        setPhaseLabel(LOADING_PHASES[phaseIndex])
      }, 2500)

      try {
        const res = await fetch(
          `/api/presence-score/?url=${encodeURIComponent(url.trim())}`,
        )
        const json = await res.json()
        if (!res.ok) {
          setError(
            typeof json.error === 'string'
              ? json.error
              : 'Something went wrong. Try again.',
          )
          setPhase('error')
        } else {
          setReport(json as PresenceScoreReport)
          setPhase('done')
        }
      } catch {
        setError('Something went wrong. Try again.')
        setPhase('error')
      } finally {
        window.clearInterval(ticker)
        setPhaseLabel(LOADING_PHASES[0])
      }
    },
    [url, phase],
  )

  return (
    <div className="mt-10 max-w-2xl">
      <form onSubmit={submit} aria-label="Get your Google Knowledge Presence Score">
        <div className="flex flex-col gap-4 sm:flex-row">
          <label htmlFor="presence-url" className="sr-only">
            Your website or LinkedIn URL
          </label>
          <input
            id="presence-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="your-site.com or linkedin.com/in/you"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="block w-full rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-base text-neutral-950 transition placeholder:text-neutral-500 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5 focus:outline-hidden"
          />
          <Button
            type="submit"
            disabled={phase === 'loading' || !url.trim()}
            className="flex-none justify-center px-6 py-4 text-base disabled:pointer-events-none disabled:opacity-60 sm:py-0"
          >
            {phase === 'loading' ? phaseLabel : 'Get my score'}
          </Button>
        </div>
      </form>
      <p className="mt-3 text-xs text-neutral-500">
        Runs against the same public surfaces Google reads. Nothing is stored
        beyond a short cache; no signup required.
      </p>

      <AnimatePresence>
        {phase === 'error' && error && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-2xl bg-neutral-100 px-5 py-4 text-sm text-neutral-700"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        {report && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-neutral-950/10 sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
                  Google Knowledge Presence Score
                </p>
                <p className="mt-2 font-display text-5xl font-medium tracking-tight text-neutral-950">
                  {report.score}
                  <span className="text-2xl text-neutral-400">
                    /{report.max}
                  </span>
                </p>
              </div>
              <p className="text-sm text-neutral-600">
                Scored for{' '}
                <span className="font-semibold text-neutral-950">
                  {report.entityName}
                </span>
              </p>
            </div>

            <p className="mt-4 text-sm text-neutral-600">{bandLine(report)}</p>

            <ul
              role="list"
              className="mt-6 divide-y divide-neutral-950/5 border-t border-neutral-950/10"
            >
              {report.checks.map((check) => (
                <CheckRow key={check.id} check={check} />
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-neutral-950/10 pt-6">
              <Button href="/apply">Get the full diagnostic</Button>
              <Link
                href="/knowledge-panel-install"
                className="text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
              >
                See what the fixes cost{' '}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
