# CHANGELOG

## v0.6.3 — White ground, traditional nav, Presence Score hero (2026-07-04)

- **White ground restored** per Brett's correction: the actual Studio DNA.
  Solar Yellow #FFDD05 is the CTA/accent color only (Apply pill, submit
  buttons, score check-dots, logo hover node). Neutral scale back to warm
  stone; the yellow token pass from v0.6.2 is retired.
- **Traditional header nav.** Inline links on desktop (Knowledge Panel,
  Pre-Sold Author, The Method, Case Studies, Founders + Apply). The Studio
  drawer remains as the mobile menu below lg.
- **Hero pivot.** "This is what a Knowledge Panel looks like from the
  inside" is gone. New hook: "Your online presence is lacking. We can prove
  it." with the Google Knowledge Presence Score tool in the hero: enter a
  website or LinkedIn URL, get a 0-10 score across five checks (Google
  Knowledge Graph 3, Wikidata 2, structured data you own 2, citation
  surfaces 2, Entity Home 1), each miss labeled with the package that fixes
  it, CTA into /apply.
- **/api/presence-score.** Node route reusing the schema-scan extractor,
  entity-lookup source adapters, SSRF guard, rate limiting (30/hr/IP), and
  15-minute cache. LinkedIn profiles resolve their display name via SerpAPI
  search over the profile URL, tolerant of near-miss slugs typed live in a
  demo. LinkedIn scores honestly reflect that a rented profile exposes no
  structured data and is not an Entity Home.
- **eXp demo verification (for Tuesday).** exprealty.com scores 9/10 (all
  green except a partial citation check). linkedin.com/in/glennsanford AND
  the real slug /in/glenndsanford both resolve to Glenn Sanford at 4/10:
  Google KG recognizes him, Wikidata/schema/Entity Home missing. That is
  the pitch in one screen. Note: expworld.com has no website A record
  (mail-only domain) and correctly returns "Domain did not resolve," so
  demo with exprealty.com or expworldholdings.com.
- **DEMO DEPENDENCY:** the score tool needs SERPAPI_KEY and
  GOOGLE_KG_API_KEY set in the Vercel project env. Both exist in the local
  .env.local; if the Vercel preview shows "Knowledge Graph lookup was
  unavailable," add the keys in Vercel and redeploy before Tuesday.
- Homepage reordered: score hero > the two fixes > shared floor > entity
  graph band ("the end state") > marquee > case studies > founders > FAQ.
  The You Search band is retired from the homepage (the score tool
  supersedes it; the component remains in the tree). OG image copy updated.

## v0.6.2 — Solar Yellow splash (2026-07-04)

- **Page ground flips from Vellum cream to Solar Yellow `#FFDD05`** per
  Brett's clarification: the network's own identity color from the catalog
  design tokens, distinct from individual show colors. Dark viz surfaces
  (hero graph, playhead, validator output, AI or Die metrics) stay on Ink
  navy; Papyrus stays as the card surface, which now pops hard against the
  yellow.
- **Contrast-driven token pass, not a find-and-replace.** Every text step
  was checked against #FFDD05: ink moved to the warm near-black #14140F
  (13.7:1), muted grays moved from cool slate to warm stone (5.7:1 body),
  eyebrow bronze darkened to #6B5830 (5.1:1), light neutral steps became
  deeper yellows so GridPattern and tint bands read as shade-of-sun.
  Lighthouse a11y 100 with zero color-contrast failures on home, apply,
  the-package, and knowledge-panel-install.
