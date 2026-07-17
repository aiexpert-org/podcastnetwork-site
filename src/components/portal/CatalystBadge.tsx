import clsx from 'clsx'

/*
 * Catalyst-shaped Badge. The API mirrors Tailwind Plus Catalyst's Badge
 * component (color prop + children) so when Brett drops in the actual
 * Catalyst source, the imports and props do not change. Only 6 colors are
 * implemented for portal-scope work; extend as needed.
 */
export type BadgeColor =
  | 'amber'
  | 'emerald'
  | 'zinc'
  | 'sky'
  | 'rose'
  | 'ink'

const STYLES: Record<BadgeColor, string> = {
  amber: 'bg-portal-amber-tint text-portal-ink ring-portal-amber/30',
  emerald: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
  zinc: 'bg-portal-surface text-portal-muted ring-portal-line',
  sky: 'bg-sky-50 text-sky-900 ring-sky-200',
  rose: 'bg-rose-50 text-rose-900 ring-rose-200',
  ink: 'bg-portal-ink text-portal-cream ring-portal-ink',
}

export function Badge({
  color = 'zinc',
  children,
  className,
}: {
  color?: BadgeColor
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-x-1 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset',
        STYLES[color],
        className,
      )}
    >
      {children}
    </span>
  )
}
