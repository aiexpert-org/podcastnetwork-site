/**
 * Renders the page's composed JSON-LD @graph as a single script tag.
 * Server component; the JSON is serialized at render time.
 */
export function SchemaGraph({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
