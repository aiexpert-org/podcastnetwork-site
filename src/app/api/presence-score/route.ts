import { NextResponse } from 'next/server'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

import { cacheGet, cacheSet, rateLimit, sha256 } from '@/lib/server-cache'
import { extractStructuredData } from '../schema-scan/extract'
import { fetchGoogleKg, fetchWikidata } from '../entity-lookup/sources'

/**
 * Google Knowledge Presence Score: one URL in (website or LinkedIn), a
 * 0-to-10 score out, built from the same public surfaces Google reads.
 * Each failed check maps to the package that fixes it.
 */

export const runtime = 'nodejs'

const CACHE_TTL_SECONDS = 15 * 60
const FETCH_TIMEOUT_MS = 12_000
const MAX_BODY_BYTES = 3 * 1024 * 1024

export type PresenceCheck = {
  id: 'google-kg' | 'wikidata' | 'schema' | 'citations' | 'entity-home'
  label: string
  points: number
  max: number
  detail: string
  fix: 'kp' | 'psa' | 'both' | null
}

export type PresenceScoreReport = {
  input: string
  inputKind: 'website' | 'linkedin'
  entityName: string
  score: number
  max: 10
  band: 'low' | 'medium' | 'high'
  checks: PresenceCheck[]
  scannedAt: string
  cached: boolean
}

function isPrivateIp(ip: string): boolean {
  if (isIP(ip) === 4) {
    const parts = ip.split('.').map(Number)
    return (
      parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 169 && parts[1] === 254) ||
      parts[0] === 0
    )
  }
  const lower = ip.toLowerCase()
  return (
    lower === '::1' ||
    lower.startsWith('fc') ||
    lower.startsWith('fd') ||
    lower.startsWith('fe80') ||
    lower.startsWith('::ffff:127.') ||
    lower.startsWith('::ffff:10.') ||
    lower.startsWith('::ffff:192.168.')
  )
}

async function ssrfGuard(target: URL): Promise<string | null> {
  if (target.protocol !== 'https:' && target.protocol !== 'http:') {
    return 'Only http(s) URLs are supported.'
  }
  const host = target.hostname
  if (
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return 'That host is not scannable.'
  }
  if (isIP(host)) {
    return isPrivateIp(host) ? 'That host is not scannable.' : null
  }
  try {
    const results = await lookup(host, { all: true })
    if (results.length === 0) return 'Domain did not resolve.'
    if (results.some((r) => isPrivateIp(r.address))) {
      return 'That host is not scannable.'
    }
    return null
  } catch {
    return 'Domain did not resolve.'
  }
}

