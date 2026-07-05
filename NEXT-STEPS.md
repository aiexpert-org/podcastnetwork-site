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

### 9. GHL wiring (application → CRM) — CODE COMPLETE, awaiting your go
- **What:** the parallel GHL setup task (2026-07-02) shipped the PAT,
  Application Funnel pipeline, and custom fields, so the sync is now fully
  implemented in `src/app/api/apply/ghl.ts`: contact upsert + full intake
  note + opportunity in New Application at $30,000. Per your "GHL wiring is
  post-launch" directive, the `GHL_API_KEY` was NOT added to Vercel; without
  it the route skips GHL cleanly (`crm_pending_ghl_key` warning) and the
  email + log path carries the submission.
- **To go live:** add `GHL_API_KEY` (the PAT from
  operations/ghl-ids-reference.md) to Vercel env. Pipeline/stage/location
  IDs are already defaulted in code. One env var, no code changes.
- **Field-group note:** the GHL custom fields were scaffolded for the older
  12-question diagnostic; the v0.5 six-question answers that have no
  matching field (situation, KP status, audience band, timeline, budget)
  land in the contact note. Reconcile the field group when convenient.
- **2026-07-04 correction:** the opportunity now posts with monetaryValue 0
  by design (sales sets the package after the discovery call), so the
  "$30,000" above describes the older behavior and no longer ships.

### 10. Vercel KV (cross-instance caching)
- In-memory cache works per instance; a KV store would share the SerpAPI
  cache across instances and cut SerpAPI usage. v1.5 item.

### 11. Amazon rank sparkline + hourly cron
- The 7-day sparkline (dream-site-tech/04) needs the hourly cron + KV
  buffer + PA API. All deferred with the Amazon stub. v1.5 item unless the
  credentials land before the pitch.

## Verification still owed

- **Rich Results Test needs a public URL.** Preview deployments are behind
  Vercel SSO (project setting: "all except custom domains"). I was not
  authorized to loosen that setting. Two options: (a) you disable Deployment
  Protection for this project (Vercel dashboard → podcastnetwork-site →
  Settings → Deployment Protection) and I run Rich Results against staging,
  or (b) run it against production right after cutover. The JSON-LD on every
  page was structurally validated locally (single @graph, all payloads
  parse, zero unresolved placeholders).
- **Brett's staging walk.** You can view the preview while logged into
  Vercel: https://podcastnetwork-site-git-rebuild-path-b-v05-aiexpert-org.vercel.app
  Desktop + mobile walk before cutover, per the definition of done.
- **Production cutover** = merge `rebuild/path-b-v0.5` into `main` (Vercel
  auto-deploys podcastnetwork.org). Held for your walk per the locked
  timeline (staging QA 07-05, cutover 07-06). Say the word and I merge.

## Lighthouse notes (local production build, documented tradeoffs)

- Desktop: perf 100, SEO 100, CLS 0, TBT 0ms, LCP 0.6-0.7s on all pages.
  A11y 96-100 (the method page's 96 is React Flow node tap-targets when the
  inset graph is zoomed out; nodes are keyboard-focusable and the content is
  supplemental).
- Mobile: perf 89-93 (target 85+ met). LCP 3.2-3.8s on simulated slow-4G vs
  the 3.0s aspiration; the residual is web-font paint + the JS graph being
  the largest viewport element. Real production (Vercel edge + real devices)
  should land under; re-measure after cutover before optimizing further.
- The one "errors-in-console" flag locally is `/_vercel/insights/script.js`
  404, which only exists on Vercel infrastructure. Not present in production.

## v0.6 addendum (2026-07-02, Studio-fork rebuild)

Everything above still applies (env keys, metrics IDs, GHL). New items:

- **Walk the v0.6 staging build:** the Studio-fork preview is at
  https://podcastnetwork-site-git-rebuild-v06-studio-fork-aiexpert-org.vercel.app
  (log into Vercel to pass the SSO gate). v0.5 staging remains untouched on
  its own branch for comparison.
- **Rich Results Test** needs a publicly fetchable URL, so it runs at
  cutover (or temporarily disable deployment protection on the preview).
  The JSON-LD graph was validated locally on every route in this build.
- **Next 16.2.x upgrade blocked** by an MDX metadata regression (see
  CHANGELOG). Pinned 16.1.6. Re-test before any Next upgrade.
- **Studio license note:** chassis is Tailwind Plus Studio under Brett's
  Tailwind Plus license; fine for company sites, don't open-source the repo
  without stripping the template.

## v0.6.4 addendum (2026-07-04, two-tier diagnostic + 3-surface collapse)

Everything above still applies. New items, priority order:

1. **Domain claim (THE Tuesday blocker, Brett clicks).** podcastnetwork.org
   resolves to Vercel edge but is not attached to this project (only
   vercel.app domains are), and the live domain still serves the March
   original site. In Vercel: AI Expert team → podcastnetwork-site →
   Settings → Domains → Add podcastnetwork.org + www. If Vercel reports the
   domain is in use by another account, add the `_vercel` TXT record it
   gives you at GoDaddy DNS and hit Verify. The moment it attaches,
   production = current main (the June 29 build) until this branch merges.
   Per Brett 2026-07-04: claim happens at cutover on July 5.
2. **Tier 2 question copy needs Brett's wording pass.** The ten-step flow
   ships with drafted copy per the locked question shape. Edit the STEPS
   array in `src/components/assessment/AssessmentFlow.tsx` and the
   recommendation templates in `src/app/api/assessment/route.ts`
   (`recommend()`); the flow, scoring, and CRM wiring do not change with
   copy edits.
3. **Assessment email delivery + drips ride on GHL** per HQ canon (email
   infra is GHL). Add `GHL_API_KEY`, then build three drips in GHL keyed on
   the `assessment-segment-*` / `assessment-rec-*` tags. The on-screen flow
   promises no email until that is live. If you want an interim Resend send
   instead, say so and it wires in an hour.
4. **Trust bar numbers.** Section 2 ships with the honest floor (founders,
   application-only, live-data standard). Supply the specific proof numbers
   you want on the strip and they drop in.
5. **PAGESPEED_API_KEY** in Vercel env for demo-day quota headroom on the
   Lighthouse finding. Keyless PSI works at low volume; a shared demo room
   hammering it might not stay low volume.
6. **Demo playbook (Tuesday):** use exprealty.com or expworldholdings.com,
   never expworld.com (no A record, correctly errors).
   linkedin.com/in/glennsanford resolves via SerpAPI. The Lighthouse row
   takes up to 30 seconds; either talk over it or run the URL once before
   the meeting so the cache serves it instantly.
7. **Post-pitch cleanup:** delete the five killed route directories
   (the-method, case-studies, founders, the-package,
   knowledge-panel-install) and the case-studies MDX wrapper config in
   next.config.mjs; rename PresenceScoreHero.tsx → InstantReport.tsx;
   repoint schema-graph offer/FAQ URLs from the killed routes to the
   homepage anchors (redirects preserve them meanwhile).
