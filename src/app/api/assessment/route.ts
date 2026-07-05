import { NextResponse } from 'next/server'
import { appendFile, mkdir } from 'node:fs/promises'

import { rateLimit } from '@/lib/server-cache'
import { syncAssessmentToGhl } from '../apply/ghl'
import {
  KNOWLEDGE_PANEL_INSTALL,
  PRE_SOLD_AUTHOR,
  BOTH_PACKAGES_PRICE_DISPLAY,
} from '@/content/packages'

/**
 * Tier 2 assessment intake. Validates the ten answers, computes the package
 * recommendation server-side, logs the submission (console + /tmp JSONL, the
 * same pattern as the application route), and syncs to GHL as a contact with
 * segment, WTP, and recommendation tags when GHL_API_KEY is present.
 *
 * The WTP question (budget) is the marketing exhaust: quarterly aggregates
 * come straight out of these logs.
 */

export const runtime = 'nodejs'

const CHOICES: Record<string, string[]> = {
  role: ['executive', 'author', 'entrepreneur', 'professional'],
  goal: ['authority', 'pre-sell-book', 'audience', 'other'],
  book: ['manuscript', 'writing', 'planning', 'none'],
  audience: ['none', 'under-1k', '1k-10k', '10k-plus'],
  tried: ['agency', 'self', 'no'],
  timeline: ['now', '90-days', '6-12-months', 'no-urgency'],
  budget: ['under-5k', '5-15k', '15-40k', '40k-plus', 'depends'],
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Answers = {
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

const KP_PAY = KNOWLEDGE_PANEL_INSTALL.payment
const KP_PRICE_LINE = `${KNOWLEDGE_PANEL_INSTALL.priceDisplay} over ${KNOWLEDGE_PANEL_INSTALL.timelineDisplay}${
  KP_PAY
    ? ` (${KP_PAY.planDisplay}, or ${KP_PAY.payInFullDisplay} paid up front)`
    : ''
}. Application only.`

function recommend(a: Answers): Recommendation {
  const psaSignal =
    a.role === 'author' ||
    a.goal === 'pre-sell-book' ||
    a.book === 'manuscript' ||
    a.book === 'writing'
  const authorityAppetite = a.goal === 'authority' || a.role === 'executive'
  const bigBudget = a.budget === '40k-plus' || a.budget === 'depends'

  if (psaSignal && authorityAppetite && bigBudget) {
    return {
      packageId: 'both',
      headline: 'Both builds, run in parallel',
      priceLine: `${BOTH_PACKAGES_PRICE_DISPLAY} total on standard terms. ${PRE_SOLD_AUTHOR.name} over ${PRE_SOLD_AUTHOR.timelineDisplay}, ${KNOWLEDGE_PANEL_INSTALL.name} over ${KNOWLEDGE_PANEL_INSTALL.timelineDisplay}. No bundle discount, because each stands on its own.`,
      whyLines: [
        'You have a book in motion and you want the machine layer of Google to recognize you. Those are two different problems, and each package solves one of them.',
        `The ${PRE_SOLD_AUTHOR.name} produces the finished book from your own voice and positions it for pre-sales in the launch window.`,
        `The ${KNOWLEDGE_PANEL_INSTALL.name} makes the recognition durable: knowledge panel signals, Wikidata, schema, and a year of monthly verification.`,
      ],
    }
  }

  if (psaSignal) {
    const bookLine =
      a.book === 'manuscript'
        ? 'You already have a manuscript, so the six-month clock spends its time on authority, audience, and the launch window rather than drafting.'
        : a.book === 'writing'
          ? 'The book is already moving. Eight interviews and the editorial team turn that momentum into a finished manuscript by month three.'
          : 'The book is the goal, and the interview-based process is built to produce it from your own voice inside six months.'
    return {
      packageId: 'pre-sold-author',
      headline: PRE_SOLD_AUTHOR.name,
      priceLine: `${PRE_SOLD_AUTHOR.priceDisplay} over ${PRE_SOLD_AUTHOR.timelineDisplay}. Application only.`,
      whyLines: [
        bookLine,
        'Everything the launch needs ships inside the same build: the podcast, the voice clone, the author authority stack, and the coordinated launch sequence.',
        a.timeline === 'now' || a.timeline === '90-days'
          ? 'Your timeline fits. Kickoff typically lands three to four weeks after application, and Day 1 starts the six-month clock.'
          : 'When you are ready to start, kickoff lands three to four weeks after application and the clock runs six months from Day 1.',
      ],
    }
  }

  return {
    packageId: 'knowledge-panel-install',
    headline: KNOWLEDGE_PANEL_INSTALL.name,
    priceLine: KP_PRICE_LINE,
    whyLines: [
      a.goal === 'authority'
        ? 'Your goal is recognition: when Google and the AI answer engines are asked about you, they should answer correctly. That is exactly what this build installs and then verifies monthly for a year.'
        : 'Without a book in motion, the highest-return build is the recognition layer: make Google and the AI answer engines describe you correctly, then keep proving it monthly for a year.',
      'The deliverables map one-to-one to the gaps the instant report surfaces: Knowledge Graph, Wikidata, owned schema, citation surfaces, and an Entity Home.',
      a.tried === 'agency'
        ? 'You have paid for this before. The difference here is verifiable output: every signal this build claims is checkable from the same public surfaces the report reads.'
        : 'Every signal the build claims is checkable from the same public surfaces the instant report reads. Nothing rides on our word.',
    ],
  }
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

  let body: { answers?: Partial<Answers> }
  try {
    body = (await req.json()) as { answers?: Partial<Answers> }
  } catch {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  const raw = body.answers ?? {}
  for (const [key, allowed] of Object.entries(CHOICES)) {
    const value = raw[key as keyof Answers]
    if (typeof value !== 'string' || !allowed.includes(value)) {
      return NextResponse.json(
        { error: `missing or invalid answer: ${key}` },
        { status: 400 },
      )
    }
  }
  if (typeof raw.email !== 'string' || !EMAIL_RE.test(raw.email.trim())) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }

  const clamp = (v: unknown) =>
    typeof v === 'string' ? v.trim().slice(0, 2000) : ''

  const answers: Answers = {
    role: raw.role as string,
    goal: raw.goal as string,
    book: raw.book as string,
    audience: raw.audience as string,
    tried: raw.tried as string,
    outcome: clamp(raw.outcome),
    timeline: raw.timeline as string,
    budget: raw.budget as string,
    email: raw.email.trim().toLowerCase(),
    name: clamp(raw.name).slice(0, 200),
    extra: clamp(raw.extra),
  }

  const recommendation = recommend(answers)

  const record = {
    kind: 'assessment',
    submittedAt: new Date().toISOString(),
    answers,
    recommendation: recommendation.packageId,
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

  const ghl = await syncAssessmentToGhl({
    name: answers.name || answers.email.split('@')[0],
    email: answers.email,
    segment: answers.role,
    budget: answers.budget,
    recommendation: recommendation.packageId,
    noteBody: [
      'PodcastNetwork.org deeper assessment',
      `Submitted: ${record.submittedAt}`,
      '',
      `Role: ${answers.role}`,
      `Goal: ${answers.goal}`,
      `Book status: ${answers.book}`,
      `Audience: ${answers.audience}`,
      `Tried before: ${answers.tried}`,
      `Timeline: ${answers.timeline}`,
      `Investment range (WTP): ${answers.budget}`,
      `Recommendation: ${recommendation.packageId}`,
      '',
      `Outcome in their words: ${answers.outcome || '(blank)'}`,
      `Anything else: ${answers.extra || '(blank)'}`,
    ].join('\n'),
  })

  if (ghl.status === 'skipped') {
    console.log('[assessment-submit] crm_pending_ghl_key')
  }

  return NextResponse.json({ ok: true, recommendation })
}
