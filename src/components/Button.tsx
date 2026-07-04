import Link from 'next/link'
import clsx from 'clsx'

type ButtonProps = {
  invert?: boolean
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
)

export function Button({
  invert = false,
  className,
  children,
  ...props
}: ButtonProps) {
  className = clsx(
    className,
    'inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition',
    // Bronze CTA accent. On the Solar ground the light foil disappears
    // (1.8:1 boundary), so the light-surface variant fills with the darker
    // bronze (5.1:1 boundary, 5.3:1 text) and brightens to foil on hover.
    // On dark panels foil-on-ink still reads best.
    invert
      ? 'bg-foil text-neutral-950 hover:bg-foil-bright'
      : 'bg-foil-dark text-white hover:bg-foil hover:text-neutral-950',
  )

  let inner = <span className="relative top-px">{children}</span>

  if (typeof props.href === 'undefined') {
    return (
      <button className={className} {...props}>
        {inner}
      </button>
    )
  }

  return (
    <Link className={className} {...props}>
      {inner}
    </Link>
  )
}
