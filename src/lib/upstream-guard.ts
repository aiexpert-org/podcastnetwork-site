/**
 * Upstream guard: per-source circuit breaker, last-good cache, structured
 * failure logging. Used by the Instant Presence Report to stop hammering
 * Google KG / SerpAPI when they are down or key-invalid, and to name the
 * actual root cause in Vercel runtime logs instead of swallowing it.
 *
 * Storage is in-memory per serverless instance (same pattern as
 * server-cache.ts). Cross-instance state would need Vercel KV; not
 * warranted for the current v0.5 traffic level.
 */

export type UpstreamSource = "google-kg" | "serpapi" | "serpapi-ai-overview";

export type UpstreamFailureKind =
  | "missing-key"
  | "http-401"
  | "http-403"
  | "http-429"
  | "http-4xx"
  | "http-5xx"
  | "timeout"
  | "network"
  | "non-json"
  | "unknown";

/** 3 failures in 5 minutes trips the breaker for the same 5-minute window. */
const FAILURE_WINDOW_MS = 5 * 60 * 1000;
const FAILURE_THRESHOLD = 3;

const LAST_GOOD_TTL_MS = 24 * 60 * 60 * 1000;

type FailureLog = { at: number; kind: UpstreamFailureKind };

const failures = new Map<string, FailureLog[]>();
const lastGood = new Map<string, { at: number; value: unknown }>();

function makeKey(source: UpstreamSource, entity: string): string {
  // Case-insensitive so "Brett K Moore" and "brett k moore" share a bucket.
  return `${source}::${entity.toLowerCase().trim()}`;
}

/**
 * Classify a fetch outcome into a stable failure kind so callers can log,
 * count, and (later) route on the same taxonomy the operator reads.
 */
export function classifyUpstreamFailure(
  res: Response | null,
  err: unknown,
): UpstreamFailureKind {
  if (res) {
    if (res.status === 401) return "http-401";
    if (res.status === 403) return "http-403";
    if (res.status === 429) return "http-429";
    if (res.status >= 500) return "http-5xx";
    if (res.status >= 400) return "http-4xx";
  }
  if (err && typeof err === "object" && "name" in err) {
    const name = (err as { name?: string }).name;
    if (name === "TimeoutError" || name === "AbortError") return "timeout";
    if (name === "TypeError") return "network";
    if (name === "SyntaxError") return "non-json";
  }
  return "unknown";
}

/**
 * Rolling-window failure count. Records the outcome and returns true if
 * this call pushed the breaker over the threshold (helper for callers that
 * want to log the exact transition).
 */
export function recordUpstreamFailure(
  source: UpstreamSource,
  entity: string,
  kind: UpstreamFailureKind,
): boolean {
  const key = makeKey(source, entity);
  const now = Date.now();
  const log = (failures.get(key) ?? []).filter(
    (f) => now - f.at < FAILURE_WINDOW_MS,
  );
  log.push({ at: now, kind });
  failures.set(key, log);
  return log.length >= FAILURE_THRESHOLD;
}

/** Clear failure log on any successful call. Breaker resets to closed. */
export function recordUpstreamSuccess(
  source: UpstreamSource,
  entity: string,
): void {
  failures.delete(makeKey(source, entity));
}

/**
 * Returns true if this source has failed FAILURE_THRESHOLD times inside
 * the last FAILURE_WINDOW_MS for this entity. Callers should skip the
 * fetch and serve last-good (or a graceful "unavailable" if none).
 */
export function shouldSkipUpstream(
  source: UpstreamSource,
  entity: string,
): boolean {
  const key = makeKey(source, entity);
  const now = Date.now();
  const log = (failures.get(key) ?? []).filter(
    (f) => now - f.at < FAILURE_WINDOW_MS,
  );
  if (log.length === 0) {
    failures.delete(key);
    return false;
  }
  failures.set(key, log);
  return log.length >= FAILURE_THRESHOLD;
}

export function putLastGood<T>(
  source: UpstreamSource,
  entity: string,
  value: T,
): void {
  lastGood.set(makeKey(source, entity), { at: Date.now(), value });
}

export function getLastGood<T>(
  source: UpstreamSource,
  entity: string,
): T | null {
  const key = makeKey(source, entity);
  const entry = lastGood.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > LAST_GOOD_TTL_MS) {
    lastGood.delete(key);
    return null;
  }
  return entry.value as T;
}

/**
 * Single-line structured log the operator can grep in Vercel runtime logs.
 * Prefix is stable so the log query `upstream-guard` returns the whole set.
 */
export function logUpstreamFailure(
  source: UpstreamSource,
  entity: string,
  kind: UpstreamFailureKind,
  meta: { status?: number; snippet?: string; message?: string } = {},
): void {
  // console.warn is captured by Vercel and shown at "warning" level.
  console.warn(
    `[upstream-guard] ${JSON.stringify({
      source,
      entity,
      kind,
      status: meta.status ?? null,
      // Truncate any upstream body echo so we never leak long error dumps.
      snippet: meta.snippet ? meta.snippet.slice(0, 240) : null,
      message: meta.message ?? null,
      at: new Date().toISOString(),
    })}`,
  );
}

/**
 * Convenience: read up to 240 chars of a Response body for the log
 * without disturbing the caller's flow. Consumes the body clone.
 */
export async function peekResponseSnippet(res: Response): Promise<string> {
  try {
    const cloned = res.clone();
    const text = await cloned.text();
    return text.slice(0, 240);
  } catch {
    return "";
  }
}
