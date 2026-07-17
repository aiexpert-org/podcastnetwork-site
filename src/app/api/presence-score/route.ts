import { NextResponse } from 'next/server'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

import { cacheGet, cacheSet, rateLimit, sha256 } from '@/lib/server-cache'
import {
  classifyUpstreamFailure,
  getLastGood,
  logUpstreamFailure,
  peekResponseSnippet,
  putLastGood,
  recordUpstreamFailure,
  recordUpstreamSuccess,
  shouldSkipUpstream,
} from '@/lib/server-cache-shim'
import { extractStructuredData } from '../schema-scan/extract'
import { fetchGoogleKg, fetchWikidata } from '../entity-lookup/sources'

/**
 * Instant Presence Report: one URL in (website or LinkedIn), a set of real,
 * verifiable findings out, built from the same public surfaces Google reads.
 * No aggregate score. Each finding carries its own status, plain-language
 * detail, and the build that fixes it when it fails.
 *
 * The Lighthouse SEO finding is served separately by /api/seo-score because
 * PageSpeed Insights runs 10 to 25 seconds; the client slots it in when it
 * lands so these findings stay in the 3-to-5-second window.
 *
 * Stack: SerpAPI (AI Overview + LinkedIn resolution) + Google Cloud
 * (Knowledge Graph + PageSpeed). No OpenAI.
 *
 * Upstream calls to SerpAPI + Google KG are wrapped in the upstream-guard
 * circuit breaker (src/lib/upstream-guard.ts) so a repeated key or quota
 * failure stops hammering the API and writes a structured log line naming
 * the actual failure kind.
 */

export const runtime = 'nodejs'

const CACHE_TTL_SECONDS = 15 * 60
const FETCH_TIMEOUT_MS = 12_000
const MAX_BODY_BYTES = 3 * 1024 * 1024

export type FindingStatus = 'found' | 'partial' | 'missing' | 'unavailable'

export type PresenceFinding = {
  id:
    | 'google-kg'
    | 'wikidata'
    | 'schema'
    | 'citations'
    | 'entity-home'
    | 'ai-overview'
  label: string
  status: FindingStatus
  /** Short verifiable fact line, e.g. the Q-number or the mentions count. */
  evidence: string | null
  detail: string
  fix: 'kp' | 'psa' | 'both' | null
}

