import clsx from 'clsx'

type Phase = 'pending' | 'in-progress' | 'review' | 'complete'

const LABELS: Record<Phase, string> = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'review': 'In Review',
  'complete': 'Complete',
}

const STYLES: Record<Phase, string> = {
  'pending': 'bg-neutral-100 text-neutral-700 border-neutral-200',
  'in-progress': 'bg-solar text-neutral-950 border-yellow-500/40',
  'review': 'bg-blue-50 text-blue-900 border-blue-200',
  'complete': 'bg-emerald-50 text-emerald-900 border-emerald-200',
}

export function PhaseBadge({ phase }: { phase: Phase }) {
  return (
    <span className={clsx(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
      STYLES[phase],
    )}>
      {LABELS[phase]}
    </span>
  )
}
