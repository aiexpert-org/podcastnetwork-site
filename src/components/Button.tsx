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
    // Squared-off corners share the report input's radius (Brett,
    // 2026-07-05: no more pills). Content centers on both axes so
    // stretched buttons, like the report form's, hold their label in the
    // middle. Soft shadow, hover lift, press-down for tactility.
    'inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2',
    // Solar Yellow is the CTA color (Brett, 2026-07-04). Ink text on Solar
    // is 13.7:1; hover flips to ink so the press state stays decisive on
    // both white and dark surfaces.
    invert
      ? 'bg-solar text-neutral-950 hover:bg-white focus-visible:outline-white'
      : 'bg-solar text-neutral-950 hover:bg-neutral-950 hover:text-white focus-visible:outline-neutral-950',
  )

  if (typeof props.href === 'undefined') {
    return (
      <button className={className} {...props}>
        {children}
      </button>
    )
  }

  return (
    <Link className={className} {...props}>
      {children}
    </Link>
  )
}
