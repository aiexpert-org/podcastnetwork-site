import { NextResponse } from 'next/server'

import { cacheGet, cacheSet, rateLimit, sha256 } from '@/lib/server-cache'

/**
 * Lighthouse SEO score via the PageSpeed Insights v5 API. Split out of the
 * Instant Report because PSI runs 10 to 25 seconds; the client renders the
 * fast findings first and slots this one in when it lands.
 *
 * Keyless PSI works at low volume. Set PAGESPEED_API_KEY in Vercel to lift
 * the quota; the route picks it up automatically.
 */

export const runtime = 'nodejs'
export const maxDuration = 60

const CACHE_TTL_SECONDS = 15 * 60

type SeoScoreResult =
  | { status: 'ok'; seoScore: number; scannedAt: string; cached: boolean }
  | { status: 'unavailable'; reason: string }

function normalizeUrl(raw: string): string | null {
  let candidate = raw.trim()
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`
  }
  try {
    const url = new URL(candidate)
    url.hash = ''
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    return url.toString()
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const urlParam = new URL(req.url).searchParams.get('url')
  if (!urlParam || urlParam.length > 2000) {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }
  const normalized = normalizeUrl(urlParam)
  if (!normalized) {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }
  if (/(^|\.)linkedin\.com$/i.test(new URL(normalized).hostname)) {
    // A rented profile is not your page; Lighthouse on LinkedIn measures
    // LinkedIn. The client skips this finding for LinkedIn inputs, and the
    // API refuses it for anyone calling directly.
    return NextResponse.json(
      { status: 'unavailable', reason: 'linkedin' } satisfies SeoScoreResult,
      { status: 200 },
    )
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`seo-score:${ip}`, 20, 3600)) {
    return NextResponse.json(
      { error: 'rate limited' },
      { status: 429, headers: { 'Retry-After': '3600' } },
    )
  }

  const cacheKey = `seo-score:${await sha256(normalized)}`
  const cached = cacheGet<SeoScoreResult>(cacheKey)
  if (cached && cached.status === 'ok') {
    return NextResponse.json({ ...cached, cached: true })
  }

  const key = process.env.PAGESPEED_API_KEY
  const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(normalized)}&category=seo&strategy=mobile${key ? `&key=${key}` : ''}`

  try {
    const res = await fetch(psiUrl, { signal: AbortSignal.timeout(45_000) })
    if (!res.ok) {
      return NextResponse.json({
        status: 'unavailable',
        reason: `psi-${res.status}`,
      } satisfies SeoScoreResult)
    }
    const json = (await res.json()) as {
      lighthouseResult?: { categories?: { seo?: { score?: number } } }
    }
    const raw = json.lighthouseResult?.categories?.seo?.score
    if (typeof raw !== 'number') {
      return NextResponse.json({
        status: 'unavailable',
        reason: 'no-score',
      } satisfies SeoScoreResult)
    }
    const result: SeoScoreResult = {
      status: 'ok',
      seoScore: Math.round(raw * 100),
      scannedAt: new Date().toISOString(),
      cached: false,
    }
    cacheSet(cacheKey, result, CACHE_TTL_SECONDS)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({
      status: 'unavailable',
      reason: 'timeout',
    } satisfies SeoScoreResult)
  }
}
