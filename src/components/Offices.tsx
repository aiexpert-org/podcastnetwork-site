import clsx from 'clsx'

/*
 * Studio's Offices slot, repurposed as the PN contact block. Same API so
 * RootLayout and ContactSection keep their Studio structure. State-only
 * location per Brett 2026-07-07 (based in South Carolina; no city
 * published).
 */
function Office({
  name,
  children,
  invert = false,
}: {
  name: string
  children: React.ReactNode
  invert?: boolean
}) {
  return (
    <address
      className={clsx(
        'text-sm not-italic',
        invert ? 'text-neutral-300' : 'text-neutral-600',
      )}
    >
      <strong className={invert ? 'text-white' : 'text-neutral-950'}>
        {name}
      </strong>
      <br />
      {children}
    </address>
  )
}

export function Offices({
  invert = false,
  ...props
}: React.ComponentPropsWithoutRef<'ul'> & { invert?: boolean }) {
  return (
    <ul role="list" {...props}>
      <li>
        <Office name="South Carolina" invert={invert}>
          Operating base
          <br />
          United States
        </Office>
      </li>
      <li>
        <Office name="Email" invert={invert}>
          <a
            href="mailto:brett@podcastnetwork.org"
            className={clsx(
              'transition',
              invert ? 'hover:text-white' : 'hover:text-neutral-950',
            )}
          >
            brett@podcastnetwork.org
          </a>
        </Office>
      </li>
    </ul>
  )
}