export type InstantReportPayload = {
  input: string
  inputKind: 'website' | 'linkedin'
  entityName: string
  findings: PresenceFinding[]
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
          'Mozilla/5.0 (compatible; PodcastNetworkOrg-PresenceReport/1.0; +https://podcastnetwork.org)',
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
  if (!key) {
    logUpstreamFailure('serpapi', `linkedin:${slug}`, 'missing-key', {
      message: 'SERPAPI_KEY not set (LinkedIn name resolution)',
    })
    return null
  }
  if (shouldSkipUpstream('serpapi', `linkedin:${slug}`)) {
    return getLastGood<string | null>('serpapi', `linkedin:${slug}`) ?? null
  }
  let res: Response | null = null
  try {
    res = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(`linkedin.com/in/${slug}`)}&num=5&api_key=${key}`,
      { signal: AbortSignal.timeout(8000) },
    )
    if (!res.ok) {
      const kind = classifyUpstreamFailure(res, null)
      const snippet = await peekResponseSnippet(res)
      logUpstreamFailure('serpapi', `linkedin:${slug}`, kind, {
        status: res.status,
        snippet,
      })
      recordUpstreamFailure('serpapi', `linkedin:${slug}`, kind)
      return getLastGood<string | null>('serpapi', `linkedin:${slug}`) ?? null
    }
    const json = (await res.json()) as {
      knowledge_graph?: { title?: string }
      organic_results?: { link?: string; title?: string }[]
    }
    let name: string | null = null
    if (json.knowledge_graph?.title) name = json.knowledge_graph.title
    if (!name) {
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
        const candidate = cleanTitle(match.title)
        // Guard against junk titles ("LinkedIn", "Sign Up").
        if (
          candidate.length >= 4 &&
          !/linkedin|sign\s?up|log\s?in/i.test(candidate)
        ) {
          name = candidate
        }
      }
    }
    recordUpstreamSuccess('serpapi', `linkedin:${slug}`)
    putLastGood('serpapi', `linkedin:${slug}`, name)
    return name
  } catch (err) {
    const kind = classifyUpstreamFailure(res, err)
    logUpstreamFailure('serpapi', `linkedin:${slug}`, kind, {
      status: res?.status,
      message: err instanceof Error ? err.message : String(err),
    })
    recordUpstreamFailure('serpapi', `linkedin:${slug}`, kind)
    return getLastGood<string | null>('serpapi', `linkedin:${slug}`) ?? null
  }
}

type WikipediaResult = {
  hit: boolean
  exact: boolean
  title?: string
  mentions: number
}

async function searchWikipedia(name: string): Promise<WikipediaResult> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&srlimit=3&format=json&origin=*`,
      {
        headers: {
          'User-Agent':
            'PodcastNetworkOrg-PresenceReport/1.0 (https://podcastnetwork.org; brett@podcastnetwork.org)',
        },
        signal: AbortSignal.timeout(8000),
      },
    )
    if (!res.ok) return { hit: false, exact: false, mentions: 0 }
    const json = (await res.json()) as {
      query?: { search?: { title: string }[]; searchinfo?: { totalhits?: number } }
    }
    const results = json.query?.search ?? []
    const mentions = json.query?.searchinfo?.totalhits ?? results.length
    if (results.length === 0) return { hit: false, exact: false, mentions: 0 }
    const target = name.toLowerCase().replace(/[^a-z0-9]+/g, '')
    const exact = results.some(
      (r) =>
        r.title.toLowerCase().replace(/\s*\(.*\)$/, '').replace(/[^a-z0-9]+/g, '') ===
        target,
    )
    return { hit: true, exact, title: results[0].title, mentions }
  } catch {
    return { hit: false, exact: false, mentions: 0 }
  }
}

/** Pull the Q-number out of the Wikidata sameAs URL the adapter returns. */
function wikidataQNumber(sameAs: { label: string; url: string }[]): string | null {
  for (const link of sameAs) {
    const m = link.url.match(/wikidata\.org\/wiki\/(Q\d+)/i)
    if (m) return m[1].toUpperCase()
  }
  return null
}

type AiOverviewResult =
  | { status: 'found'; snippet: string }
  | { status: 'missing' }
  | { status: 'unavailable' }

