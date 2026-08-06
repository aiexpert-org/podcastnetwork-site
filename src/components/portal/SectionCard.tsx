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
        'group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          {eyebrow}
        </span>
        {status}
      </div>
      <h3 className="text-lg font-semibold text-neutral-950 mb-2 group-hover:text-neutral-800">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 flex-1">{description}</p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-neutral-950 group-hover:underline">
        Open<span className="ml-1" aria-hidden>→</span>
      </span>
    </Link>
  )
}
