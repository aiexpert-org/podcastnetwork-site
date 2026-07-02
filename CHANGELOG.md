# CHANGELOG — Path B v0.5 rebuild

Build session: 2026-07-02, Fable 5 max mode. Every autonomous decision Brett
might want to review is logged here. Stubs and Brett-action items live in
NEXT-STEPS.md.

## Repo + scaffold

- **Repo name.** The dispatch prompt referenced `aiexpert-org/podcastnetwork-org`,
  which does not exist on GitHub. Spec `path-b-v0.5/09-repo-scaffold-override.md`
  explicitly names `podcastnetwork-site` as canonical ("do not rename").
  Built in `aiexpert-org/podcastnetwork-site`.
- **Branch name.** Used `rebuild/path-b-v0.5` per the locked spec (the
  dispatch prompt's `v0.5-dream-site-rebuild` was treated as shorthand).
- **Rollback tag** `v0-legacy-2026-07-01` created on main and pushed before
  the reset (it did not previously exist).
- **Old README** archived to `_archive-2026-07-01.md` on the rebuild branch.
- **Scaffold** copied from `aiexpert-org/nextjs-site-template` (Next 16.2 +
  React 19 + Tailwind v4 + TS strict), dropping the template's internal
  playbook docs. Template content/ tree not carried over.

## Dependency decisions (vs dream-site-tech/09-tech-stack-final.md)

- **SerpAPI, Spotify, Google KG, Wikidata: native fetch** instead of the
  `serpapi` / `spotify-web-api-node` SDKs. All four integrations are single
  GET requests plus one token exchange; the SDKs added weight without value.
- **`paapi5-nodejs-sdk` not installed.** Amazon PA API is stubbed until
  credentials arrive (see NEXT-STEPS). The adapter interface in
  `src/lib/live-metrics.ts` is ready for a signed-request implementation.
- **`jsonld` library skipped.** JSON-LD extraction is script-tag parsing +
  JSON.parse; the full expansion library wasn't needed for the validator's
  rubric and it is heavy on the edge bundle.
- **`@vercel/kv` skipped for v0.5.** No KV store is provisioned on the
  project. `src/lib/server-cache.ts` provides an in-memory TTL cache + rate
  limiter per serverless instance; every consumer treats a cache miss as
  "fetch fresh." KV upgrade tracked in NEXT-STEPS for v1.5.
- **MDX not used.** All copy ships as typed TS/TSX content (the copy is
  locked and static for v0.5; MDX plumbing added build risk without a
  authoring benefit this release). Revisit for v1.5 /notes.
- **`@react-email` skipped.** Resend emails use hand-rendered HTML strings.

## Design + layout decisions

- **Sections 1-3 of the homepage (hero graph, You Search, playhead) render as
  one continuous full-bleed dark band.** The palette lock says dark panels are
  always full-bleed and never floating cards; the You Search result reuses the
  dark-ground entity graph component, so the whole top-of-page demo band is
  Ink with light editorial sections below. This follows the palette doc's
  hybrid pattern while honoring the sitemap's section order.
- **Playhead default = Day 180 (full graph).** dream-site-tech/03 specifies
  Day 180 default ("visitors see the finished picture first, then scrub
  back"); the homepage-sections design note said Month 0. Went with 180,
  which also matches the hero spec's `initialState` default of "full."
- **Playhead is horizontal at all breakpoints** (dream-site-tech/03) rather
  than vertical-on-mobile (component override list). The SVG scales to
  container width and the drag math is resolution-independent.
- **Schema validator lives on /apply/ only.** The component override list
  mentioned an embedded homepage preview, but the locked homepage-sections
  override defines Section 8 as CTA + FAQ with no validator instance.
  Homepage copy points at the /apply/ validator.
- **Application form question set** follows the sitemap override (situation,
  KP status, audience, timeline, budget, optional open text) with email added
  to Q1 so the confirmation + follow-up loop works. Readiness scoring adapted
  from the dream-site spec weights: schema 30%, audience 30%, situation 20%,
  timeline 20%.
- **Package-page FAQ renders the exact Question/acceptedAnswer text from the
  shipped schema payload** (content/schema/05-faqpage.json), so on-page text
  and JSON-LD match verbatim, per the FAQ build note.
- **Founder portraits render as gold monogram avatars** until photo assets
  land (no image assets exist in the repo). Same for the AI or Die cover
  (the featured card leads with the live metrics panel instead).
- **Homepage FAQ UI copy** condensed from copy/faq-page.md to the 2-3
  sentence range the section spec requires; the FAQPage schema for the
  homepage uses the payload's canonical Question entities.

## Engineering decisions

- **D3 layout computed synchronously** (`sim.tick(300)` at mount) instead of
  d3-timer's rAF loop. Rationale: avoids ~5s of 60fps re-renders on load
  (LCP), and rAF-driven simulation never runs in throttled/background tabs.
  Entry animation is handled by framer-motion stagger + CSS edge fade, idle
  drift by a pure-CSS float loop (disabled under prefers-reduced-motion).
  Drag interactions reheat the simulation via a manual rAF tick loop.
- **React Flow controlled mode requires applying dimension changes** via
  `onNodesChange` + `applyNodeChanges`; without it, edges never render.
- **Playhead graph filtering:** the simulation always runs on the full
  30-node graph; scrubbing filters which nodes/edges render. Node positions
  stay stable across the whole scrub range.
- **Trailing-slash policy is on** per the URL structure spec; all client
  fetches use `/api/.../` forms to avoid 308 redirects on API calls.
- **Legal placeholder pages are noindex** and `/legal/` is disallowed in
  robots.txt until v0.6 ships real content.
- **Entity-lookup dedup** canonicalizes twitter.com → x.com and strips www
  before merging sameAs profiles across the three sources.
- **In-launch case study schema** emits a minimal Person (+Book when a real
  working title exists) instead of the author template payload, which is
  placeholder-heavy. Michele and Rob ship without Book nodes ("in
  development" is not a title).
- **SSRF guard** on the schema scanner: DNS resolution + private-range check
  (v4 + v6), scheme allowlist, 5MB body cap, 20 scans/IP/hour.
- **Analytics:** Vercel Analytics always on; PostHog initializes only when
  `NEXT_PUBLIC_POSTHOG_KEY` exists (see NEXT-STEPS). Event names per spec:
  you_search_submit, playhead_drag, schema_validator_run, application_start,
  application_step_complete, application_submit.

## Data decisions

- **Spotify show ID left empty on purpose.** Spotify search for "AI or Die"
  returns a show by that name (id 3v5GH6dAcdtU16KNfjaHkm), but it belongs to
  AlignAI (hosts Rehgan, Nick, Brendan), not Brett + Mike. Wiring it would
  render someone else's numbers. The metrics module shows the honest
  "show linking in progress" state until the real show ID lands.
- **Goodreads book ID left empty.** Goodreads search has nothing indexed for
  the book yet (day 9 in market). The module renders "indexing in progress,"
  which fits the day-13 authenticity frame.
- **In-launch month positions** (Michele 3/6, Dominic 2/6, Rob 4/6) taken
  from the locked homepage-sections copy.
