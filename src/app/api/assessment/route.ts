import { NextResponse } from 'next/server'
import { appendFile, mkdir } from 'node:fs/promises'

import { rateLimit } from '@/lib/server-cache'
import { syncAssessmentToGhl } from '../apply/ghl'
import { KNOWLEDGE_PANEL_INSTALL, PRE_SOLD_AUTHOR } from '@/content/packages'

/**
 * Google Authority Quiz intake (v0.6.12). Validates the answers, scores the
 * eight teaching beats server-side, composes the briefing, logs the
 * submission (console + /tmp JSONL, the WTP exhaust), and syncs to GHL as a
 * contact with segment, WTP, book-intent, and quiz-score tags when
 * GHL_API_KEY is present. "not-sure" is a valid, unscored answer on every
 * quiz beat. The outcomes multi-select primes the WTP question and rides
 * into the log and the GHL note.
 *
 * Market-pricing facts sourced from Kalicube's published pricing pages
 * (done-for-you service starts at $12,000; reputable range $3,000 to
 * $18,000), checked 2026-07-04.
 */

export const runtime = 'nodejs'

const QUIZ_CORRECT: Record<string, string> = {
  q_panel: 'earned',
  q_stakes: 'whatever-found',
  q_mechanism: 'podcast',
  q_seed: 'wikidata',
  q_ai: 'entity-data',
  q_wikipedia: 'no-guarantee',
  q_market: 'three-to-eighteen',
  q_book: 'book',
}

const CHOICES: Record<string, string[]> = {
  q_panel: ['paid', 'earned', 'anyone', 'not-sure'],
  q_stakes: ['nothing', 'whatever-found', 'error', 'not-sure'],
  q_mechanism: ['press', 'podcast', 'backlinks', 'not-sure'],
  q_seed: ['website', 'wikidata', 'linkedin', 'not-sure'],
  q_ai: ['made-up', 'entity-data', 'social', 'not-sure'],
  q_wikipedia: ['pay', 'no-guarantee', 'celebrity', 'not-sure'],
  q_market: ['five-hundred', 'two-k', 'three-to-eighteen', 'not-sure'],
  q_book: ['mba', 'book', 'social', 'not-sure'],
  role: ['executive', 'author', 'entrepreneur', 'professional'],
  book: ['published', 'writing', 'someday', 'none'],
  budget: ['under-5k', '5-15k', '15-40k', '40k-plus'],
}

