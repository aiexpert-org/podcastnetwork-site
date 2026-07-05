'use client'

/**
 * Tier 2 of the two-tier diagnostic (locked 2026-07-04): a ten-step,
 * one-question-per-screen assessment. Email is captured at step nine, the
 * recommendation is computed server-side and rendered on screen. Question
 * copy is drafted per the locked question shape and awaits Brett's wording
 * pass; the flow, scoring, and CRM wiring do not change with copy edits.
 */

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/Button'
import { track } from '@/lib/track'

export type AssessmentAnswers = {
  role: string
  goal: string
  book: string
  audience: string
  tried: string
  outcome: string
  timeline: string
  budget: string
  email: string
  name: string
  extra: string
}

type Recommendation = {
  packageId: 'knowledge-panel-install' | 'pre-sold-author' | 'both'
  headline: string
  priceLine: string
  whyLines: string[]
}

type ChoiceStep = {
  kind: 'choice'
  key: keyof AssessmentAnswers
  question: string | ((a: Partial<AssessmentAnswers>) => string)
  options: { value: string; label: string }[]
}

type TextStep = {
  kind: 'text'
  key: keyof AssessmentAnswers
  question: string
  placeholder: string
  optional?: boolean
}

type EmailStep = {
  kind: 'email'
  key: 'email'
  question: string
}

type Step = ChoiceStep | TextStep | EmailStep

const STEPS: Step[] = [
  {
    kind: 'choice',
    key: 'role',
    question: 'Which of these is closest to you?',
    options: [
      { value: 'executive', label: 'Executive' },
      { value: 'author', label: 'Author, or becoming one' },
      { value: 'entrepreneur', label: 'Entrepreneur or founder' },
      { value: 'professional', label: 'Another kind of professional' },
    ],
  },
  {
    kind: 'choice',
    key: 'goal',
    question: 'What are you trying to accomplish?',
    options: [
      { value: 'authority', label: 'Google and AI engines should recognize me' },
      { value: 'pre-sell-book', label: 'Pre-sell a book before it launches' },
      { value: 'audience', label: 'Build an audience that compounds' },
      { value: 'other', label: 'Something else' },
    ],
  },
  {
    kind: 'choice',
    key: 'book',
    question: (a) =>
      a.role === 'author'
        ? 'Where is the book today?'
        : 'Do you have a book, or plans for one?',
    options: [
      { value: 'manuscript', label: 'Manuscript in hand' },
      { value: 'writing', label: 'Writing it now' },
      { value: 'planning', label: 'Planning one' },
      { value: 'none', label: 'No book plans' },
    ],
  },
  {
    kind: 'choice',
    key: 'audience',
    question:
      'How big is your monthly audience today? Count your largest surface: downloads, email list, or social.',
    options: [
      { value: 'none', label: 'Just getting started' },
      { value: 'under-1k', label: 'Under 1,000' },
      { value: '1k-10k', label: '1,000 to 10,000' },
      { value: '10k-plus', label: 'More than 10,000' },
    ],
  },
  {
    kind: 'choice',
    key: 'tried',
    question: 'Have you tried to fix this before?',
    options: [
      { value: 'agency', label: 'Hired an agency' },
      { value: 'self', label: 'Did it myself' },
      { value: 'no', label: 'This is the first attempt' },
    ],
  },
  {
    kind: 'text',
    key: 'outcome',
    question: 'What outcome would make this worth doing?',
    placeholder:
      'Optional, but it sharpens your recommendation. What has to be true in a year for this to have been worth it?',
    optional: true,
  },
  {
    kind: 'choice',
    key: 'timeline',
    question: 'When do you want to start?',
    options: [
      { value: 'now', label: 'Now' },
      { value: '90-days', label: 'Inside 90 days' },
      { value: '6-12-months', label: '6 to 12 months out' },
      { value: 'no-urgency', label: 'No urgency, just researching' },
    ],
  },
  {
    kind: 'choice',
    key: 'budget',
    question: 'What range would you invest to get the outcome you described?',
    options: [
      { value: 'under-5k', label: 'Under $5,000' },
      { value: '5-15k', label: '$5,000 to $15,000' },
      { value: '15-40k', label: '$15,000 to $40,000' },
      { value: '40k-plus', label: 'More than $40,000' },
      { value: 'depends', label: 'Depends on the expected return' },
    ],
  },
  {
    kind: 'email',
    key: 'email',
    question: 'Where should your recommendation live?',
  },
  {
    kind: 'text',
    key: 'extra',
    question: 'Anything else we should know?',
    placeholder: 'Optional. Context, constraints, or questions.',
    optional: true,
  },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-neutral-500 uppercase">
        <span>
          Question {Math.min(step + 1, total)} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Assessment progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100"
      >
        <div
          className="h-full rounded-full bg-solar transition-all duration-300"
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>
    </div>
  )
}

