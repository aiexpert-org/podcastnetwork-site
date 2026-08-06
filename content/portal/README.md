# Portal content

Every author on the portal has a folder here: `content/portal/{author-slug}/`.
The folder holds six MDX files that back the portal's six sections. Pages
read YAML frontmatter for structured data and render the MDX body as prose.

## Files per author

- `config.mdx` — author metadata, current phase, milestones, overall progress
- `audiobook.mdx` — chapter table, production phase, samples
- `manuscript-review.mdx` — themes, chapter-by-chapter feedback, strengths + gaps
- `voice-corpus.mdx` — 23-dimension analysis, summary, corpus stats
- `quiz.mdx` — intro copy for the Communication DNA quiz
- `deliverables.mdx` — every artifact PN.org ships to the author

## Adding an author

1. Add an entry to `src/lib/portal/authors.ts` (`PORTAL_AUTHORS` array).
2. Create `content/portal/{new-slug}/` with the six MDX files above (copy
   the Steve Chua folder as a template and clear the fields).
3. Push. Vercel auto-deploys. The author can then request their magic link
   at `/portal/login/`.

## Content pipeline (v0.2 target)

The MDX files are handwritten in v0.1. v0.2 will generate them from the
canonical HQ artifacts:

- `voice-corpus.mdx` frontmatter ← output of the Voice Corpus install task
  (session `local_9583a4f1-61ac-4f81-9f66-7f9e2aa81f46`)
- `manuscript-review.mdx` frontmatter ← manuscript editorial review task
- `quiz.mdx` body ← Communication DNA quiz JSON (session
  `local_cd5290a6-16d4-4346-b174-bba5dc556a16`)
- `audiobook.mdx` frontmatter ← Legacy audiobook production SOP tracking
  (`System/operating-procedures/legacy-audiobook-production-sop-2026-07-17.md`)