function normalizeUrl(raw: string): string | null {
  let candidate = raw.trim()
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`
  }
  try {
    const url = new URL(candidate)
    url.hash = ''
    return url.toString()
  } catch {
    return null
  }
}

function isLinkedIn(url: URL): boolean {
  return /(^|\.)linkedin\.com$/i.test(url.hostname)
}

function nameFromLinkedInSlug(url: URL): string {
  const m = url.pathname.match(/\/(?:in|company|school)\/([^/]+)/i)
  if (!m) return ''
  return decodeURIComponent(m[1])
    .replace(/-\d+$/, '')
    .replace(/[-_.]+/g, ' ')
    .replace(/\d+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function titleCase(s: string): string {
  return s.trim().replace(/\s+/g, ' ')
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; PodcastNetworkOrg-PresenceScore/1.0; +https://podcastnetwork.org)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })
    if (!res.ok) return null
    const reader = res.body?.getReader()
    if (!reader) return null
    const chunks: Uint8Array[] = []
    let received = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        received += value.byteLength
        if (received > MAX_BODY_BYTES) {
          reader.cancel()
          break
        }
        chunks.push(value)
      }
    }
    return new TextDecoder().decode(
      chunks.reduce((acc, c) => {
        const merged = new Uint8Array(acc.length + c.length)
        merged.set(acc)
        merged.set(c, acc.length)
        return merged
      }, new Uint8Array(0)),
    )
  } catch {
    return null
  }
}

/** Strip LinkedIn/site suffixes from an og:title or <title>. */
function cleanTitle(t: string): string {
  return t
    .split(/\s+[|\-–·]\s+/)[0]
    .replace(/\s*\|\s*LinkedIn.*$/i, '')
    .trim()
}

/**
 * Dashless LinkedIn slugs ("glennsanford") defeat direct name parsing, and
 * LinkedIn auth-walls bot fetches. Ask Google (via SerpAPI) what it titles
 * that profile and read the person's name off the result.
 */
async function resolveLinkedInNameViaSearch(
  slug: string,
): Promise<string | null> {
  const key = process.env.SERPAPI_KEY
  if (!key) return null
  try {
    const res = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(`linkedin.com/in/${slug}`)}&num=5&api_key=${key}`,
      { signal: AbortSignal.timeout(8000) },
    )
    if (!res.ok) return null
    const json = (await res.json()) as {
      knowledge_graph?: { title?: string }
      organic_results?: { link?: string; title?: string }[]
    }
    if (json.knowledge_graph?.title) return json.knowledge_graph.title
    const organic = (json.organic_results ?? []).filter(
      (r) => r.link && r.title && /linkedin\.com\/in\//i.test(r.link),
    )
    // Exact slug match first; otherwise Google's top profile result for the
    // query (covers near-miss slugs typed live in a demo).
    const match =
      organic.find((r) =>
        r.link!.toLowerCase().includes(`/in/${slug.toLowerCase()}`),
      ) ?? organic[0]
    if (match?.title) {
      const name = cleanTitle(match.title)
      // Guard against junk titles ("LinkedIn", "Sign Up").
      if (name.length >= 4 && !/linkedin|sign\s?up|log\s?in/i.test(name)) {
        return name
      }
    }
    return null
  } catch {
    return null
  }
}

type WikipediaResult = { hit: boolean; exact: boolean; title?: string }

