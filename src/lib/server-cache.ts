/**
 * Server-side TTL cache + rate limiter.
 *
 * v0.5 uses in-memory storage per serverless instance. This is intentional:
 * no Vercel KV store is provisioned yet, and every consumer of this cache
 * treats a miss as "fetch fresh," so a cold instance costs one extra
 * upstream call, never a broken response. NEXT-STEPS.md tracks the KV
 * upgrade for v1.5 when cross-instance caching starts to matter.
 */

type CacheEntry = { value: unknown; expiresAt: number };

const store = new Map<string, CacheEntry>();
const MAX_ENTRIES = 2000;

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function cacheSet(key: string, value: unknown, ttlSeconds: number) {
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

type RateBucket = { count: number; windowStart: number };
const rateBuckets = new Map<string, RateBucket>();

/** Sliding-window rate limit. Returns true if the request is allowed. */
export function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.windowStart > windowSeconds * 1000) {
    rateBuckets.set(key, { count: 1, windowStart: now });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