- **Buttons.** Foil fill was a 1.8:1 invisible boundary on yellow, so
  light-surface Studio buttons now fill bronze (#6B5830, 5.1:1 boundary)
  and brighten to foil on hover; dark-panel buttons keep foil. The logo's
  accent node and ".org" run bronze on light, foil on dark.
- **Hero copy** updated to Brett's two-package line: "Two packages, one
  architecture. Real signals." (headline unchanged). Rides on the
  two-package restructure that landed in the parallel commits.
- Fixed a listitem nesting violation in the shared-floor grid (li now wraps
  FadeIn) that was holding homepage a11y at 97.

## v0.6.1 — Signal marquee (2026-07-02)

- **Dual-direction marquee logo cloud** added to the homepage between the
  case studies preview and the compression section, after the
  createchurchmedia.com parallax pattern Brett flagged: two rows drifting
  opposite directions, 135s per loop, linear infinite, hover + keyboard
  focus pause, soft edge-fade mask, duplicate set aria-hidden, static under
  prefers-reduced-motion. Pure CSS, no JS library.
- **Speed decision.** 135s kept (~13 to 17 px/s at current content widths).
  90s reads visibly animated against Studio's otherwise-still pages; 180s
  stops reading as motion. The two rows differ slightly in px/s because the
  tracks differ in width at equal duration, which strengthens the parallax
  read.
- **Roster decision (flagged for Brett).** The dispatch listed NYT / WSJ /
  HBR / Inc. / Fast Company / TechCrunch / Wired as the top row. Shipping
  unverifiable press logos under "Featured In" contradicts the site's
  honest-signals frame and invites exactly one bad question in the Seth
  pitch. Shipped roster: top row = signal surfaces the entities actually
  index on (Google Knowledge Graph, Wikidata, Amazon, Goodreads, Spotify,
  Apple Podcasts, LinkedIn, X), bottom row = the real network and cohort
  (AI or Die, Legacy Publishing, Apex Podcast Co, AI Expert, In a Moment,
  network shows). Every wordmark links to its proof page. To restore the
  press list once real placements exist: edit SIGNAL_SURFACES in
  src/app/page.tsx; the component takes image wordmarks through
  GrayscaleTransitionImage.
- Wordmarks are typographic (Mona Sans display, muted slate, darken to Ink
  on hover) until real SVG logo assets exist; the text treatment is the
  grayscale-logo analog.

## v0.6 — Studio-fork rebuild (2026-07-02, Fable 5 max mode)

Brett's verdict on the v0.5 shell ("cheap, ugly stock Claude website") triggered
a full chassis swap. The six killer components survived unchanged; everything
around them is now Tailwind Plus Studio.

- **Chassis.** Studio (TS variant) forked wholesale: `RootLayout` with the
  signature `key={pathname}` page transition + border-radius animation
  (mounted once in `app/layout.tsx`), Container/FadeIn/SectionIntro/PageIntro/
  GridList/StatList/Border/GridPattern/Testimonial/Blockquote patterns,
  Studio's Tailwind v4 CSS config, Studio's MDX pipeline (`@next/mdx` +
  shiki + recma-import-images + the work-wrapper layout injection, repointed
  from /work to /case-studies).
- **Palette.** Editorial Premium overlaid on Studio's neutral scale in
  `src/styles/tailwind.css`: white → Papyrus, neutral-950 → Publisher Ink,
  neutral-600 → Slate, light neutrals → warm cream steps, Vellum page ground,
  Foil as the single CTA accent (Studio Button recolored), Signal Blue links.
  Dark viz surfaces (hero graph band, playhead, validator output, AI or Die
  metrics) stay on Ink per the palette lock. `@theme static` because the
  entity graph reads node colors via inline `var()` Tailwind can't see.
- **Fonts.** Mona Sans kept as body + display, now loaded via next/font/local
  (preload, `display: optional`) so the hero-text LCP never waits on it.
  Playfair Display reserved for the founder pullquote; JetBrains Mono for
  validator/metrics readouts. Both skip preload.
- **Pages.** Homepage rebuilt on Studio's rhythm: light PageIntro-style hero,
  rounded-4xl dark band (entity graph + playhead, shared state), GridList
  pillars, dark You Search band (Clients-slot pattern), live case study
  cards, compression prose, FounderAnchorLive, FAQ, ContactSection CTA.
  /case-studies = Studio work-list + live cards; the four case studies are
  MDX on Studio's `caseStudy` wrapper pattern. /founders, /the-method,
  /apply, /the-package, /legal rebuilt on PageIntro/SectionIntro patterns.
- **Brand shell.** PN entity-graph logomark (center Person node fills Foil on
  hover, echoing Studio's logo fill), PN nav (Case Studies / The Method /
  The Package / Founders + Apply CTA), footer with diagnostic callout,
  X + LinkedIn only.
- **Next pinned to 16.1.6.** Next 16.2.x has an MDX regression: every
  page.mdx gets flagged "attempting to export metadata from a component
  marked with use client" even with zero client imports. 16.1.6 is the
  version Studio ships against and builds clean. Revisit on a later 16.2.x.
- **Perf.** Transform-only hero entrance (LCP block never opacity-hidden),
  React Flow chunk gated behind an IntersectionObserver. Lighthouse desktop:
  100 perf, LCP 0.8s, CLS 0. Mobile-throttled: 87 perf, LCP 3.9s simulated
  (lantern ties LCP to the JS graph; observed unthrottled LCP ~150ms) —
  known tradeoff of Studio's motion + the interactive hero. A11y 100,
  SEO 100, best-practices 96 on both.
- **Voice.** Em dashes removed everywhere (AiOrDieMetrics placeholder glyphs
  became mono `--`); no banned vocabulary.
- **Unchanged.** All four API routes, data files, JSON-LD schema stack
  (validated on every route post-rebuild), killer component internals,
  redirects (plus /work → /case-studies), robots, sitemap.

Staging: https://podcastnetwork-site-git-rebuild-v06-studio-fork-aiexpert-org.vercel.app
(Vercel SSO preview, same access model as v0.5 staging.) Main untouched.

---

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
