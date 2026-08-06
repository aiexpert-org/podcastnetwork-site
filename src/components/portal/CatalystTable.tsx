import clsx from 'clsx'
import React from 'react'

/*
 * Catalyst-shaped Table primitives. Mirrors Catalyst's Table / TableHead /
 * TableBody / TableRow / TableHeader / TableCell API so the audiobook
 * chapter list and the deliverables vault read like Catalyst tables and
 * can be swapped in-place with the licensed Catalyst source.
 */
export function Table({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'overflow-x-auto rounded-2xl border border-portal-line bg-portal-surface shadow-sm',
        className,
      )}
    >
      <table className="min-w-full divide-y divide-portal-line">
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-portal-cream/60">{children}</thead>
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="divide-y divide-portal-line bg-portal-surface">
      {children}
    </tbody>
  )
}

export function TableRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <tr className={className}>{children}</tr>
}

export function TableHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      scope="col"
      className={clsx(
        'px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-portal-muted',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function TableCell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <td className={clsx('px-4 py-3 text-sm text-portal-ink', className)}>
      {children}
    </td>
  )
}
