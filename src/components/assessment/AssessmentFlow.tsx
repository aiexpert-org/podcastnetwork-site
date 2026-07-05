'use client'

/**
 * The Google Authority Quiz (v0.6.12, per Brett): ask-guess-reveal.
 *
 * Six teaching beats, two situation questions, one informed WTP question,
 * then contact details. The outcome is a briefing, never a package
 * recommendation: the visitor teaches themselves why the entity layer
 * matters and leaves with buying criteria that travel with them.
 *
 * Rules locked while Brett walked the flow: every quiz question carries
 * exactly three substantive options plus an honest "I'm not sure" that is
 * never scolded; the podcast beat sits at position 2 so early drop-off
 * still learns why the company carries its name.
 *
 * Every reveal is a verifiable claim. Sources, checked 2026-07-04:
 * - Google, About knowledge panels: "automatically generated", information
 *   "comes from various sources across the web"
 *   (support.google.com/knowledgepanel/answer/9163198)
 * - Google Search Central spam policies: buying links violates policy
 *   (developers.google.com/search/docs/essentials/spam-policies)
 * - Kalicube published pricing: done-for-you service starts at $12,000;
 *   reputable range $3,000 to $18,000 (kalicube.com pricing FAQ pages)
 */

import { useCallback, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/Button'
import { track } from '@/lib/track'

type QuizStep = {
  kind: 'quiz'
  key: string
  question: string
  options: { value: string; label: string }[]
  correct: string
  reveal: string
}

type ChoiceStep = {
  kind: 'choice'
  key: string
  question: string
  options: { value: string; label: string }[]
}

type ContactStep = { kind: 'contact'; key: 'contact'; question: string }

type Step = QuizStep | ChoiceStep | ContactStep

const NOT_SURE = { value: 'not-sure', label: "I'm not sure" }

const STEPS: Step[] = [
  {
    kind: 'quiz',
    key: 'q_panel',
    question:
      'When someone Googles a name, what decides whether the information box on the right (the Knowledge Panel) appears?',
    options: [
      { value: 'paid', label: 'Google sells that space' },
      { value: 'earned', label: 'Google decides it has enough proof the person is real' },
      { value: 'anyone', label: 'It appears for anyone with a website' },
      NOT_SURE,
    ],
    correct: 'earned',
    reveal:
      'It is earned. Google’s Knowledge Graph builds an entity for you only when enough corroborated, machine-readable proof exists across the web. Nobody can buy the box, and the proof does not assemble itself: it gets built signal by signal across a dozen surfaces, in the right order. The rest of this quiz shows you what those signals are.',
  },
  {
    kind: 'quiz',
    key: 'q_mechanism',
    question:
      'Which single activity feeds several of the sources Google reads, all at once?',
    options: [
      { value: 'press', label: 'A press release blast' },
      { value: 'podcast', label: 'Hosting a podcast' },
      { value: 'backlinks', label: 'Buying backlinks' },
      NOT_SURE,
    ],
    correct: 'podcast',
    reveal:
      'A podcast. Google’s own help pages say knowledge panels are automatically generated and their information comes from various sources across the web. One show feeds several of those sources at once: the credit earns an IMDb Person page, every guest appearance adds a citation on someone else’s site, and every episode is indexable content in your own voice. A press release is a single self-published source, and buying links violates Google’s published spam policies. This mechanism is why we are built around podcasts.',
  },
  {
    kind: 'quiz',
    key: 'q_seed',
    question:
      'Which of these does Google trust most as the seed of a Knowledge Panel?',
    options: [
      { value: 'website', label: 'Your website' },
      { value: 'wikidata', label: 'Wikidata' },
      { value: 'linkedin', label: 'Your LinkedIn profile' },
      NOT_SURE,
    ],
    correct: 'wikidata',
    reveal:
      'Wikidata: a structured database most people have never heard of. A Q-number there is the root a panel grows from. Your own site matters as the Entity Home, and social profiles are rented ground that Google reads last.',
  },
  {
    kind: 'quiz',
    key: 'q_ai',
    question:
      'When someone asks ChatGPT or Gemini who you are, where does that answer mostly come from?',
    options: [
      { value: 'made-up', label: 'The AI invents it' },
      { value: 'entity-data', label: 'The same public entity data and citations Google reads' },
      { value: 'social', label: 'Your social media posts' },
      NOT_SURE,
    ],
    correct: 'entity-data',
    reveal:
      'Largely the same entity layer Google reads: structured data, citations, and corroborated facts. Thin entity data produces vague or wrong AI answers about you. Fix the layer once and search results and AI answers both improve.',
  },
  {
    kind: 'quiz',
    key: 'q_wikipedia',
    question: 'Can a vendor guarantee you a Wikipedia page?',
    options: [
      { value: 'pay', label: 'Yes, if you pay enough' },
      { value: 'no-guarantee', label: 'No. Wikipedia decides, and no vendor controls it' },
      { value: 'celebrity', label: 'Only if you are a celebrity' },
      NOT_SURE,
    ],
    correct: 'no-guarantee',
    reveal:
      'Nobody can guarantee Wikipedia. Volunteer editors and a notability bar decide, and no vendor controls them. A Knowledge Panel does not depend on Wikipedia, and anyone promising you a page is telling you something false. Treat that promise as the tell.',
  },
  {
    kind: 'quiz',
    key: 'q_market',
    question:
      'What do specialist firms typically charge to build and manage a Knowledge Panel?',
    options: [
      { value: 'five-hundred', label: '$500 or less' },
      { value: 'two-k', label: 'Around $2,000' },
      { value: 'three-to-eighteen', label: '$3,000 to $18,000' },
      NOT_SURE,
    ],
    correct: 'three-to-eighteen',
    reveal:
      'Reputable services run roughly $3,000 to $18,000, and the category leader’s done-for-you panel service starts at $12,000, typically for the entity work alone. A podcast, press placements, IMDb, and a year of monthly verification usually cost extra, when they are offered at all. Cheaper than that range is where the spam lives.',
  },
  {
    kind: 'choice',
    key: 'role',
    question: 'Which of these is closest to you?',
    options: [
      { value: 'executive', label: 'Executive' },
      { value: 'author', label: 'Author, or planning a book' },
      { value: 'entrepreneur', label: 'Entrepreneur or founder' },
      { value: 'professional', label: 'Another kind of professional' },
    ],
  },
  {
    kind: 'choice',
    key: 'book',
    question: 'Where does a book fit for you?',
    options: [
      { value: 'published', label: 'Published before' },
      { value: 'writing', label: 'Writing or planning one now' },
      { value: 'someday', label: 'Someday, maybe' },
      { value: 'none', label: 'No book plans' },
    ],
  },
  {
    kind: 'choice',
    key: 'budget',
    question:
      'Knowing what you know now, what would a done-for-you authority build be worth to you?',
    options: [
      { value: 'under-5k', label: 'Under $5,000' },
      { value: '5-15k', label: '$5,000 to $15,000' },
      { value: '15-40k', label: '$15,000 to $40,000' },
      { value: '40k-plus', label: 'More than $40,000' },
      { value: 'depends', label: 'Depends on the expected return' },
    ],
  },
  {
    kind: 'contact',
    key: 'contact',
    question: 'Who is this briefing for?',
  },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type Briefing = {
  score: number
  scoreLine: string
  knowNow: string[]
  startingPoint: string
  market: string
  demands: string[]
  psa: string | null
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-neutral-500 uppercase">
        <span>
          Step {Math.min(step + 1, total)} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Quiz progress"
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
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [briefing, setBriefing] = useState<Briefing | null>(null)

  const step = STEPS[stepIndex]
  const total = STEPS.length

  const advance = useCallback(() => {
    setRevealed(false)
    setError(null)
    if (stepIndex < total - 1) setStepIndex(stepIndex + 1)
  }, [stepIndex, total])

  const submit = useCallback(
    async (finalAnswers: Record<string, string>) => {
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
          setBriefing(json.briefing as Briefing)
        }
      } catch {
        setError('Something went wrong. Try again.')
      } finally {
        setSubmitting(false)
      }
    },
    [],
  )

  if (briefing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white p-8 ring-1 ring-neutral-950/10 sm:p-10"
      >
        <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
          Your Google Authority Briefing
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-neutral-950">
          {briefing.scoreLine}
        </h2>

        <h3 className="mt-8 font-display text-sm font-semibold tracking-wider text-neutral-950 uppercase">
          What you now know
        </h3>
        <ul role="list" className="mt-3 space-y-2">
          {briefing.knowNow.map((line) => (
            <li key={line} className="flex gap-3 text-base text-neutral-600">
              <span aria-hidden="true" className="mt-1 text-neutral-950">
                &#8226;
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-8 font-display text-sm font-semibold tracking-wider text-neutral-950 uppercase">
          Your starting point
        </h3>
        <p className="mt-3 text-base text-neutral-600">
          {briefing.startingPoint}
        </p>

        <h3 className="mt-8 font-display text-sm font-semibold tracking-wider text-neutral-950 uppercase">
          What the market charges
        </h3>
        <p className="mt-3 text-base text-neutral-600">{briefing.market}</p>

        <h3 className="mt-8 font-display text-sm font-semibold tracking-wider text-neutral-950 uppercase">
          Five things to demand from any vendor
        </h3>
        <ul role="list" className="mt-3 space-y-2">
          {briefing.demands.map((line) => (
            <li key={line} className="flex gap-3 text-base text-neutral-600">
              <span aria-hidden="true" className="mt-1 text-neutral-950">
                &#8226;
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {briefing.psa && (
          <div className="mt-8 rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-950/5">
            <p className="text-base text-neutral-600">{briefing.psa}</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-neutral-950/10 pt-6">
          <Button href="/apply/">Apply for the Knowledge Panel Install</Button>
          <Link
            href="/#report"
            className="text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
          >
            Run your instant report <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <p className="mt-4 text-sm text-neutral-600">
          The criteria above travel with you, whoever you hire.
        </p>
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
            {step.kind === 'contact' ? step.question : step.question}
          </h2>

          {step.kind === 'quiz' && (
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-3">
                {step.options.map((opt) => {
                  const chosen = answers[step.key] === opt.value
                  const isCorrect = opt.value === step.correct
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={revealed}
                      onClick={() => {
                        if (stepIndex === 0) track('assessment_start')
                        setAnswers({ ...answers, [step.key]: opt.value })
                        setRevealed(true)
                        track('assessment_step_complete')
                      }}
                      className={clsx(
                        'rounded-2xl border px-5 py-4 text-left text-base transition',
                        revealed && isCorrect
                          ? 'border-neutral-950 bg-solar text-neutral-950'
                          : revealed && chosen
                            ? 'border-neutral-400 bg-neutral-100 text-neutral-500'
                            : revealed
                              ? 'border-neutral-200 bg-white text-neutral-400'
                              : 'border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950',
                      )}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-950/5"
                >
                  <p className="text-sm font-semibold text-neutral-950">
                    {answers[step.key] === step.correct
                      ? 'You got it.'
                      : answers[step.key] === 'not-sure'
                        ? 'Honest answer. Almost nobody has been told this.'
                        : 'Most people miss this one.'}
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">{step.reveal}</p>
                  <div className="mt-4">
                    <Button type="button" onClick={advance}>
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {step.kind === 'choice' && (
            <div className="mt-6 grid grid-cols-1 gap-3">
              {step.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setAnswers({ ...answers, [step.key]: opt.value })
                    track('assessment_step_complete')
                    advance()
                  }}
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

          {step.kind === 'contact' && (
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault()
                if (!firstName.trim()) {
                  setError('A first name makes the briefing yours.')
                  return
                }
                if (!EMAIL_RE.test(email.trim())) {
                  setError('That email does not look complete.')
                  return
                }
                void submit({
                  ...answers,
                  firstName: firstName.trim(),
                  lastName: lastName.trim(),
                  email: email.trim(),
                })
              }}
            >
              <p className="mt-2 text-sm text-neutral-600">
                Your briefing renders on screen right now. The email is where
                the conversation continues if you ever want it to.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="quiz-first" className="sr-only">
                    First name
                  </label>
                  <input
                    id="quiz-first"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base text-neutral-950 transition placeholder:text-neutral-500 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="quiz-last" className="sr-only">
                    Last name
                  </label>
                  <input
                    id="quiz-last"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base text-neutral-950 transition placeholder:text-neutral-500 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5 focus:outline-hidden"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="quiz-email" className="sr-only">
                  Email
                </label>
                <input
                  id="quiz-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base text-neutral-950 transition placeholder:text-neutral-500 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5 focus:outline-hidden"
                />
              </div>
              <div className="mt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="disabled:pointer-events-none disabled:opacity-60"
                >
                  {submitting ? 'Writing your briefing' : 'Get my briefing'}
                </Button>
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
              setRevealed(false)
              setError(null)
            }
          }}
          disabled={stepIndex === 0 || submitting}
          className="text-sm font-semibold text-neutral-600 transition hover:text-neutral-950 disabled:pointer-events-none disabled:opacity-40"
        >
          Back
        </button>
        <p className="text-xs text-neutral-500">
          About three minutes. You learn as you go.
        </p>
      </div>
    </div>
  )
}
