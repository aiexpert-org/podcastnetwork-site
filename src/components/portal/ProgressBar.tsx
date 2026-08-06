import clsx from 'clsx'

export function ProgressBar({ value, max = 100, label }: {
  value: number
  max?: number
  label?: string
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div>
      {label && (
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm text-neutral-700">{label}</span>
          <span className="text-xs text-neutral-500 tabular-nums">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className={clsx('h-full rounded-full bg-neutral-950 transition-all')}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