const OUTCOME_VALUES = [
  'trust-first-meeting',
  'higher-fees',
  'bookings',
  'outrank-namesakes',
  'launch',
  'investors',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Briefing = {
  score: number
  scoreLine: string
  knowNow: string[]
  startingPoint: string
  market: string
  demands: string[]
  psa: string | null
}

const KNOW_NOW = [
  'A Knowledge Panel is earned from Google’s Knowledge Graph. It cannot be bought. It gets built signal by signal, and that assembly is the work.',
  'The search page about you exists whether or not you shape it. A panel turns it into a verified identity you author.',
  'One podcast feeds several trusted sources at once: an IMDb credit, guest-appearance citations, and an indexable body of work in your own voice.',
  'Wikidata is the seed surface, your own site is the Entity Home, and rented profiles count least.',
  'AI answer engines read the same entity layer, so fixing it corrects search results and AI answers together.',
  'Nobody can guarantee Wikipedia, and a panel does not depend on it. A guarantee is the tell of a bad vendor.',
  'A published book generates its own cluster of records (ISBN, retailer author pages, Google Books, library catalogs) that all point back at you.',
]

const DEMANDS = [
  'Every claimed signal should be checkable on public surfaces, never screenshots.',
  'No guaranteed-Wikipedia promises, ever.',
  'Verification should continue after the build. Panels drift, and a one-time setup decays.',
  'You should own every asset: the site, the schema, the podcast, the Wikidata entry.',
  'Pricing should be fixed and public before any call.',
]

function startingPoint(role: string, book: string, firstName: string): string {
  const roleLine =
    role === 'executive'
      ? 'As an executive, the panel and the AI answer layer are the surfaces your counterparties check first.'
      : role === 'author'
        ? 'As an author, the entity layer decides whether your name and your book resolve to you when readers search.'
        : role === 'entrepreneur'
          ? 'As a founder, your personal entity is the trust layer your company borrows from in every deal.'
          : 'The entity layer is the difference between being findable and being verifiable when someone checks you out.'
  const bookLine =
    book === 'published'
      ? 'You have published before, which means citations already exist to build on. Most of your raw material is waiting to be structured.'
      : book === 'writing'
        ? 'With a book in motion, sequencing matters: the authority layer built now becomes the launch surface the book lands on.'
        : book === 'someday'
          ? 'A someday-book is a reason to build the authority layer first. It compounds while you decide.'
          : 'No book required. The recognition layer stands on its own.'
  return `${firstName ? `${firstName}, ` : ''}${roleLine} ${bookLine}`
}

function market(): string {
  return `Reputable specialist services run roughly $3,000 to $18,000, and the leading specialist’s done-for-you service starts at $12,000, typically for the entity work alone. The Knowledge Panel Install is ${KNOWLEDGE_PANEL_INSTALL.priceDisplay} flat, paid up front or split into 12 monthly payments of $1,000, and it includes the podcast, IMDb, press, and a year of monthly verification that others price separately, when they offer them at all.`
}

function psaParagraph(book: string): string | null {
  if (book !== 'published' && book !== 'writing' && book !== 'someday') {
    return null
  }
  return `One more thing your answers surfaced: a book is on your map. As the quiz covered, a published book generates its own cluster of Google-readable records, and the authority layer is also the launch infrastructure a book needs. That is what the ${PRE_SOLD_AUTHOR.name} exists for: ${PRE_SOLD_AUTHOR.priceDisplay} over ${PRE_SOLD_AUTHOR.timelineDisplay}, application only, a finished book from your own voice built on top of the panel work. It is here when you want that conversation, and not before.`
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`assessment:${ip}`, 10, 3600)) {
    return NextResponse.json(
      { error: 'rate limited' },
      { status: 429, headers: { 'Retry-After': '3600' } },
    )
  }

  let body: { answers?: Record<string, unknown> }
  try {
    body = (await req.json()) as { answers?: Record<string, unknown> }
  } catch {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  const raw = body.answers ?? {}
  for (const [key, allowed] of Object.entries(CHOICES)) {
    const value = raw[key]
    if (typeof value !== 'string' || !allowed.includes(value)) {
      return NextResponse.json(
        { error: `missing or invalid answer: ${key}` },
        { status: 400 },
      )
    }
  }
  const rawOutcomes = raw.outcomes
  if (
    !Array.isArray(rawOutcomes) ||
    rawOutcomes.length === 0 ||
    rawOutcomes.length > OUTCOME_VALUES.length ||
    rawOutcomes.some(
      (v) => typeof v !== 'string' || !OUTCOME_VALUES.includes(v),
    )
  ) {
    return NextResponse.json(
      { error: 'missing or invalid answer: outcomes' },
      { status: 400 },
    )
  }
  const outcomes = [...new Set(rawOutcomes as string[])]

  const emailRaw = raw.email
  if (typeof emailRaw !== 'string' || !EMAIL_RE.test(emailRaw.trim())) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }

  const clamp = (v: unknown, n: number) =>
    typeof v === 'string' ? v.trim().slice(0, n) : ''

  const answers = {
    q_panel: raw.q_panel as string,
    q_stakes: raw.q_stakes as string,
    q_mechanism: raw.q_mechanism as string,
    q_seed: raw.q_seed as string,
    q_ai: raw.q_ai as string,
    q_wikipedia: raw.q_wikipedia as string,
    q_market: raw.q_market as string,
    q_book: raw.q_book as string,
    role: raw.role as string,
    book: raw.book as string,
    budget: raw.budget as string,
    outcomes,
    email: emailRaw.trim().toLowerCase(),
    firstName: clamp(raw.firstName, 100),
    lastName: clamp(raw.lastName, 100),
  }

  const score = Object.entries(QUIZ_CORRECT).reduce(
    (sum, [key, correct]) =>
      sum + (answers[key as keyof typeof answers] === correct ? 1 : 0),
    0,
  )

  const briefing: Briefing = {
    score,
    scoreLine:
      score >= 7
        ? `You knew ${score} of 8 going in. You are ahead of most of the market.`
        : score >= 4
          ? `You knew ${score} of 8 going in. Most executives score lower.`
          : `You knew ${score} of 8 going in. That is normal, and it is exactly why this layer is an edge.`,
    knowNow: KNOW_NOW,
    startingPoint: startingPoint(answers.role, answers.book, answers.firstName),
    market: market(),
    demands: DEMANDS,
    psa: psaParagraph(answers.book),
  }

  const bookIntent = briefing.psa !== null

  const record = {
    kind: 'quiz',
    submittedAt: new Date().toISOString(),
    answers,
    score,
    bookIntent,
  }

  // The WTP exhaust: function logs are the durable copy until KV lands.
  console.log('[assessment-submit]', JSON.stringify(record))
  try {
    await mkdir('/tmp/pn-assessments', { recursive: true })
    await appendFile(
      '/tmp/pn-assessments/log.jsonl',
      `${JSON.stringify(record)}\n`,
    )
  } catch {
    // /tmp is best-effort on serverless; the console line above is canonical.
  }

  const fullName =
    `${answers.firstName} ${answers.lastName}`.trim() ||
    answers.email.split('@')[0]

  const ghl = await syncAssessmentToGhl({
    name: fullName,
    email: answers.email,
    segment: answers.role,
    budget: answers.budget,
    recommendation: bookIntent ? 'kp-book-intent' : 'kp',
    noteBody: [
      'PodcastNetwork.org Google Authority Quiz',
      `Submitted: ${record.submittedAt}`,
      '',
      `Name: ${fullName}`,
      `Quiz score: ${score} of 8`,
      `Role: ${answers.role}`,
      `Book status: ${answers.book}`,
      `Outcomes picked: ${outcomes.join(', ')}`,
      `Informed WTP: ${answers.budget}`,
      `Book intent: ${bookIntent ? 'yes' : 'no'}`,
      '',
      `Quiz answers: panel=${answers.q_panel}, stakes=${answers.q_stakes}, mechanism=${answers.q_mechanism}, seed=${answers.q_seed}, ai=${answers.q_ai}, wikipedia=${answers.q_wikipedia}, market=${answers.q_market}, book=${answers.q_book}`,
    ].join('\n'),
  })

  if (ghl.status === 'skipped') {
    console.log('[assessment-submit] crm_pending_ghl_key')
  }

  return NextResponse.json({ ok: true, briefing })
}
