import clsx from 'clsx'

export function Logomark({
  invert = false,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  invert?: boolean
  filled?: boolean
}) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle
        cx="16"
        cy="16"
        r="14"
        className={invert ? 'fill-white' : 'fill-neutral-950'}
      />
      <circle
        cx="16"
        cy="16"
        r="5"
        className={invert ? 'fill-neutral-950' : 'fill-white'}
      />
    </svg>
  )
}

export function Logo({
  className,
  invert = false,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  invert?: boolean
  filled?: boolean
  fillOnHover?: boolean
}) {
  return (
    <svg
      viewBox="0 0 240 32"
      aria-label="PodcastNetwork.org"
      className={clsx(className)}
      {...props}
    >
      <Logomark preserveAspectRatio="xMinYMid meet" invert={invert} />
      <text
        x="40"
        y="22"
        className={clsx(
          'font-display text-[18px] font-semibold',
          invert ? 'fill-white' : 'fill-neutral-950',
        )}
      >
        PodcastNetwork
        <tspan
          className={invert ? 'fill-white/60' : 'fill-neutral-500'}
        >
          .org
        </tspan>
      </text>
    </svg>
  )
}
