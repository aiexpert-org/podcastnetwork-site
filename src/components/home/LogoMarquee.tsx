import { type ImageProps } from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { GrayscaleTransitionImage } from '@/components/GrayscaleTransitionImage'

export type MarqueeItem = {
  name: string
  href: string
  /* Optional SVG/PNG wordmark. Until real logo assets land, items render as
   * typographic wordmarks in the display face. */
  logo?: ImageProps['src']
}

function MarqueeRow({
  items,
  reverse = false,
  dark = false,
}: {
  items: MarqueeItem[]
  reverse?: boolean
  dark?: boolean
}) {
  return (
    <div className="pn-marquee">
      <div
        className={clsx(
          'pn-marquee-track items-center',
          reverse && 'pn-marquee-track--reverse',
        )}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? 'true' : undefined}
            className="flex items-center"
          >
            {items.map((item) => (
              <Link
                key={`${copy}-${item.name}`}
                href={item.href}
                tabIndex={copy === 1 ? -1 : undefined}
                className={clsx(
                  'flex items-center px-8 py-4 whitespace-nowrap transition duration-300 sm:px-12',
                  dark
                    ? 'text-neutral-500 hover:text-white'
                    : 'text-neutral-400 hover:text-neutral-950',
                )}
              >
                {item.logo ? (
                  <GrayscaleTransitionImage
                    src={item.logo}
                    alt={item.name}
                    className="h-8 w-auto"
                  />
                ) : (
                  <span className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                    {item.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/*
 * Dual-direction marquee logo cloud, after createchurchmedia.com's parallax
 * pattern: two rows drifting opposite ways at 135s per loop (calm enough to
 * read as editorial, not gimmick). Hover or keyboard focus pauses both rows.
 * The duplicate set is aria-hidden and untabbable.
 */
export function LogoMarquee({
  eyebrow,
  caption,
  topRow,
  bottomRow,
  dark = false,
  className,
}: {
  eyebrow: string
  caption?: string
  topRow: MarqueeItem[]
  bottomRow: MarqueeItem[]
  dark?: boolean
  className?: string
}) {
  return (
    <Container className={className}>
      <FadeIn>
        <section
          aria-label={eyebrow}
          className={clsx(
            dark &&
              '-mx-6 bg-viz-ink py-16 text-papyrus sm:mx-0 sm:rounded-4xl',
          )}
        >
          <div
            className={clsx(
              'flex items-center gap-x-8',
              dark && 'px-6 md:px-12',
            )}
          >
            <h2
              className={clsx(
                'font-display text-sm font-semibold tracking-wider',
                dark ? 'text-white' : 'text-neutral-950',
              )}
            >
              {eyebrow}
            </h2>
            <div
              className={clsx(
                'h-px flex-auto',
                dark ? 'bg-viz-border' : 'bg-neutral-950/10',
              )}
            />
            {caption && (
              <p
                className={clsx(
                  'hidden text-sm sm:block',
                  dark ? 'text-fog' : 'text-neutral-600',
                )}
              >
                {caption}
              </p>
            )}
          </div>
          <div className="mt-8 space-y-2">
            <MarqueeRow items={topRow} dark={dark} />
            <MarqueeRow items={bottomRow} reverse dark={dark} />
          </div>
        </section>
      </FadeIn>
    </Container>
  )
}
