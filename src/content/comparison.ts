/**
 * Feature comparison data for the three-tier pricing section. Rows come
 * from the real deliverables in packages.ts; nothing appears here that a
 * package does not actually include. Cells: true renders a check, false
 * renders an x, a string renders as text.
 */

export type TierKey = 'kp' | 'both' | 'psa'

export type ComparisonCell = boolean | string

export type ComparisonFeature = {
  name: string
  tiers: Record<TierKey, ComparisonCell>
}

export type ComparisonSection = {
  name: string
  features: ComparisonFeature[]
}

export const COMPARISON_SECTIONS: ComparisonSection[] = [
  {
    name: 'Google recognition',
    features: [
      {
        name: 'Google Knowledge Panel with its qualifying signal set',
        tiers: { kp: true, both: true, psa: false },
      },
      {
        name: 'Wikidata entry',
        tiers: { kp: 'Q-number', both: 'Q-number', psa: 'Person entry' },
      },
      {
        name: 'Wikipedia submission attempt, resubmitted once if needed',
        tiers: { kp: true, both: true, psa: false },
      },
      {
        name: 'First-page ownership of your brand search',
        tiers: { kp: true, both: true, psa: false },
      },
      {
        name: 'Schema.org JSON-LD stack',
        tiers: { kp: true, both: true, psa: false },
      },
      {
        name: 'Search cleanup',
        tiers: { kp: 'Up to 5', both: 'Up to 5', psa: false },
      },
    ],
  },
  {
    name: 'AI answers',
    features: [
      {
        name: 'Coverage across the major AI assistants',
        tiers: { kp: true, both: true, psa: false },
      },
      {
        name: 'AI answer testing across the year',
        tiers: { kp: '48 tests', both: '48 tests', psa: false },
      },
    ],
  },
  {
    name: 'The book',
    features: [
      {
        name: 'Eight private interviews as your raw material',
        tiers: { kp: false, both: true, psa: true },
      },
      {
        name: 'Finished manuscript from your own voice',
        tiers: { kp: false, both: 'By month 3', psa: 'By month 3' },
      },
      {
        name: 'Audio voice clone and voice corpus',
        tiers: { kp: false, both: true, psa: true },
      },
      {
        name: 'Legacy Publishing option at 10 percent of net',
        tiers: { kp: false, both: true, psa: true },
      },
      {
        name: 'ARC copies, retail setup, and launch sequence',
        tiers: { kp: false, both: true, psa: true },
      },
    ],
  },
  {
    name: 'Podcast, press, and reporting',
    features: [
      {
        name: 'A launched podcast, produced for you',
        tiers: {
          kp: '3 episodes',
          both: 'Up to 8 episodes',
          psa: 'Up to 5 episodes',
        },
      },
      {
        name: 'IMDb Person page through your podcast credit',
        tiers: { kp: true, both: true, psa: true },
      },
      {
        name: 'A full website if you do not already have one',
        tiers: { kp: true, both: true, psa: true },
      },
      {
        name: 'Placed article and five press releases',
        tiers: { kp: true, both: true, psa: false },
      },
      {
        name: 'Guest placements on established shows',
        tiers: { kp: '3 shows', both: '3 shows + launch tour', psa: 'Launch tour' },
      },
      {
        name: 'Monthly executive reports',
        tiers: { kp: '12', both: '12', psa: false },
      },
      {
        name: 'Quarterly Knowledge Panel verifications',
        tiers: { kp: '4', both: '4', psa: false },
      },
    ],
  },
]
