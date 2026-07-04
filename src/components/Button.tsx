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
    // Solar Yellow is the CTA color (Brett, 2026-07-04). Ink text on Solar
    // is 13.7:1; hover flips to ink so the press state stays decisive on
    // both white and dark surfaces.
    invert
      ? 'bg-solar text-neutral-950 hover:bg-white'
      : 'bg-solar text-neutral-950 hover:bg-neutral-950 hover:text-white',
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
