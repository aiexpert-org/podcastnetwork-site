import clsx from 'clsx'

/*
 * Brand mark (v0.6.9, per Brett 2026-07-04): wordmark only, no icon.
 * PodcastNetwork in ink, .org muted; inverted on dark panels.
 *
 * The old entity-graph Logomark below is retired from the header and footer
 * but kept exported for possible favicon or asset reuse. Logo still accepts
 * filled/fillOnHover as no-ops so existing call sites compile unchanged.
 */
export function Logomark({
  invert = false,
  filled = false,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  invert?: boolean
  filled?: boolean
}) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g
        className={invert ? 'stroke-white' : 'stroke-neutral-950'}
        strokeWidth="1.5"
      >
        <path d="M16 17 16 6.5" />
        <path d="M16 17 6.5 24.5" />
        <path d="M16 17 25.5 24.5" />
      </g>
      <circle
        cx="16"
        cy="6"
        r="3"
        className={clsx(
          'fill-none stroke-[1.5]',
          invert ? 'stroke-white' : 'stroke-neutral-950',
        )}
      />
      <circle
        cx="6"
        cy="25"
        r="3"
        className={clsx(
          'fill-none stroke-[1.5]',
          invert ? 'stroke-white' : 'stroke-neutral-950',
        )}
      />
      <circle
        cx="26"
        cy="25"
        r="3"
        className={clsx(
          'fill-none stroke-[1.5]',
          invert ? 'stroke-white' : 'stroke-neutral-950',
        )}
      />
      <circle
        cx="16"
        cy="17"
        r="4.75"
        className={clsx(
          'stroke-[1.5] transition-all duration-300',
          invert ? 'stroke-white' : 'stroke-neutral-950',
          filled
            ? 'fill-solar'
            : 'fill-transparent group-hover/logo:fill-solar',
        )}
      />
    </svg>
  )
}

export function Logo({
  className,
  invert = false,
  filled: _filled = false,
  fillOnHover: _fillOnHover = false,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  invert?: boolean
  filled?: boolean
  fillOnHover?: boolean
}) {
  return (
    <div className={clsx('flex items-center', className)} {...props}>
      <span
        className={clsx(
          'font-display text-xl font-semibold tracking-tight whitespace-nowrap',
          invert ? 'text-white' : 'text-neutral-950',
        )}
      >
        PodcastNetwork
        <span className={invert ? 'text-neutral-400' : 'text-neutral-500'}>
          .org
        </span>
      </span>
    </div>
  )
}