export function AssessmentFlow() {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<AssessmentAnswers>>({})
  const [textDraft, setTextDraft] = useState('')
  const [emailDraft, setEmailDraft] = useState('')
  const [nameDraft, setNameDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Recommendation | null>(null)

  const step = STEPS[stepIndex]
  const total = STEPS.length

  const question = useMemo(() => {
    if (!step) return ''
    return typeof step.question === 'function'
      ? step.question(answers)
      : step.question
  }, [step, answers])

  const advance = useCallback(
    (updated: Partial<AssessmentAnswers>) => {
      setAnswers(updated)
      setError(null)
      if (stepIndex === 0) track('assessment_start')
      track('assessment_step_complete')
      if (stepIndex < total - 1) {
        setStepIndex(stepIndex + 1)
        setTextDraft('')
      }
    },
    [stepIndex, total],
  )

  const submit = useCallback(
    async (finalAnswers: Partial<AssessmentAnswers>) => {
      setSubmitting(true)
      setError(null)
      track('assessment_submit')
      try {
        const res = await fetch('/api/assessment/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: finalAnswers }),
        })
        const json = await res.json()
        if (!res.ok) {
          setError(
            typeof json.error === 'string'
              ? json.error
              : 'Something went wrong. Try again.',
          )
        } else {
          setResult(json.recommendation as Recommendation)
        }
      } catch {
        setError('Something went wrong. Try again.')
      } finally {
        setSubmitting(false)
      }
    },
    [],
  )

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white p-8 ring-1 ring-neutral-950/10 sm:p-10"
      >
        <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
          Your recommendation
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-neutral-950">
          {result.headline}
        </h2>
        <p className="mt-2 text-base text-neutral-600">{result.priceLine}</p>
        <ul role="list" className="mt-6 space-y-3">
          {result.whyLines.map((line) => (
            <li key={line} className="flex gap-3 text-base text-neutral-600">
              <span aria-hidden="true" className="mt-1 text-neutral-950">
                &#8226;
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button href="/apply/">Start your application</Button>
          <Link
            href="/#packages"
            className="text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
          >
            Compare the two builds <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="rounded-3xl bg-white p-8 ring-1 ring-neutral-950/10 sm:p-10">
      <ProgressBar step={stepIndex} total={total} />

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          <h2 className="font-display text-2xl font-medium tracking-tight text-neutral-950">
            {question}
          </h2>

          {step.kind === 'choice' && (
            <div className="mt-6 grid grid-cols-1 gap-3">
              {step.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => advance({ ...answers, [step.key]: opt.value })}
                  className={clsx(
                    'rounded-2xl border px-5 py-4 text-left text-base transition',
                    answers[step.key] === opt.value
                      ? 'border-neutral-950 bg-neutral-950 text-white'
                      : 'border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step.kind === 'text' && (
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault()
                const value = textDraft.trim()
                if (!value && !step.optional) {
                  setError('A sentence or two helps us get this right.')
                  return
                }
                const updated = { ...answers, [step.key]: value }
                if (stepIndex === total - 1) {
                  setAnswers(updated)
                  void submit(updated)
                } else {
                  advance(updated)
                }
              }}
            >
              <label htmlFor={`assessment-${step.key}`} className="sr-only">
                {question}
              </label>
              <textarea
                id={`assessment-${step.key}`}
                rows={4}
                value={textDraft}
                onChange={(e) => setTextDraft(e.target.value)}
                placeholder={step.placeholder}
                maxLength={2000}
                className="block w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base text-neutral-950 transition placeholder:text-neutral-500 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5 focus:outline-hidden"
              />
              <div className="mt-4 flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="disabled:pointer-events-none disabled:opacity-60"
                >
                  {stepIndex === total - 1
                    ? submitting
                      ? 'Working out your fit'
                      : 'Get my recommendation'
                    : 'Continue'}
                </Button>
                {step.optional && stepIndex === total - 1 && (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      const updated = { ...answers, [step.key]: '' }
                      setAnswers(updated)
                      void submit(updated)
                    }}
                    className="text-sm font-semibold text-neutral-600 transition hover:text-neutral-950"
                  >
                    Skip and finish
                  </button>
                )}
              </div>
            </form>
          )}

          {step.kind === 'email' && (
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault()
                const email = emailDraft.trim()
                if (!EMAIL_RE.test(email)) {
                  setError('That email does not look complete.')
                  return
                }
                advance({ ...answers, email, name: nameDraft.trim() })
              }}
            >
              <p className="mt-2 text-sm text-neutral-600">
                Your recommendation renders on screen either way. The email is
                where the follow-up conversation starts if you want one.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <div>
                  <label htmlFor="assessment-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="assessment-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name (optional)"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    className="block w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base text-neutral-950 transition placeholder:text-neutral-500 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="assessment-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="assessment-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    className="block w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base text-neutral-950 transition placeholder:text-neutral-500 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5 focus:outline-hidden"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}

          {error && (
            <p role="alert" className="mt-4 text-sm text-neutral-700">
              {error}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between border-t border-neutral-950/10 pt-4">
        <button
          type="button"
          onClick={() => {
            if (stepIndex > 0) {
              setStepIndex(stepIndex - 1)
              setError(null)
              const prev = STEPS[stepIndex - 1]
              if (prev.kind === 'text') {
                setTextDraft((answers[prev.key] as string) ?? '')
              }
            }
          }}
          disabled={stepIndex === 0 || submitting}
          className="text-sm font-semibold text-neutral-600 transition hover:text-neutral-950 disabled:pointer-events-none disabled:opacity-40"
        >
          Back
        </button>
        <p className="text-xs text-neutral-500">
          About three minutes. No payment details, no commitment.
        </p>
      </div>
    </div>
  )
}
