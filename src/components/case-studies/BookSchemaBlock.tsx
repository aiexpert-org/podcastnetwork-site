import bookPayload from '../../../content/schema/06-book.json'

/*
 * Renders the Book entity JSON-LD exactly as it ships in the AI or Die page's
 * structured data. Dark terminal-style block per the palette lock (schema
 * readouts render on Ink ground).
 */
export function BookSchemaBlock() {
  const payload = Object.fromEntries(
    Object.entries(bookPayload).filter(
      ([k, v]) =>
        !k.startsWith('$') && !(typeof v === 'string' && v.includes('{{')),
    ),
  )

  return (
    <pre
      className="text-mono-body my-10 max-h-120 overflow-auto rounded-3xl border border-viz-border bg-viz-ink p-6 text-papyrus/85 max-sm:-mx-6 max-sm:rounded-none"
      data-mono
    >
      {JSON.stringify(payload, null, 2)}
    </pre>
  )
}
