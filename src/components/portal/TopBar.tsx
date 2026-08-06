import { AuthorEntry } from '@/lib/portal/authors'

export function TopBar({ author, currentPhase }: {
  author: AuthorEntry
  currentPhase?: string
}) {
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4 lg:px-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Client Portal
          </p>
          <p className="mt-1 text-sm text-neutral-700">
            {currentPhase ?? author.currentPhase}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-solar px-3 py-1 text-xs font-semibold text-neutral-950">
            {author.cohort ?? 'Author'}
          </span>
        </div>
      </div>
    </div>
  )
}
