/**
 * The two standalone builds. Single source of truth for pricing, timelines,
 * deliverables, and positioning across the homepage, the retired package
 * routes, the JSON-LD offer schema, and the application flow.
 *
 * Locked 2026-07-03 (two-package structure, supersedes the single $30K
 * flagship). Pricing reset 2026-07-05 with Mike: Brand SERP Build $24,000
 * total over 12 months ($2,000 x 12 or up front); Pre-Sold Author Build
 * $36,000 total ($3,000 x 12 or up front; delivery runs the first six
 * months, payments 7 through 12 fund ongoing monitoring). No discount on
 * payment timing. Bundle: both builds together $54,000, 10 percent off
 * the $60,000 list ($4,500 x 12 or up front); the one discount anywhere,
 * attached to scope, never payment timing.
 *
 * FINAL NAMING LOCK 2026-07-05 (Brett via Dispatch, ends the ping-pong):
 * Ultimate Entity Build (the bundle), Pre-Sold Author Build, Brand SERP
 * Build. Supersedes, in order: Knowledge Panel Install, Google Authority
 * Install (20 minutes), Brand SERP Install, Both Packages Bundle, and The
 * Full Build. The Pre-Sold Author PACKAGE name (locked 2026-06-11) is
 * renamed on the site; vault offering docs and Legacy JV materials still
 * carry Package and need their own pass. The three live GHL products
 * (sub-account GTfkjwM6RwadEVlbppbd: 6a4a8d6d859ba9315419c1fd,
 * 6a4a8df96b558d08208a21c5, 6a4a8e736b558d988f8a28da) still carry the
 * old names until renamed there. Slugs, URLs, and schema @ids unchanged.
 * The old export names remain below as deprecated aliases so the retired
 * route files compile until post-pitch deletion.
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
  /** Both builds offer up-front and monthly payment at the same total. */
  payment: PackagePayment
}

/** Shared floor present in both builds. */
export const SHARED_FLOOR = [
  'A launched podcast, recorded by you and produced for you',
  'An IMDb Person page earned through your podcast credit',
  'A full website if you do not already have one',
  'Author and contributor profiles set up across the surfaces that cite you',
] as const

export const BRAND_SERP_BUILD: PackageMeta = {
  id: 'knowledge-panel-install',
  slug: 'knowledge-panel-install',
  url: '/knowledge-panel-install/',
  name: 'Brand SERP Build',
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

export const PRE_SOLD_AUTHOR_BUILD: PackageMeta = {
  id: 'pre-sold-author',
  slug: 'the-package',
  url: '/the-package/',
  name: 'Pre-Sold Author Build',
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
    'An audio voice clone, exclusive to this build',
    'A voice corpus, exclusive to this build',
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
    'An audio voice clone and voice corpus, exclusive to this build',
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

export const PACKAGES: PackageMeta[] = [BRAND_SERP_BUILD, PRE_SOLD_AUTHOR_BUILD]

/** Sum of the two build prices, bought separately. */
export const BOTH_PACKAGES_PRICE_USD =
  BRAND_SERP_BUILD.priceUsd + PRE_SOLD_AUTHOR_BUILD.priceUsd
export const BOTH_PACKAGES_PRICE_DISPLAY = '$60,000'

export type BundleMeta = {
  name: string
  priceUsd: number
  priceDisplay: string
  listPriceUsd: number
  listPriceDisplay: string
  /** Monthly figure at list price. Unused by the UI since the compare-at
   * strikethrough was killed 2026-07-05; retained as data. */
  listMonthlyDisplay: string
  savingsDisplay: string
  payment: PackagePayment
}

/** The bundle: both builds at 10 percent off, locked 2026-07-05 late.
 * The only discount anywhere; it attaches to scope, never to payment
 * timing. */
export const ULTIMATE_ENTITY_BUILD: BundleMeta = {
  name: 'Ultimate Entity Build',
  priceUsd: 54000,
  priceDisplay: '$54,000',
  listPriceUsd: BOTH_PACKAGES_PRICE_USD,
  listPriceDisplay: BOTH_PACKAGES_PRICE_DISPLAY,
  listMonthlyDisplay: '$5,000',
  savingsDisplay: '$6,000',
  payment: {
    planDisplay: 'Paid up front, or split into 12 monthly payments of $4,500',
    monthlyDisplay: '$4,500',
    monthlyPayments: 12,
    note: 'Book delivery runs the first 6 months; the panel work and the plan run the year.',
  },
}

/** @deprecated Compatibility aliases for the retired package routes.
 * Remove with those routes at post-pitch cleanup. */
export const KNOWLEDGE_PANEL_INSTALL = BRAND_SERP_BUILD
/** @deprecated See KNOWLEDGE_PANEL_INSTALL note. */
export const PRE_SOLD_AUTHOR = PRE_SOLD_AUTHOR_BUILD
/** @deprecated See KNOWLEDGE_PANEL_INSTALL note. */
export const BUNDLE = ULTIMATE_ENTITY_BUILD
