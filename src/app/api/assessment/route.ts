import { NextResponse } from 'next/server'
import { appendFile, mkdir } from 'node:fs/promises'

import { rateLimit } from '@/lib/server-cache'
import { syncAssessmentToGhl } from '../apply/ghl'
import { BRAND_SERP_BUILD, PRE_SOLD_AUTHOR_BUILD } from '@/content/packages'

/**
 * Google Authority Quiz intake (v0.6.12). Validates the answers, scores the
 * eight teaching beats server-side, composes the review, logs the
 * submission (console + /tmp JSONL, the WTP exhaust), and syncs to GHL as a
 * contact with segment, WTP, book-intent, and quiz-score tags when
 * GHL_API_KEY is present. "not-sure" is a valid, unscored answer on every
 * quiz beat. The outcomes multi-select primes the WTP question and rides
 * into the log and the GHL note.
 *
 * Copy rule from Brett's walkthrough: the review screen teaches, so no
 * industry jargon survives here. Plain words only. Product names come
 * from packages.ts (Brand SERP Build and Pre-Sold Author Build per the
 * 2026-07-05 final naming lock).
 *
 * Market-pricing facts sourced from Kalicube's published pricing pages
 * (done-for-you service starts at $12,000; reputable range $3,000 to
 * $18,000), checked 2026-07-04. Since the 2026-07-05 reset the Build
 * sits above that range, and the market line says so plainly instead of
 * hiding it.
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
  'ai-accuracy',
  'outrank-namesakes',
  'launch',
  'investors',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Briefing = {
  score: number
  scoreLine: string
  knowNowHeading: string
  knowNow: string[]
  startingPoint: string
  market: string
  demands: string[]
  psa: string | null
}

const KNOW_NOW = [
  'A Knowledge Panel is earned from Google’s Knowledge Graph. It cannot be bought. It gets built piece by piece from proof Google can read, and building that proof is exactly what our team does.',
  'The Google results page about you already exists. The only choice is whether you shape it.',
  'One podcast feeds several trusted sources at once: an IMDb credit, citations from every guest appearance, and a body of work in your own voice that Google indexes.',
  'Wikidata, an open database Google trusts, is usually where a panel takes root. Your own website is your home base. Social media profiles add the least, because you rent them.',
  'ChatGPT and Gemini pull from the same public facts Google reads. Get those facts right once and your search results and your AI answers improve together.',
  'Nobody can guarantee you a Wikipedia page, and a Knowledge Panel does not need one. Any vendor who promises you a Wikipedia page is lying to you.',
  'A published book creates a stack of new records that all point back at you: an ISBN, retailer author pages, a Google Books entry, library catalogs.',
]

const DEMANDS = [
  'Everything a vendor claims should be something you can check yourself on public sites, never a screenshot.',
  'No promised Wikipedia pages, ever. Nobody can promise that.',
  'The work should continue after the setup. Panels drift when nobody is watching.',
  'You should own every asset: the website, the podcast, the Wikidata entry, all of it.',
  'Pricing should be fixed and public before you ever get on a call.',
]

function startingPoint(role: string, book: string, firstName: string): string {
  const roleLine =
    role === 'executive'
      ? 'as an executive, your Google results and your AI answers are the first things your counterparties check.'
      : role === 'author'
        ? 'as an author, this decides whether your name and your book actually find each other when readers search.'
        : role === 'entrepreneur'
          ? 'as a founder, your personal credibility on Google is the trust your company borrows in every deal.'
          : 'this is the difference between being findable and being verifiable when someone checks you out.'
  const bookLine =
    book === 'published'
      ? 'You have published before, which means records about you already exist. Most of your raw material is waiting to be put to work.'
      : book === 'writing'
        ? 'With a book in motion, order matters: build the recognition now and the book lands on a page you control.'
        : book === 'someday'
          ? 'A someday-book is a reason to build the recognition first. It compounds while you decide.'
          : 'No book required. The recognition stands on its own.'
  const line = `${roleLine} ${bookLine}`
  return firstName
    ? `${firstName}, ${line}`
    : `${line.charAt(0).toUpperCase()}${line.slice(1)}`
}

function market(): string {
  const plan = BRAND_SERP_BUILD.payment.planDisplay
  const planLower = `${plan.charAt(0).toLowerCase()}${plan.slice(1)}`
  return `Reputable specialist services run roughly $3,000 to $18,000, and the leading specialist’s done-for-you service starts at $12,000, typically for the panel work alone. The ${BRAND_SERP_BUILD.name} is ${BRAND_SERP_BUILD.priceDisplay} total, ${planLower}. It sits above the panel-only range on purpose: the podcast, IMDb, press, AI answer testing, and a year of monthly checkups are inside the price, where others quote them separately or not at all.`
}

function psaParagraph(book: string): string | null {
  if (book !== 'published' && book !== 'writing' && book !== 'someday') {
    return null
  }
  return `One more thing your answers surfaced: a book is on your map. As the quiz covered, a published book creates its own stack of records about you, and the recognition work is also the launch infrastructure a book needs. That is what the ${PRE_SOLD_AUTHOR_BUILD.name} exists for: ${PRE_SOLD_AUTHOR_BUILD.priceDisplay} total, delivered over ${PRE_SOLD_AUTHOR_BUILD.timelineDisplay}, paid up front or in 12 monthly payments of ${PRE_SOLD_AUTHOR_BUILD.payment.monthlyDisplay}, application only, a finished book from your own voice built on top of the panel work. It is here when you want that conversation, and not before.`
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

  const firstName = clamp(raw.firstName, 100)
  const lastName = clamp(raw.lastName, 100)
  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: 'first and last name are required' },
      { status: 400 },
    )
  }

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
    firstName,
    lastName,
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
          : `You knew ${score} of 8 going in.`,
    knowNowHeading: `${firstName}, here is what you now know`,
    knowNow: KNOW_NOW,
    startingPoint: startingPoint(answers.role, answers.book, firstName),
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

  const fullName = `${firstName} ${lastName}`.trim()

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
