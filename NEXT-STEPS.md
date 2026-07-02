# NEXT-STEPS — Brett's post-build punch list

Every stub, deferred item, and Brett-action item from the Path B v0.5 build.
Ordered by pitch impact. "Invisible to Seth?" = does the stub read as
intentional on July 7, or as broken.

## Before the pitch (high value, low effort)

### 1. Resend API key (application emails)
- **What:** `/api/apply/` validates, logs, and computes the readiness score
  today, but sends no email. Applications land in Vercel function logs
  (search `[application-submit]`) and `/tmp/pn-applications/log.jsonl`.
- **Fix:** create a free Resend account (resend.com), generate an API key,
  add `RESEND_API_KEY` to Vercel env (and optionally `RESEND_FROM` once the
  podcastnetwork.org domain is verified in Resend). No code changes needed.
  Account creation needs your acceptance of their terms, which is why the
  build didn't do it.
- **Invisible to Seth?** Yes. The submit flow completes and shows the
  readiness score either way.

### 2. PostHog key (analytics)
- **What:** PostHog initializes only if `NEXT_PUBLIC_POSTHOG_KEY` is set.
  Vercel Analytics is already live regardless.
- **Fix:** free PostHog account, project API key into Vercel env.
- **Invisible to Seth?** Completely.

### 3. Amazon PA API credentials (live Amazon rank)
- **What:** the AI or Die metrics module shows "Amazon Best Sellers Rank — /
  Pending publisher data connection." Waiting on Mike's credentials from
  Amazon Associates Central.
- **Fix:** add `AMAZON_PA_ACCESS_KEY`, `AMAZON_PA_SECRET_KEY`,
  `AMAZON_PA_PARTNER_TAG` to Vercel env, set the book's ASIN in
  `data/case-studies.json`, and implement the signed request in
  `src/lib/live-metrics.ts` (`fetchAmazonMetrics` is the stub; PA API v5
  AWS4-HMAC signing, ~40 lines, or add `paapi5-nodejs-sdk`).
- **Invisible to Seth?** Yes — the "pending publisher data connection" line
  reads as an honest day-13 state, consistent with the authenticity frame.

### 4. Goodreads book ID + Spotify show ID (live metrics)
- **What:** both empty in `data/case-studies.json`. Goodreads has no index
  for the book yet (checked 2026-07-02); the Spotify show named "AI or Die"
  belongs to another podcast (AlignAI), so it was NOT wired.
- **Fix:** one-line edits in `data/case-studies.json` once you have the real
  Goodreads book ID and the show's Spotify ID. Everything downstream is live.
- **Invisible to Seth?** Yes — "indexing in progress" chips.

### 5. Vercel env vars for production
- Copy `.env.local` values into the Vercel project (SERPAPI_KEY,
  GOOGLE_KG_API_KEY, SPOTIFY_CLIENT_ID/SECRET, NEXT_PUBLIC_SITE_URL).
  Without SERPAPI_KEY and GOOGLE_KG_API_KEY in Vercel, the You Search demo
  degrades to Wikidata-only on the deployed site.

## Assets (polish)

### 6. Founder photos + book cover + logo + OG image
- **What:** `/founders/brett-k-moore.jpg`, `/founders/mike-partners.jpg`,
  `/case-studies/ai-or-die-cover.jpg`, `/brand/logo-primary.png`, and
  `/og/og-default.png` are referenced but not in `public/`. Founder profiles
  render gold monogram avatars (deliberate, reads clean); the featured card
  leads with metrics instead of a cover; OG image 404s silently.
- **Fix:** drop the real assets into `public/` at those paths.
- **Invisible to Seth?** Monograms read as a design choice. The missing OG
  image only matters for link shares.

### 7. Söhne font license
- **What:** body face is Inter (documented fallback). Söhne files were not
  staged at `public/fonts/soehne/`.
- **Fix:** purchase Klim single-domain license (~$600), drop .woff2 files,
  swap the `next/font` config in `src/app/layout.tsx` for a localFont block.
- **Invisible to Seth?** Yes. Inter is the sanctioned fallback per the
  typography override.

## Data quality

### 8. Wikidata Q-numbers (Brett, Mike, PN.org)
- The entity graph shows "Brett on Wikidata" nodes with placeholder targets,
  and the JSON-LD sanitizer strips placeholder sameAs entries. When the real
  Q-numbers exist, update `data/pn-entity-graph.json` and
  `content/schema/10-person-brett.json` / `11-person-mike.json` /
  `01-organization.json`.

### 9. GHL wiring (application → CRM)
- **What:** deferred by design. Applications go to email + log only.
- **Fix (post-launch):** GHL PAT into `GHL_API_KEY`, pipeline + stage IDs,
  then extend `/api/apply/route.ts` with the contact + opportunity POSTs
  (payload shapes documented in dream-site-tech/07).

### 10. Vercel KV (cross-instance caching)
- In-memory cache works per instance; a KV store would share the SerpAPI
  cache across instances and cut SerpAPI usage. v1.5 item.

### 11. Amazon rank sparkline + hourly cron
- The 7-day sparkline (dream-site-tech/04) needs the hourly cron + KV
  buffer + PA API. All deferred with the Amazon stub. v1.5 item unless the
  credentials land before the pitch.

## Verification still owed (needs deployed URL)

- Lighthouse desktop + mobile against the Vercel preview (local dev-mode
  numbers are not representative).
- Google Rich Results Test on all six page types (needs a public URL).
- Brett's manual desktop + mobile walk before cutover, per the definition of
  done.
