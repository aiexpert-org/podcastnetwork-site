/**
 * The two standalone packages. Single source of truth for pricing, timelines,
 * deliverables, and positioning across the homepage, the two package routes,
 * the JSON-LD offer schema, and the application flow.
 *
 * Locked 2026-07-03 (two-package structure, supersedes the single $30K
 * flagship). Pricing reset 2026-07-05 with Mike (supersedes the 2026-07-04
 * $12,000 state): Brand SERP Install $24,000 total over 12 months, paid up
 * front or split into twelve monthly payments of $2,000. Pre-Sold Author
 * Package $36,000 total, paid up front or split into twelve monthly
 * payments of $3,000; delivery runs the first six months and payments 7
 * through 12 fund ongoing monitoring and maintenance. No discount on
 * payment timing in either direction. Bundle locked 2026-07-05 late: both
 * packages together are $54,000, 10 percent off the $60,000 list, up front
 * or $4,500 x 12; the bundle is the only discount anywhere, and it
 * attaches to scope, never to payment timing.
 *
 * Naming locked 2026-07-05 late (Dispatch sync): the product is the Brand
 * SERP Install. Not Knowledge Panel Install, not AI Presence Install, not
 * Authority Install ("authority" is banned marketing vocabulary). The
 * bundle tier is Both Packages Bundle, matching the live GHL product.
 * Slugs, URLs, anchors, and schema @ids unchanged. GHL products live in
 * sub-account GTfkjwM6RwadEVlbppbd: Brand SERP Install
 * 6a4a8d6d859ba9315419c1fd, PSA 6a4a8df96b558d08208a21c5, bundle
 * 6a4a8e736b558d988f8a28da.
 *
 * Copy rules: no em dashes, no banned vocabulary (including "authority"
 * in marketing copy), no "X, not Y" patterns. Public copy names
 * capabilities, never vendors.
 */

export type PackageId = 'knowledge-panel-install' | 'pre-sold-author'

export type PackagePayment = {
  /** Full sentence-case payment line, e.g.
   * 'Paid up front, or split into 12 monthly payments of $2,000'. */
  planDisplay: string
  /** The monthly figure alone, e.g. '$2,000'. */
  monthlyDisplay: string
  /** Number of monthly payments in the plan. */
  monthlyPayments: number
  /** Optional clarifier when the plan term differs from delivery. */
  note?: string
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
  /** Both packages offer up-front and monthly payment at the same total. */
  payment: PackagePayment
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
  name: 'Brand SERP Install',
  priceUsd: 24000,
  priceDisplay: '$24,000',
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
    planDisplay: 'Paid up front, or split into 12 monthly payments of $2,000',
    monthlyDisplay: '$2,000',
    monthlyPayments: 12,
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
  tagline: 'Turn your expertise into a published book and the launch infrastructure around it.',
  summary:
    'A six-month build that produces a finished book from your own voice, plus the podcast, the audio voice clone, and the launch infrastructure to position it for pre-sales. The name is the goal. Pre-sales depend on execution and market fit, and we do not guarantee them.',
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
    'Author profile build: bio pages, contributor citation surfaces, and a Wikidata Person entry',
  ],
  differentiators: [
    'A finished book manuscript from your own voice',
    'An audio voice clone and voice corpus, exclusive to this package',
    'A publishing option at 10 percent of net, no upfront fee',
    'Launch-window amplification: ARC copies, retail setup, and a podcast tour',
  ],
  payment: {
    planDisplay: 'Paid up front, or split into 12 monthly payments of $3,000',
    monthlyDisplay: '$3,000',
    monthlyPayments: 12,
    note: 'Delivery runs the first 6 months. Payments 7 through 12 fund ongoing monitoring and maintenance.',
  },
}

export const PACKAGES: PackageMeta[] = [KNOWLEDGE_PANEL_INSTALL, PRE_SOLD_AUTHOR]

/** Sum of the two package prices, bought separately. */
export const BOTH_PACKAGES_PRICE_USD =
  KNOWLEDGE_PANEL_INSTALL.priceUsd + PRE_SOLD_AUTHOR.priceUsd
export const BOTH_PACKAGES_PRICE_DISPLAY = '$60,000'

export type BundleMeta = {
  name: string
  priceUsd: number
  priceDisplay: string
  listPriceUsd: number
  listPriceDisplay: string
  savingsDisplay: string
  payment: PackagePayment
}

/** The bundle: both packages at 10 percent off, locked 2026-07-05 late.
 * The only discount anywhere; it attaches to scope, never to payment
 * timing. Named to match the live GHL product. */
export const BUNDLE: BundleMeta = {
  name: 'Both Packages Bundle',
  priceUsd: 54000,
  priceDisplay: '$54,000',
  listPriceUsd: BOTH_PACKAGES_PRICE_USD,
  listPriceDisplay: BOTH_PACKAGES_PRICE_DISPLAY,
  savingsDisplay: '$6,000',
  payment: {
    planDisplay: 'Paid up front, or split into 12 monthly payments of $4,500',
    monthlyDisplay: '$4,500',
    monthlyPayments: 12,
    note: 'Book delivery runs the first 6 months; the panel work and the plan run the year.',
  },
}
