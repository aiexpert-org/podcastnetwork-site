import { NextResponse } from 'next/server'
import {
  classifyUpstreamFailure,
  peekResponseSnippet,
  shouldSkipUpstream,
} from '@/lib/upstream-guard'

/**
 * Diagnostic endpoint for the Instant Presence Report upstreams.
 *
 * Directly tests Google KG + SerpAPI with the configured keys and returns
 * a normalized report of what each upstream said. Never returns the key
 * values, only presence flags. Never returns more than the first 240
 * characters of any upstream body.
 *
 * Runs on nodejs runtime for parity with the presence-score route.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TIMEOUT_MS = 8000

type UpstreamProbe = {
  status: number | null
  ok: boolean
  kind: string | null
  snippet: string
  breakerOpen: boolean
  timedOut: boolean
  errorMessage: string | null
}

async function probeGoogleKg(entity: string): Promise<UpstreamProbe> {
  const key = process.env.GOOGLE_KG_API_KEY
  const breakerOpen = shouldSkipUpstream('google-kg', entity)
  if (!key) {
    return {
      status: null,
      ok: false,
      kind: 'missing-key',
      snippet: '',
      breakerOpen,
      timedOut: false,
      errorMessage: 'GOOGLE_KG_API_KEY not set in this environment',
    }
  }
  let res: Response | null = null
  try {
    res = await fetch(
      `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(entity)}&key=${key}&limit=1`,
      { signal: AbortSignal.timeout(TIMEOUT_MS) },
    )
    if (!res.ok) {
      const snippet = await peekResponseSnippet(res)
      return {
        status: res.status,
        ok: false,
        kind: classifyUpstreamFailure(res, null),
        snippet,
        breakerOpen,
        timedOut: false,
        errorMessage: null,
      }
    }
    const snippet = await peekResponseSnippet(res)
    return {
      status: res.status,
      ok: true,
      kind: null,
      snippet,
      breakerOpen,
      timedOut: false,
      errorMessage: null,
    }
  } catch (err) {
    const kind = classifyUpstreamFailure(res, err)
    return {
      status: res?.status ?? null,
      ok: false,
      kind,
      snippet: '',
      breakerOpen,
      timedOut: kind === 'timeout',
      errorMessage: err instanceof Error ? err.message : String(err),
    }
  }
}

async function probeSerpApi(entity: string): Promise<UpstreamProbe> {
  const key = process.env.SERPAPI_KEY
  const breakerOpen = shouldSkipUpstream('serpapi-ai-overview', entity)
  if (!key) {
    return {
      status: null,
      ok: false,
      kind: 'missing-key',
      snippet: '',
      breakerOpen,
      timedOut: false,
      errorMessage: 'SERPAPI_KEY not set in this environment',
    }
  }
  let res: Response | null = null
  try {
    // Use engine=google_light with a trivial query so we do not burn a full
    // SerpAPI credit on the diagnostic. If the free-tier account is out of
    // credits SerpAPI still returns a machine-readable error body we can
    // surface here.
    res = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(entity)}&num=1&api_key=${key}`,
      { signal: AbortSignal.timeout(TIMEOUT_MS) },
    )
    if (!res.ok) {
      const snippet = await peekResponseSnippet(res)
      return {
        status: res.status,
        ok: false,
        kind: classifyUpstreamFailure(res, null),
        snippet,
        breakerOpen,
        timedOut: false,
        errorMessage: null,
      }
    }
    // Successful 200 can still carry an error body if credits are exhausted;
    // SerpAPI returns {"error":"..."} inside a 200 response in some tiers.
    const json = (await res.clone().json().catch(() => ({}))) as {
      error?: string
      search_metadata?: { status?: string }
    }
    if (json.error) {
      return {
        status: res.status,
        ok: false,
        kind: 'http-4xx',
        snippet: json.error.slice(0, 240),
        breakerOpen,
        timedOut: false,
        errorMessage: json.error,
      }
    }
    return {
      status: res.status,
      ok: true,
      kind: null,
      snippet: (json.search_metadata?.status ?? '').slice(0, 240),
      breakerOpen,
      timedOut: false,
      errorMessage: null,
    }
  } catch (err) {
    const kind = classifyUpstreamFailure(res, err)
    return {
      status: res?.status ?? null,
      ok: false,
      kind,
      snippet: '',
      breakerOpen,
      timedOut: kind === 'timeout',
      errorMessage: err instanceof Error ? err.message : String(err),
    }
  }
}

export async function GET(req: Request) {
  const entity =
    new URL(req.url).searchParams.get('entity')?.trim() || 'Brett K Moore'

  const [googleKg, serpapi] = await Promise.all([
    probeGoogleKg(entity),
    probeSerpApi(entity),
  ])

  return NextResponse.json(
    {
      env: {
        hasGoogleKgKey: !!process.env.GOOGLE_KG_API_KEY,
        hasSerpApiKey: !!process.env.SERPAPI_KEY,
      },
      entity,
      googleKg,
      serpapi,
      scannedAt: new Date().toISOString(),
    },
    { headers: { 'cache-control': 'no-store' } },
  )
}