async function checkGoogleAiOverview(
  entityName: string,
): Promise<AiOverviewResult> {
  const key = process.env.SERPAPI_KEY
  if (!key) {
    logUpstreamFailure('serpapi-ai-overview', entityName, 'missing-key', {
      message: 'SERPAPI_KEY not set (AI Overview check)',
    })
    return { status: 'unavailable' }
  }
  if (shouldSkipUpstream('serpapi-ai-overview', entityName)) {
    const cached = getLastGood<AiOverviewResult>(
      'serpapi-ai-overview',
      entityName,
    )
    if (cached) return cached
    return { status: 'unavailable' }
  }
  let res: Response | null = null
  try {
    res = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(entityName)}&api_key=${key}`,
      { signal: AbortSignal.timeout(10_000) },
    )
    if (!res.ok) {
      const kind = classifyUpstreamFailure(res, null)
      const snippet = await peekResponseSnippet(res)
      logUpstreamFailure('serpapi-ai-overview', entityName, kind, {
        status: res.status,
        snippet,
      })
      recordUpstreamFailure('serpapi-ai-overview', entityName, kind)
      const cached = getLastGood<AiOverviewResult>(
        'serpapi-ai-overview',
        entityName,
      )
      if (cached) return cached
      return { status: 'unavailable' }
    }
    const json = (await res.json()) as {
      ai_overview?: {
        text_blocks?: { text?: string; type?: string; snippet?: string }[]
      }
    }
    let result: AiOverviewResult
    if (!json.ai_overview?.text_blocks?.length) {
      result = { status: 'missing' }
    } else {
      const block = json.ai_overview.text_blocks[0]
      const text = block?.snippet ?? block?.text ?? ''
      result = text
        ? { status: 'found', snippet: text.slice(0, 500) }
        : { status: 'missing' }
    }
    recordUpstreamSuccess('serpapi-ai-overview', entityName)
    putLastGood('serpapi-ai-overview', entityName, result)
    return result
  } catch (err) {
    const kind = classifyUpstreamFailure(res, err)
    logUpstreamFailure('serpapi-ai-overview', entityName, kind, {
      status: res?.status,
      message: err instanceof Error ? err.message : String(err),
    })
    recordUpstreamFailure('serpapi-ai-overview', entityName, kind)
    const cached = getLastGood<AiOverviewResult>(
      'serpapi-ai-overview',
      entityName,
    )
    if (cached) return cached
    return { status: 'unavailable' }
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
  if (!rateLimit(`presence-report:${ip}`, 30, 3600)) {
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

  // Key prefix is distinct from the retired scored report so a cached /10
  // payload can never render in the findings UI.
  const cacheKey = `presence-report:${await sha256(normalized)}`
  const cached = cacheGet<InstantReportPayload>(cacheKey)
  if (cached) {
    return NextResponse.json({ ...cached, cached: true })
  }

  // ---- Resolve the entity name + on-page signals -------------------------

  let entityName = ''
  let schemaStatus: FindingStatus = 'missing'
  let schemaEvidence: string | null = null
  let schemaDetail = ''
  let homeStatus: FindingStatus = 'missing'
  let homeDetail = ''

  if (linkedIn) {
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

    schemaStatus = 'missing'
    schemaDetail =
      'A LinkedIn profile exposes no structured data you own. Google reads rented pages last.'
    homeStatus = 'missing'
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

    const identity = data.jsonLd.filter((n) => {
      const t = n['@type']
      const types = (Array.isArray(t) ? t : [t]).filter(
        (x): x is string => typeof x === 'string',
      )
      return types.some((x) =>
        /^(Person|Organization|LocalBusiness|ProfessionalService|Corporation|OnlineBusiness|PodcastSeries)$/i.test(
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
      schemaStatus = 'found'
      schemaEvidence = `${identity.length === 1 ? '1 identity entity' : `${identity.length} identity entities`}, ${sameAsCount} sameAs links`
      schemaDetail = `This page declares who it is about in JSON-LD, with ${sameAsCount} corroborating sameAs links Google can cross-verify.`
    } else if (identity.length > 0) {
      schemaStatus = 'partial'
      schemaEvidence = `${identity.length} identity ${identity.length === 1 ? 'entity' : 'entities'}, 0 to 1 sameAs links`
      schemaDetail =
        'Identity schema exists but carries no corroborating sameAs links, so Google cannot cross-verify it against other surfaces.'
    } else if (data.jsonLd.length > 0) {
      schemaStatus = 'missing'
      schemaEvidence = `${data.jsonLd.length} JSON-LD ${data.jsonLd.length === 1 ? 'block' : 'blocks'}, none identity-typed`
      schemaDetail =
        'Structured data exists, but none of it declares a Person or Organization. Google sees a page here, and no identity.'
    } else {
      schemaStatus = 'missing'
      schemaEvidence = null
      schemaDetail =
        'No structured data at all. Google is guessing at who this page belongs to.'
    }

    const hasTitle = data.openGraph['og:title'] || data.headings.length > 0
    if (identityNode && hasTitle) {
      homeStatus = 'found'
      homeDetail =
        'This page can serve as an Entity Home: a canonical, machine-readable statement of who you are.'
    } else {
      homeStatus = 'missing'
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

  const [kg, wikidata, wikipedia, aiOverview] = await Promise.all([
    fetchGoogleKg(entityName),
    fetchWikidata(entityName),
    searchWikipedia(entityName),
    checkGoogleAiOverview(entityName),
  ])

  const findings: PresenceFinding[] = []

  if (kg.status === 'ok' && kg.entity) {
    findings.push({
      id: 'google-kg',
      label: 'Google Knowledge Graph entity',
      status: 'found',
      evidence: `Entity type: ${kg.entity.type}`,
      detail: `Google recognizes "${kg.entity.name}"${kg.entity.description ? ` (${kg.entity.description})` : ''} as an entity in its Knowledge Graph.`,
      fix: null,
    })
  } else if (kg.status === 'error') {
    findings.push({
      id: 'google-kg',
      label: 'Google Knowledge Graph entity',
      status: 'unavailable',
      evidence: null,
      detail:
        'The Knowledge Graph lookup was unavailable for this scan. Run the report again in a minute.',
      fix: null,
    })
  } else {
    findings.push({
      id: 'google-kg',
      label: 'Google Knowledge Graph entity',
      status: 'missing',
      evidence: null,
      detail: `Google's Knowledge Graph has no entity for "${entityName}". You do not exist in the machine layer Google answers from.`,
      fix: 'kp',
    })
  }

  if (wikidata.status === 'ok' && wikidata.entity) {
    const q = wikidataQNumber(wikidata.entity.sameAs)
    findings.push({
      id: 'wikidata',
      label: 'Wikidata entity',
      status: 'found',
      evidence: q ? `Q-number: ${q}` : null,
      detail: `Wikidata carries "${wikidata.entity.name}"${wikidata.entity.description ? ` (${wikidata.entity.description})` : ''}. This is the seed surface Google trusts most.`,
      fix: null,
    })
  } else {
    findings.push({
      id: 'wikidata',
      label: 'Wikidata entity',
      status: 'missing',
      evidence: null,
      detail: `No Wikidata entry found for "${entityName}". Without a Q-number, the knowledge panel has no root to grow from.`,
      fix: 'kp',
    })
  }

  findings.push({
    id: 'schema',
    label: 'Structured data you own',
    status: schemaStatus,
    evidence: schemaEvidence,
    detail: schemaDetail,
    fix: schemaStatus === 'found' ? null : 'kp',
  })

  if (wikipedia.exact) {
    findings.push({
      id: 'citations',
      label: 'Wikipedia footprint',
      status: 'found',
      evidence: `${wikipedia.mentions.toLocaleString()} mention${wikipedia.mentions === 1 ? '' : 's'} indexed`,
      detail: `Wikipedia carries "${wikipedia.title}". Encyclopedia-grade corroboration is in place.`,
      fix: null,
    })
  } else if (wikipedia.hit) {
    findings.push({
      id: 'citations',
      label: 'Wikipedia footprint',
      status: 'partial',
      evidence: `${wikipedia.mentions.toLocaleString()} mention${wikipedia.mentions === 1 ? '' : 's'}, no article`,
      detail: `Wikipedia mentions "${entityName}" but has no article about you. Partial corroboration only.`,
      fix: 'both',
    })
  } else {
    findings.push({
      id: 'citations',
      label: 'Wikipedia footprint',
      status: 'missing',
      evidence: '0 mentions indexed',
      detail: `No Wikipedia footprint for "${entityName}". Third-party citation is the signal you cannot fake, and it is missing.`,
      fix: 'both',
    })
  }

  findings.push({
    id: 'entity-home',
    label: 'Entity Home',
    status: homeStatus,
    evidence: null,
    detail: homeDetail,
    fix: homeStatus === 'found' ? null : 'kp',
  })

  if (aiOverview.status === 'found') {
    findings.push({
      id: 'ai-overview',
      label: 'Google AI Overview',
      status: 'found',
      evidence: 'live via Google Search',
      detail: aiOverview.snippet,
      fix: null,
    })
  } else if (aiOverview.status === 'missing') {
    findings.push({
      id: 'ai-overview',
      label: 'Google AI Overview',
      status: 'missing',
      evidence: null,
      detail: `Google has not generated an AI Overview for "${entityName}". The AI answer layer has nothing to work with yet.`,
      fix: 'kp',
    })
  } else {
    findings.push({
      id: 'ai-overview',
      label: 'Google AI Overview',
      status: 'unavailable',
      evidence: null,
      detail: 'The AI Overview check did not complete for this scan. Run the report again in a minute.',
      fix: null,
    })
  }

  const report: InstantReportPayload = {
    input: normalized,
    inputKind: linkedIn ? 'linkedin' : 'website',
    entityName,
    findings,
    scannedAt: new Date().toISOString(),
    cached: false,
  }

  cacheSet(cacheKey, report, CACHE_TTL_SECONDS)
  return NextResponse.json(report)
}
