/**
 * The two standalone packages. Single source of truth for pricing, timelines,
 * deliverables, and positioning across the homepage, the two package routes,
 * the JSON-LD offer schema, and the application flow.
 *
 * Locked 2026-07-03 (two-package structure, supersedes the single $30K
 * flagship). Knowledge Panel Install pricing settled 2026-07-04 (final):
 * $10,000 flat, paid up front or split into twelve equal monthly payments at
 * no extra cost. No discount in either direction (supersedes the brief
 * $12,000 reprice and the pay-in-full discount from earlier the same
 * evening). Both packages are standalone. An executive who wants both pays
 * $46,000 total, no bundle discount. Podcast, IMDb, and a full website (if
 * the executive does not already have one) are the shared floor in both. The
 * audio voice clone and voice corpus are exclusive to the Pre-Sold Author
 * Package.
 *
 * Copy rules: no em dashes, no banned vocabulary, no "X, not Y" patterns.
 * Public copy names capabilities, never vendors.
 */

export type PackageId = 'knowledge-panel-install' | 'pre-sold-author'

export type PackagePayment = {
  /** Full sentence-case payment line, e.g.
   * 'Paid up front, or split into 12 equal monthly payments'. */
  planDisplay: string
}

export type PackageMeta = {
  id: PackageId
  slug: string
  url: string
  name: string
  priceUsd: number
  priceDisplay: string
  timelineMonths: number
  timelineDisplay: string
  eligibleDurationMonths: number
  tagline: string
  summary: string
  timeInvestment: string
  whoFor: string
  deliverables: string[]
  differentiators: string[]
  /** Present when the package offers more than one way to pay. */
  payment?: PackagePayment
}

/** Shared floor present in both packages. */
export const SHARED_FLOOR = [
  'A launched podcast, recorded by you and produced for you',
  'An IMDb Person page earned through your podcast credit',
  'A full website if you do not already have one',
  'Author and contributor profiles set up across the surfaces that cite you',
] as const

export const KNOWLEDGE_PANEL_INSTALL: PackageMeta = {
  id: 'knowledge-panel-install',
  slug: 'knowledge-panel-install',
  url: '/knowledge-panel-install/',
  name: 'Knowledge Panel Install',
  priceUsd: 10000,
  priceDisplay: '$10,000',
  timelineMonths: 12,
  timelineDisplay: '12 months',
  eligibleDurationMonths: 12,
  tagline: 'Make Google recognize you as a real entity, and keep proving it for a year.',
  summary:
    'A twelve-month build that turns you into a person Google, and the AI answer engines behind it, can recognize and describe. Podcast, Knowledge Panel, Wikipedia and Wikidata attempt, schema stack, press, and a year of monthly verification and reporting.',
  timeInvestment: 'About 7 to 10 hours over 12 months, most of it recording three podcast episodes.',
  whoFor:
    'Any executive, author, entrepreneur, or professional who wants Google and the AI answer engines to know exactly who they are, with a year of monitoring to make it stick.',
  deliverables: [
    'A podcast with three episodes you record, launched and produced for you',
    'An IMDb Person page earned through your podcast credit',
    'A Google Knowledge Panel with its full qualifying signal set',
    'AI answer engine coverage across the major assistants, with monthly testing (48 tests over 12 months)',
    'First-page-of-Google ownership of your brand search',
    'A Wikipedia article submission attempt, with one resubmission in the back half if the first does not land',
    'A Wikidata Q-number',
    'A Schema.org JSON-LD stack',
    'A full website if you do not already have one',
    'A schema optimization pass on your existing site, up to five pages',
    'An optimization audit of your existing podcast if you have one',
    'Social handle consistency across up to five accounts',
    'A placed article on an industry-relevant publication',
    'Five press releases distributed',
    'Three podcast guest placements on shows doing 10,000+ monthly downloads',
    'Search cleanup, up to five corrections',
    'Twelve monthly executive reports',
    'Four quarterly Knowledge Panel verifications',
    'Schema stack updates, up to two major revisions',
    'Author profile setup across the primary distribution and citation surfaces',
    'Podcast setup and branding',
    'Ongoing monitoring and reporting infrastructure',
  ],
  differentiators: [
    'The Google Knowledge Panel and its qualifying signal set',
    'AI answer engine coverage with monthly testing',
    'Wikipedia attempt and a Wikidata entry',
    'Twelve monthly reports and four quarterly Knowledge Panel verifications',
  ],
  payment: {
    planDisplay: 'Paid up front, or split into 12 equal monthly payments',
  },
}

export const PRE_SOLD_AUTHOR: PackageMeta = {
  id: 'pre-sold-author',
  slug: 'the-package',
  url: '/the-package/',
  name: 'Pre-Sold Author Package',
  priceUsd: 36000,
  priceDisplay: '$36,000',
  timelineMonths: 6,
  timelineDisplay: '6 months',
  eligibleDurationMonths: 6,
  tagline: 'Turn your expertise into a published book and the authority infrastructure around it.',
  summary:
    'A six-month build that produces a finished book from your own voice, plus the podcast, the audio voice clone, and the authority infrastructure to position it for pre-sales. The name is the goal. Pre-sales depend on execution and market fit, and we do not guarantee them.',
  timeInvestment: 'About 21 to 24 hours over 6 months, across interviews and podcast recording.',
  whoFor:
    'Any executive, author, entrepreneur, or professional with something worth a book who wants it written, produced, and positioned inside six months.',
  deliverables: [
    'A podcast, either four episodes recorded with guests or three to five audio-only episodes produced from your voice clone',
    'Eight private interviews that become the raw material for your book',
    'A finished book manuscript delivered by month three',
    'An audio voice clone, exclusive to this package',
    'A voice corpus, exclusive to this package',
    'A publishing option through our Legacy Publishing partner at 10 percent of net royalties, so you keep roughly 90 percent',
    'An IMDb Person page earned through your podcast credit',
    'A full website if you do not already have one',
    'Author profile setup across the major distribution platforms',
    'Podcast setup and branding',
    'Book cover and interior layout through the Legacy partnership',
    'ARC copies for launch-week amplification',
    'Retail distribution setup through the Legacy partnership',
    'Podcast tour placements timed to your launch window',
    'Launch sequence coordination',
    'Author authority build: bio pages, contributor citation surfaces, and a Wikidata Person entry',
  ],
  differentiators: [
    'A finished book manuscript from your own voice',
    'An audio voice clone and voice corpus, exclusive to this package',
    'A publishing option at 10 percent of net, no upfront fee',
    'Launch-window amplification: ARC copies, retail setup, and a podcast tour',
  ],
}

export const PACKAGES: PackageMeta[] = [KNOWLEDGE_PANEL_INSTALL, PRE_SOLD_AUTHOR]

/** Combined price when an executive takes both. No bundle discount. */
export const BOTH_PACKAGES_PRICE_USD =
  KNOWLEDGE_PANEL_INSTALL.priceUsd + PRE_SOLD_AUTHOR.priceUsd
export const BOTH_PACKAGES_PRICE_DISPLAY = '$46,000'
