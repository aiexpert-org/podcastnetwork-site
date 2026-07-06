import Link from 'next/link'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import {
  ULTIMATE_ENTITY_BUILD,
  BRAND_SERP_BUILD,
  PRE_SOLD_AUTHOR_BUILD,
} from '@/content/packages'
import {
  COMPARISON_SECTIONS,
  type TierKey,
  type ComparisonCell,
} from '@/content/comparison'

/**
 * Adapted in full from the Tailwind Plus "Three tiers with feature
 * comparison" pricing section, harvested from Brett's Plus session
 * (2026-07-05). Pure CSS toggle via :has(); server component.
 *
 * Copy per the 2026-07-05 homepage copy lock: eyebrow only (The builds.),
 * no H2, no sub-paragraph, locked short blurbs per card. Tier order and
 * treatments per the final naming lock: Ultimate Entity Build ($54,000,
 * left anchor, standard card, Save $6,000 chip), Pre-Sold Author Build
 * ($36,000, featured middle: white panel, solar ring, centered glow),
 * Brand SERP Build ($24,000, right, standard). Old anchors live on as
 * invisible alias spans. Flagged for the walk-through: the locked PSA
 * blurb reads "Brand SERP Build plus manuscript..." while the comparison
 * table's PSA column continues to reflect the standalone-build scope.
 */

function CheckIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function XMarkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

type Tier = {
  key: TierKey
  anchorId: string
  /** Retired anchor id kept as an invisible alias for existing links. */
  legacyAnchorId?: string
  name: string
  description: string
  monthly: string
  upfront: string
  monthlyNote: string
  note?: string
  featured: boolean
  saveChip?: string
  highlights: string[]
}

const TIERS: Tier[] = [
  {
    key: 'both',
    anchorId: 'ultimate-entity-build',
    legacyAnchorId: 'the-full-build',
    name: ULTIMATE_ENTITY_BUILD.name,
    description: 'Everything. Both builds, running together. Save $6,000.',
    monthly: ULTIMATE_ENTITY_BUILD.payment.monthlyDisplay,
    upfront: ULTIMATE_ENTITY_BUILD.priceDisplay,
    monthlyNote: `12 payments, ${ULTIMATE_ENTITY_BUILD.priceDisplay} total`,
    featured: false,
    saveChip: `Save ${ULTIMATE_ENTITY_BUILD.savingsDisplay}`,
    highlights: [
      `Everything in the ${BRAND_SERP_BUILD.name}`,
      `Everything in the ${PRE_SOLD_AUTHOR_BUILD.name}`,
      'Reddit citation strategy',
      `10 percent off the ${ULTIMATE_ENTITY_BUILD.listPriceDisplay} the two cost separately`,
      'One team holding both builds in parallel',
    ],
  },
  {
    key: 'psa',
    anchorId: 'pre-sold-author-build',
    legacyAnchorId: 'pre-sold-author',
    name: PRE_SOLD_AUTHOR_BUILD.name,
    description: 'The book that sells itself before it ships. Brand SERP Build plus manuscript, launch, and pre-sale. 30+ authors already published.',
    monthly: PRE_SOLD_AUTHOR_BUILD.payment.monthlyDisplay,
    upfront: PRE_SOLD_AUTHOR_BUILD.priceDisplay,
    monthlyNote: `12 payments, ${PRE_SOLD_AUTHOR_BUILD.priceDisplay} total`,
    note: PRE_SOLD_AUTHOR_BUILD.payment.note,
    featured: true,
    highlights: [...PRE_SOLD_AUTHOR_BUILD.differentiators],
  },
  {
    key: 'kp',
    anchorId: 'brand-serp-build',
    legacyAnchorId: 'knowledge-panel',
    name: BRAND_SERP_BUILD.name,
    description: 'The foundation. Google, Wikidata, and every major AI answer engine, recognizing you as the entity you already are.',
    monthly: BRAND_SERP_BUILD.payment.monthlyDisplay,
    upfront: BRAND_SERP_BUILD.priceDisplay,
    monthlyNote: `12 payments, ${BRAND_SERP_BUILD.priceDisplay} total`,
    featured: false,
    highlights: [...BRAND_SERP_BUILD.differentiators],
  },
]

