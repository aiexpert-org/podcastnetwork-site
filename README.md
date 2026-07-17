# podcastnetwork-site

Path B v0.5 dream-site rebuild of [podcastnetwork.org](https://podcastnetwork.org).
The site is a live product demo of authority architecture: the homepage hero
is an interactive entity graph, visitors can render their own entity graph
from live data, a draggable six-month playhead mutates the hero, case studies
pull live metrics, and the application opens with a working schema validator.

The old README is archived at `_archive-2026-07-01.md`. Rollback tag:
`v0-legacy-2026-07-01`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 ·
React Flow 11 + d3-force (entity graph) · Framer Motion · react-hook-form +
zod · SWR · Resend · Vercel Analytics + PostHog.

## Develop

```bash
pnpm install
cp .env.example .env.local   # fill in keys
pnpm dev
```

## Key paths

| Path | What |
|---|---|
| `src/components/hero/` | EntityGraphHero (D3 + React Flow hybrid) |
| `src/components/demo/` | YouSearchDemo, SixMonthPlayhead, PlayheadContext |
| `src/components/validator/` | SchemaValidator |
| `src/components/case-studies/` | LiveCaseStudyCard, AiOrDieMetrics |
| `src/components/application/` | ApplicationDiagnostic wizard |
| `src/app/api/` | entity-lookup, schema-scan, case-study-data, apply |
| `src/lib/schema-graph.ts` | JSON-LD composition from content/schema payloads |
| `content/schema/` | The 19 shipped JSON-LD payloads (source of truth) |
| `data/` | Entity graph, playhead keyframes, case studies, founders |

## Build docs

- `CHANGELOG.md` — every autonomous decision from the v0.5 build session.
- `NEXT-STEPS.md` — stubs, deferred items, and Brett-action items.


Full specs live in Google Drive at
`Brett K Moore HQ/01-Businesses/PodcastNetwork.org/rebuild-2026-07-01/`.
