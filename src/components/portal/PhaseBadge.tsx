import clsx from 'clsx'

export type Phase = 'pending' | 'in-progress' | 'review' | 'complete'

const LABELS: Record<Phase, string> = {
  pending: 'Pending',
  'in-progress': 'In progress',
  review: 'In review',
  complete: 'Complete',
}

const STYLES: Record<Phase, string> = {
  pending: 'bg-portal-surface text-portal-muted border-portal-line',
  'in-progress': 'bg-portal-amber-tint text-portal-ink border-portal-amber/40',
  review: 'bg-portal-surface text-portal-amber border-portal-amber/40',
  complete: 'bg-emerald-50 text-emerald-900 border-emerald-200',
}

/*
 * Phase badge for the milestones list and section cards. Refactored under
 * v0.2 to draw from the portal token set. Interface unchanged from v0.1
 * so consuming pages (dashboard, audiobook, manuscript) do not need edits.
 */
export function PhaseBadge({ phase }: { phase: Phase }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        STYLES[phase],
      )}
    >
      {LABELS[phase]}
    </span>
  )
}