function Cell({ value, featured }: { value: ComparisonCell; featured: boolean }) {
  if (typeof value === 'string') {
    return (
      <span
        className={clsx(
          featured ? 'font-semibold text-neutral-950' : 'text-neutral-950',
          'text-sm/6',
        )}
      >
        {value}
      </span>
    )
  }
  return (
    <>
      {value === true ? (
        <CheckIcon aria-hidden="true" className="mx-auto size-5 text-neutral-950" />
      ) : (
        <XMarkIcon aria-hidden="true" className="mx-auto size-5 text-neutral-300" />
      )}
      <span className="sr-only">{value === true ? 'Yes' : 'No'}</span>
    </>
  )
}

export function PricingSection() {
  return (
    <form className="group/tiers isolate">
      {/* Dark band: full viewport width, rounded on all four sides per the
          quiz-card treatment. The glow clips inside its own layer below so
          the band itself never clips the cards hanging past its bottom. */}
      <div className="relative flow-root rounded-3xl bg-neutral-950 pt-16 pb-16 sm:pt-20 lg:pb-0">
        {/* Solar glow, clipped to the rounded band, centered behind the
            featured middle card. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
        >
          <svg
            viewBox="0 0 1208 1024"
            aria-hidden="true"
            className="absolute -bottom-48 left-1/2 h-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
          >
            <ellipse cx={604} cy={512} rx={604} ry={512} fill="url(#pn-solar-glow)" />
            <defs>
              <radialGradient id="pn-solar-glow">
                <stop stopColor="#FFDD05" stopOpacity={0.55} />
                <stop offset={1} stopColor="#FFDD05" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative z-10">
            <p className="text-center font-display text-sm font-semibold tracking-wider text-neutral-400 uppercase">
              The builds.
            </p>
            <div className="mt-10 flex justify-center">
              <fieldset aria-label="How you would pay">
                <div className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs/5 font-semibold text-white">
                  <label className="group relative cursor-pointer rounded-full px-3 py-1.5 has-[:checked]:bg-solar">
                    <input
                      defaultValue="monthly"
                      defaultChecked
                      name="frequency"
                      type="radio"
                      className="absolute inset-0 appearance-none rounded-full"
                    />
                    <span className="text-white group-has-[:checked]:text-neutral-950">
                      Pay monthly
                    </span>
                  </label>
                  <label className="group relative cursor-pointer rounded-full px-3 py-1.5 has-[:checked]:bg-solar">
                    <input
                      defaultValue="upfront"
                      name="frequency"
                      type="radio"
                      className="absolute inset-0 appearance-none rounded-full"
                    />
                    <span className="text-white group-has-[:checked]:text-neutral-950">
                      Pay up front
                    </span>
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="relative mx-auto mt-10 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:-mb-14 lg:max-w-none lg:grid-cols-3">
            <div
              aria-hidden="true"
              className="hidden lg:absolute lg:inset-x-px lg:top-4 lg:bottom-0 lg:block lg:rounded-t-2xl lg:bg-neutral-800/80 lg:ring-1 lg:ring-white/10"
            />
            {TIERS.map((tier) => (
              <div
                key={tier.key}
                id={tier.anchorId}
                className={clsx(
                  tier.featured
                    ? 'z-10 bg-white shadow-xl ring-2 ring-solar'
                    : 'bg-neutral-800/80 outline-1 -outline-offset-1 outline-white/10 lg:bg-transparent lg:pb-14 lg:outline-0',
                  'relative scroll-mt-24 rounded-2xl',
                )}
              >
                {tier.legacyAnchorId && (
                  <span
                    id={tier.legacyAnchorId}
                    aria-hidden="true"
                    className="absolute top-0 scroll-mt-24"
                  />
                )}
                <div className="p-8 lg:pt-12 xl:p-10 xl:pt-14">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className={clsx(
                        tier.featured ? 'text-neutral-950' : 'text-white',
                        'text-sm/6 font-semibold',
                      )}
                    >
                      {tier.name}
                    </h3>
                    {tier.saveChip && (
                      <p
                        className={clsx(
                          tier.featured
                            ? 'bg-neutral-950 text-white'
                            : 'bg-solar text-neutral-950',
                          'rounded-full px-2.5 py-1 text-xs font-semibold',
                        )}
                      >
                        {tier.saveChip}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                    <div className="mt-2 flex items-center gap-x-4">
                      <p
                        className={clsx(
                          tier.featured ? 'text-neutral-950' : 'text-white',
                          'font-display text-4xl font-medium tracking-tight group-has-[[name=frequency][value=upfront]:checked]/tiers:hidden',
                        )}
                      >
                        {tier.monthly}
                      </p>
                      <p
                        className={clsx(
                          tier.featured ? 'text-neutral-950' : 'text-white',
                          'font-display text-4xl font-medium tracking-tight group-has-[[name=frequency][value=monthly]:checked]/tiers:hidden',
                        )}
                      >
                        {tier.upfront}
                      </p>
                      <div className="text-sm">
                        <p
                          className={clsx(
                            tier.featured ? 'text-neutral-950' : 'text-white',
                            'group-has-[[name=frequency][value=upfront]:checked]/tiers:hidden',
                          )}
                        >
                          a month
                        </p>
                        <p
                          className={clsx(
                            tier.featured ? 'text-neutral-500' : 'text-neutral-400',
                            'group-has-[[name=frequency][value=upfront]:checked]/tiers:hidden',
                          )}
                        >
                          {tier.monthlyNote}
                        </p>
                        <p
                          className={clsx(
                            tier.featured ? 'text-neutral-950' : 'text-white',
                            'group-has-[[name=frequency][value=monthly]:checked]/tiers:hidden',
                          )}
                        >
                          total
                        </p>
                        <p
                          className={clsx(
                            tier.featured ? 'text-neutral-500' : 'text-neutral-400',
                            'group-has-[[name=frequency][value=monthly]:checked]/tiers:hidden',
                          )}
                        >
                          One payment, same total as monthly
                        </p>
                      </div>
                    </div>
                    {tier.featured ? (
                      <Button href="/apply/" className="w-full">
                        Apply for this build
                      </Button>
                    ) : (
                      <Link
                        href="/apply/"
                        className="w-full rounded-xl bg-white/10 px-3 py-2.5 text-center text-sm/6 font-semibold text-white transition hover:bg-white/20"
                      >
                        Apply for this build
                      </Link>
                    )}
                  </div>
                  <p
                    className={clsx(
                      tier.featured ? 'text-neutral-600' : 'text-neutral-400',
                      'mt-6 text-sm/6',
                    )}
                  >
                    {tier.description}
                  </p>
                  {tier.note && (
                    <p
                      className={clsx(
                        tier.featured ? 'text-neutral-500' : 'text-neutral-400',
                        'mt-2 text-xs/5',
                      )}
                    >
                      {tier.note}
                    </p>
                  )}
                  <div className="mt-6 flow-root">
                    <ul
                      role="list"
                      className={clsx(
                        tier.featured
                          ? 'divide-neutral-950/5 border-neutral-950/5 text-neutral-600'
                          : 'divide-white/5 border-white/5 text-white',
                        '-my-2 divide-y border-t text-sm/6 lg:border-t-0',
                      )}
                    >
                      {tier.highlights.map((mainFeature) => (
                        <li key={mainFeature} className="flex gap-x-3 py-2">
                          <CheckIcon
                            aria-hidden="true"
                            className={clsx(
                              tier.featured ? 'text-neutral-950' : 'text-neutral-500',
                              'h-6 w-5 flex-none',
                            )}
                          />
                          {mainFeature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature comparison zone */}
      <div className="relative bg-neutral-50 lg:pt-14">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
          {/* Feature comparison (up to lg) */}
          <section aria-labelledby="mobile-comparison-heading" className="lg:hidden">
            <h2 id="mobile-comparison-heading" className="sr-only">
              Feature comparison
            </h2>
            <div className="mx-auto max-w-2xl space-y-16">
              {TIERS.map((tier) => (
                <div key={tier.key} className="border-t border-neutral-950/10">
                  <div
                    className={clsx(
                      tier.featured ? 'border-solar' : 'border-transparent',
                      '-mt-px w-72 border-t-2 pt-10 md:w-80',
                    )}
                  >
                    <h3 className="text-sm/6 font-semibold text-neutral-950">
                      {tier.name}
                    </h3>
                    <p className="mt-1 text-sm/6 text-neutral-600">
                      {tier.description}
                    </p>
                  </div>
                  <div className="mt-10 space-y-10">
                    {COMPARISON_SECTIONS.map((section) => (
                      <div key={section.name}>
                        <h4 className="text-sm/6 font-semibold text-neutral-950">
                          {section.name}
                        </h4>
                        <div className="relative mt-6">
                          <div
                            aria-hidden="true"
                            className="absolute inset-y-0 right-0 hidden w-1/2 rounded-lg bg-white shadow-xs sm:block"
                          />
                          <div
                            className={clsx(
                              tier.featured
                                ? 'ring-2 ring-solar'
                                : 'ring-1 ring-neutral-950/10',
                              'relative rounded-lg bg-white shadow-xs sm:rounded-none sm:bg-transparent sm:shadow-none sm:ring-0',
                            )}
                          >
                            <dl className="divide-y divide-neutral-200 text-sm/6">
                              {section.features.map((feature) => (
                                <div
                                  key={feature.name}
                                  className="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
                                >
                                  <dt className="pr-4 text-neutral-600">
                                    {feature.name}
                                  </dt>
                                  <dd className="flex items-center justify-end sm:justify-center sm:px-4">
                                    <Cell
                                      value={feature.tiers[tier.key]}
                                      featured={tier.featured}
                                    />
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                          <div
                            aria-hidden="true"
                            className={clsx(
                              tier.featured
                                ? 'ring-2 ring-solar'
                                : 'ring-1 ring-neutral-950/10',
                              'pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 rounded-lg sm:block',
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Feature comparison (lg+) */}
          <section aria-labelledby="comparison-heading" className="hidden lg:block">
            <h2 id="comparison-heading" className="sr-only">
              Feature comparison
            </h2>
            <div className="grid grid-cols-4 gap-x-8 border-t border-neutral-950/10 before:block">
              {TIERS.map((tier) => (
                <div key={tier.key} aria-hidden="true" className="-mt-px">
                  <div
                    className={clsx(
                      tier.featured ? 'border-solar' : 'border-transparent',
                      'border-t-2 pt-10',
                    )}
                  >
                    <p className="text-sm/6 font-semibold text-neutral-950">
                      {tier.name}
                    </p>
                    <p className="mt-1 text-sm/6 text-neutral-600">
                      {tier.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="-mt-6 space-y-16">
              {COMPARISON_SECTIONS.map((section) => (
                <div key={section.name}>
                  <h3 className="text-sm/6 font-semibold text-neutral-950">
                    {section.name}
                  </h3>
                  <div className="relative -mx-8 mt-10">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
                    >
                      <div className="size-full rounded-lg bg-white shadow-xs" />
                      <div className="size-full rounded-lg bg-white shadow-xs" />
                      <div className="size-full rounded-lg bg-white shadow-xs" />
                    </div>
                    <table className="relative w-full border-separate border-spacing-x-8">
                      <thead>
                        <tr className="text-left">
                          <th scope="col">
                            <span className="sr-only">Feature</span>
                          </th>
                          {TIERS.map((tier) => (
                            <th key={tier.key} scope="col">
                              <span className="sr-only">{tier.name} tier</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.features.map((feature, featureIdx) => (
                          <tr key={feature.name}>
                            <th
                              scope="row"
                              className="w-1/4 py-3 pr-4 text-left text-sm/6 font-normal text-neutral-950"
                            >
                              {feature.name}
                              {featureIdx !== section.features.length - 1 ? (
                                <div className="absolute inset-x-8 mt-3 h-px bg-neutral-200" />
                              ) : null}
                            </th>
                            {TIERS.map((tier) => (
                              <td
                                key={tier.key}
                                className="relative w-1/4 px-4 py-0 text-center"
                              >
                                <span className="relative size-full py-3">
                                  <Cell
                                    value={feature.tiers[tier.key]}
                                    featured={tier.featured}
                                  />
                                </span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
                    >
                      {TIERS.map((tier) => (
                        <div
                          key={tier.key}
                          className={clsx(
                            tier.featured
                              ? 'ring-2 ring-solar'
                              : 'ring-1 ring-neutral-950/10',
                            'rounded-lg',
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </form>
  )
}
