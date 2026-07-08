'use client'

/**
 * Instant Presence Report (Tier 1 of the two-tier diagnostic).
 *
 * File name retained through the v0.6.4 pivot to keep the diff reviewable;
 * rename to InstantReport.tsx in the post-pitch cleanup. Real findings
 * only, no email gate, each miss labeled with the build that fixes it.
 * Copy per the 2026-07-05 homepage copy lock: results header, helper
 * line, placeholder. The Tier 2 transition was rewritten per Brett's
 * 2026-07-07 ruling: the locked ten-questions/recommendation wording
 * broke the quiz rules (no question counts; review, never
 * recommendation), and the quiz rules win.
 */

import { useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/Button'
import { track } from '@/lib/track'
import type {
  FindingStatus,
  PresenceFinding,
  InstantReportPayload,
} from '@/app/api/presence-score/route'

const LOADING_PHASES = [
  'Reading your page',
  'Asking Google Knowledge Graph',
  'Checking Wikidata and Wikipedia',
  'Checking Google AI Overviews',
  'Writing your findings',
]

const FIX_LABELS: Record<NonNullable<PresenceFinding['fix']>, string> = {
  kp: 'Fixed by the Brand SERP Build',
  psa: 'Fixed by the Pre-Sold Author Build',
  both: 'Fixed by both builds',
}

type SeoState =
  | { phase: 'pending' }
  | { phase: 'done'; seoScore: number }
  | { phase: 'unavailable' }

const STATUS_LABEL: Record<FindingStatus, string> = {
  found: 'Found',
  partial: 'Partial',
  missing: 'Missing',
  unavailable: 'Retry',
}

function StatusChip({
  status,
  pulse = false,
  label,
}: {
  status: FindingStatus | 'checking'
  pulse?: boolean
  label?: string
}) {
  const text =
    label ?? (status === 'checking' ? 'Checking' : STATUS_LABEL[status])
  return (
    <span
      className={clsx(
        'mt-0.5 inline-flex h-6 flex-none items-center justify-center rounded-full px-2.5 text-[11px] font-semibold tracking-wide uppercase',
        status === 'found' && 'bg-solar text-neutral-950',
        status === 'partial' &&
          'bg-white text-neutral-700 ring-1 ring-neutral-950/20',
        (status === 'missing' || status === 'unavailable') &&
          'bg-neutral-100 text-neutral-500 ring-1 ring-neutral-950/10',
        status === 'checking' &&
          'bg-neutral-100 text-neutral-500 ring-1 ring-neutral-950/10',
        pulse && 'animate-pulse',
      )}
    >
      {text}
    </span>
  )
}

function FindingRow({
  label,
  status,
  evidence,
  detail,
  fixLabel,
  pulse = false,
}: {
  label: string
  status: FindingStatus | 'checking'
  evidence?: string | null
  detail: string
  fixLabel?: string | null
  pulse?: boolean
}) {
  return (
    <li className="flex gap-4 py-4">
      <StatusChip status={status} pulse={pulse} />
      <div>
        <p className="text-sm font-semibold text-neutral-950">
          {label}
          {evidence && (
            <span className="ml-2 font-mono text-xs font-medium text-neutral-500">
              {evidence}
            </span>
          )}
        </p>
        <p className="mt-1 text-sm text-neutral-600">{detail}</p>
        {fixLabel && (
          <p className="mt-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {fixLabel}
          </p>
        )}
      </div>
    </li>
  )
}

export function InstantReport() {
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done' | 'error'>(
    'idle',
  )
  const [phaseLabel, setPhaseLabel] = useState(LOADING_PHASES[0])
  const [report, setReport] = useState<InstantReportPayload | null>(null)
  const [seo, setSeo] = useState<SeoState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const runIdRef = useRef(0)

  const fetchSeo = useCallback(async (input: string, runId: number) => {
    setSeo({ phase: 'pending' })
    try {
      const res = await fetch(
        `/api/seo-score/?url=${encodeURIComponent(input)}`,
        { signal: AbortSignal.timeout(50_000) },
      )
      if (runIdRef.current !== runId) return
      if (!res.ok) {
        setSeo({ phase: 'unavailable' })
        return
      }
      const json = (await res.json()) as {
        status: 'ok' | 'unavailable'
        seoScore?: number
      }
      if (json.status === 'ok' && typeof json.seoScore === 'number') {
        setSeo({ phase: 'done', seoScore: json.seoScore })
      } else {
        setSeo({ phase: 'unavailable' })
      }
    } catch {
      if (runIdRef.current === runId) setSeo({ phase: 'unavailable' })
    }
  }, [])

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!url.trim() || phase === 'loading') return

      const runId = ++runIdRef.current
      setPhase('loading')
      setError(null)
      setReport(null)
      setSeo(null)
      track('instant_report_run')

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
          const payload = json as InstantReportPayload
          setReport(payload)
          setPhase('done')
          track('instant_report_done')
          if (payload.inputKind === 'website') {
            void fetchSeo(payload.input, runId)
          }
        }
      } catch {
        setError('Something went wrong. Try again.')
        setPhase('error')
      } finally {
        window.clearInterval(ticker)
        setPhaseLabel(LOADING_PHASES[0])
      }
    },
    [url, phase, fetchSeo],
  )

  // Server findings render in a fixed order; the Lighthouse row slots in
  // after the owned-schema row for website inputs.
  const beforeSeo = report?.findings.slice(0, 3) ?? []
  const afterSeo = report?.findings.slice(3) ?? []
  const seoResolved = report?.inputKind === 'website' && seo?.phase === 'done'
  const seoFound = seoResolved && seo!.seoScore >= 90

  return (
    <div className="mt-10 max-w-2xl">
      <form onSubmit={submit} aria-label="Run your instant presence report">
        <div className="flex flex-col gap-4 sm:flex-row">
          <label htmlFor="presence-url" className="sr-only">
            Your website or LinkedIn URL
          </label>
          <input
            id="presence-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="Enter your website or LinkedIn profile URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="block w-full rounded-xl border border-neutral-300 bg-white px-6 py-4 text-base text-neutral-950 transition placeholder:text-neutral-500 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5 focus:outline-hidden"
          />
          <Button
            type="submit"
            disabled={phase === 'loading' || !url.trim()}
            className="flex-none justify-center px-6 py-4 text-base disabled:pointer-events-none disabled:opacity-60 sm:py-0"
          >
            {phase === 'loading' ? phaseLabel : 'Run my report'}
          </Button>
        </div>
      </form>
      <p className="mt-3 text-xs text-neutral-500">
        Free. Real data. Five seconds. No signup.
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
                  Here’s what they know.
                </p>
                <p className="mt-2 font-display text-2xl font-medium tracking-tight text-neutral-950">
                  {report.entityName}
                </p>
              </div>
              <p className="text-sm text-neutral-600">
                {report.findings.filter((f) => f.status === 'found').length +
                  (seoFound ? 1 : 0)}{' '}
                of {report.findings.length + (seoResolved ? 1 : 0)} signals in
                place
              </p>
            </div>

            <ul
              role="list"
              className="mt-6 divide-y divide-neutral-950/5 border-t border-neutral-950/10"
            >
              {beforeSeo.map((f) => (
                <FindingRow
                  key={f.id}
                  label={f.label}
                  status={f.status}
                  evidence={f.evidence}
                  detail={f.detail}
                  fixLabel={f.fix ? FIX_LABELS[f.fix] : null}
                />
              ))}

              {report.inputKind === 'website' && seo && seo.phase !== 'unavailable' && (
                <FindingRow
                  label="Lighthouse SEO score"
                  status={
                    seo.phase === 'pending'
                      ? 'checking'
                      : seo.phase === 'done'
                        ? seo.seoScore >= 90
                          ? 'found'
                          : 'partial'
                        : 'unavailable'
                  }
                  pulse={seo.phase === 'pending'}
                  evidence={
                    seo.phase === 'done' ? `${seo.seoScore}/100` : null
                  }
                  detail={
                    seo.phase === 'pending'
                      ? 'Running a live Lighthouse audit against your page. This one takes up to 30 seconds.'
                      : seo.phase === 'done'
                        ? seo.seoScore >= 90
                          ? 'Your page passes the technical SEO floor Lighthouse checks for.'
                          : 'Lighthouse found technical SEO gaps on your page. Crawlability and metadata are part of the discovery floor.'
                        : 'The Lighthouse audit did not complete for this scan. Run the report again in a minute.'
                  }
                  fixLabel={
                    seo.phase === 'done' && seo.seoScore < 90
                      ? FIX_LABELS.kp
                      : null
                  }
                />
              )}

              {afterSeo.map((f) => (
                <FindingRow
                  key={f.id}
                  label={f.label}
                  status={f.status}
                  evidence={f.evidence}
                  detail={f.detail}
                  fixLabel={f.fix ? FIX_LABELS[f.fix] : null}
                />
              ))}
            </ul>

            <div className="mt-6 border-t border-neutral-950/10 pt-6">
              <p className="text-sm text-neutral-600">
                Want to see what your specific fix looks like? Five minutes,
                and you&apos;ll know.
              </p>
              <div className="mt-4">
                <Button href="/assessment/">
                  Continue <span aria-hidden="true">&rarr;</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
