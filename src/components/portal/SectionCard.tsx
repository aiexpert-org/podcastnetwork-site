import Link from 'next/link'
import clsx from 'clsx'

export function SectionCard({
  href,
  eyebrow,
  title,
  description,
  status,
  className,
}: {
  href: string
  eyebrow: string
  title: string
  description: string
  status?: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={clsx(
        'group flex flex-col rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-portal-amber/40 hover:shadow-md',
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-portal-muted">
          {eyebrow}
        </span>
        {status}
      </div>
      <h3 className="mb-2 font-portal-serif text-xl font-semibold text-portal-ink group-hover:text-portal-ink-soft">
        {title}
      </h3>
      <p className="flex-1 text-sm text-portal-muted">{description}</p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-portal-ink group-hover:text-portal-amber">
        Open
        <span className="ml-1" aria-hidden>
          {'→'}
        </span>
      </span>
    </Link>
  )
}