async function searchWikipedia(name: string): Promise<WikipediaResult> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&srlimit=3&format=json&origin=*`,
      {
        headers: {
          'User-Agent':
            'PodcastNetworkOrg-PresenceScore/1.0 (https://podcastnetwork.org; brett@podcastnetwork.org)',
        },
        signal: AbortSignal.timeout(8000),
      },
    )
    if (!res.ok) return { hit: false, exact: false }
    const json = (await res.json()) as {
      query?: { search?: { title: string }[] }
    }
    const results = json.query?.search ?? []
    if (results.length === 0) return { hit: false, exact: false }
    const target = name.toLowerCase().replace(/[^a-z0-9]+/g, '')
    const exact = results.some(
      (r) =>
        r.title.toLowerCase().replace(/\s*\(.*\)$/, '').replace(/[^a-z0-9]+/g, '') ===
        target,
    )
    return { hit: true, exact, title: results[0].title }
  } catch {
    return { hit: false, exact: false }
  }
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const urlParam = params.get('url')

  if (!urlParam || urlParam.length > 2000) {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }

  const normalized = normalizeUrl(urlParam)
  if (!normalized) {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`presence-score:${ip}`, 30, 3600)) {
    return NextResponse.json(
      { error: 'rate limited' },
      { status: 429, headers: { 'Retry-After': '3600' } },
    )
  }

  const target = new URL(normalized)
  const linkedIn = isLinkedIn(target)

  if (!linkedIn) {
    const guardError = await ssrfGuard(target)
    if (guardError) {
      return NextResponse.json({ error: guardError }, { status: 403 })
    }
  }

  const cacheKey = `presence-score:${await sha256(normalized)}`
  const cached = cacheGet<PresenceScoreReport>(cacheKey)
  if (cached) {
    return NextResponse.json({ ...cached, cached: true })
  }

  // ---- Resolve the entity name + on-page signals -------------------------

  let entityName = ''
  let schemaPoints = 0
  let schemaDetail = ''
  let homePoints = 0
  let homeDetail = ''

  if (linkedIn) {
    // LinkedIn auth-walls automated reads. Try the public page for an
    // og:title, then ask Google what it titles the profile, then fall back
    // to the slug.
    const html = await fetchPage(normalized)
    if (html) {
      const data = extractStructuredData(html)
      const og = data.openGraph['og:title'] ?? data.openGraph['title']
      if (og) entityName = cleanTitle(og)
    }
    if (!entityName || !/\s/.test(entityName)) {
      const slugMatch = target.pathname.match(/\/(?:in|company|school)\/([^/]+)/i)
      if (slugMatch) {
        const resolved = await resolveLinkedInNameViaSearch(
          decodeURIComponent(slugMatch[1]),
        )
        if (resolved) entityName = resolved
      }
    }
    if (!entityName) entityName = nameFromLinkedInSlug(target)

    schemaPoints = 0
    schemaDetail =
      'A LinkedIn profile exposes no structured data you own. Google reads rented pages last.'
    homePoints = 0
    homeDetail =
      'A rented profile is not an Entity Home. You need a canonical page Google can anchor your identity to.'
  } else {
    const html = await fetchPage(normalized)
    if (!html) {
      return NextResponse.json(
        { error: 'We could not fetch that URL. Check the address and try again.' },
        { status: 422 },
      )
    }
    const data = extractStructuredData(html)

    const typed = data.jsonLd.filter((n) => {
      const t = n['@type']
      const types = Array.isArray(t) ? t : [t]
      return types.some((x) => typeof x === 'string')
    })
    const identity = typed.filter((n) => {
      const t = n['@type']
      const types = (Array.isArray(t) ? t : [t]).filter(
        (x): x is string => typeof x === 'string',
      )
      return types.some((x) =>
        /^(Person|Organization|LocalBusiness|ProfessionalService|Corporation|OnlineBusiness)$/i.test(
          x,
        ),
      )
    })

    const identityNode = identity[0]
    if (identityNode && typeof identityNode.name === 'string') {
      entityName = titleCase(identityNode.name)
    }
    if (!entityName) {
      const og =
        data.openGraph['og:site_name'] ?? data.openGraph['og:title'] ?? ''
      if (og) entityName = cleanTitle(og)
    }
    if (!entityName) entityName = target.hostname.replace(/^www\./, '')

    const sameAs = identityNode?.sameAs
    const sameAsCount = Array.isArray(sameAs) ? sameAs.length : 0

    if (identity.length > 0 && sameAsCount >= 2) {
      schemaPoints = 2
      schemaDetail = `Found ${identity.length === 1 ? 'an identity entity' : `${identity.length} identity entities`} in JSON-LD with ${sameAsCount} corroborating sameAs links. Google can read who this page is about.`
    } else if (identity.length > 0) {
      schemaPoints = 1
      schemaDetail =
        'Identity schema exists but carries no corroborating sameAs links, so Google cannot cross-verify it against other surfaces.'
    } else if (data.jsonLd.length > 0) {
      schemaPoints = 0
      schemaDetail =
        'Structured data exists, but none of it declares a Person or Organization. Google sees a page, not an identity.'
    } else {
      schemaPoints = 0
      schemaDetail =
        'No structured data at all. Google is guessing at who this page belongs to.'
    }

    const hasTitle = data.openGraph['og:title'] || data.headings.length > 0
    if (identityNode && hasTitle) {
      homePoints = 1
      homeDetail =
        'This page can serve as an Entity Home: a canonical, machine-readable statement of who you are.'
    } else {
      homePoints = 0
      homeDetail =
        'No canonical Entity Home. Every authority signal you earn has nowhere consistent to point.'
    }
  }

  if (!entityName) {
    return NextResponse.json(
      {
        error:
          'We could not work out who this URL represents. Try your personal site or full LinkedIn profile URL.',
      },
      { status: 422 },
    )
  }

  // ---- Off-page checks, in parallel --------------------------------------

  const [kg, wikidata, wikipedia] = await Promise.all([
    fetchGoogleKg(entityName),
    fetchWikidata(entityName),
    searchWikipedia(entityName),
  ])

  const checks: PresenceCheck[] = []

  if (kg.status === 'ok' && kg.entity) {
    checks.push({
      id: 'google-kg',
      label: 'Google Knowledge Graph entity',
      points: 3,
      max: 3,
      detail: `Google recognizes "${kg.entity.name}"${kg.entity.description ? ` (${kg.entity.description})` : ''} as an entity.`,
      fix: null,
    })
  } else if (kg.status === 'error') {
    checks.push({
      id: 'google-kg',
      label: 'Google Knowledge Graph entity',
      points: 0,
      max: 3,
      detail:
        'Knowledge Graph lookup was unavailable for this scan. Scored conservatively.',
      fix: 'kp',
    })
  } else {
    checks.push({
      id: 'google-kg',
      label: 'Google Knowledge Graph entity',
      points: 0,
      max: 3,
      detail: `Google's Knowledge Graph has no entity for "${entityName}". You do not exist in the machine layer Google answers from.`,
      fix: 'kp',
    })
  }

  if (wikidata.status === 'ok' && wikidata.entity) {
    checks.push({
      id: 'wikidata',
      label: 'Wikidata entity',
      points: 2,
      max: 2,
      detail: `Wikidata carries "${wikidata.entity.name}"${wikidata.entity.description ? ` (${wikidata.entity.description})` : ''}. This is the seed surface Google trusts most.`,
      fix: null,
    })
  } else {
    checks.push({
      id: 'wikidata',
      label: 'Wikidata entity',
      points: 0,
      max: 2,
      detail: `No Wikidata entry found for "${entityName}". Without a Q-number, the knowledge panel has no root to grow from.`,
      fix: 'kp',
    })
  }

  checks.push({
    id: 'schema',
    label: 'Structured data you own',
    points: schemaPoints,
    max: 2,
    detail: schemaDetail,
    fix: schemaPoints >= 2 ? null : 'kp',
  })

  if (wikipedia.exact) {
    checks.push({
      id: 'citations',
      label: 'Citation surfaces',
      points: 2,
      max: 2,
      detail: `Wikipedia carries "${wikipedia.title}". Encyclopedia-grade corroboration is in place.`,
      fix: null,
    })
  } else if (wikipedia.hit) {
    checks.push({
      id: 'citations',
      label: 'Citation surfaces',
      points: 1,
      max: 2,
      detail: `Wikipedia mentions "${entityName}" but has no article. Partial corroboration only.`,
      fix: 'both',
    })
  } else {
    checks.push({
      id: 'citations',
      label: 'Citation surfaces',
      points: 0,
      max: 2,
      detail: `No Wikipedia footprint for "${entityName}". Third-party citation is the signal you cannot fake, and it is missing.`,
      fix: 'both',
    })
  }

  checks.push({
    id: 'entity-home',
    label: 'Entity Home',
    points: homePoints,
    max: 1,
    detail: homeDetail,
    fix: homePoints === 1 ? null : 'kp',
  })

  const score = checks.reduce((sum, c) => sum + c.points, 0)
  const band = score <= 3 ? 'low' : score <= 7 ? 'medium' : 'high'

  const report: PresenceScoreReport = {
    input: normalized,
    inputKind: linkedIn ? 'linkedin' : 'website',
    entityName,
    score,
    max: 10,
    band,
    checks,
    scannedAt: new Date().toISOString(),
    cached: false,
  }

  cacheSet(cacheKey, report, CACHE_TTL_SECONDS)
  return NextResponse.json(report)
}
