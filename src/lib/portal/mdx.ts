import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

/*
 * Portal content loader. Reads content/portal/{authorSlug}/{section}.mdx,
 * parses frontmatter with gray-matter, and renders the body to HTML using
 * remark + remark-html. Both libs are already in the tree — the portal
 * ships with zero new dependencies.
 *
 * Frontmatter carries the structured data (milestones, phases, chapter
 * status, etc.); the body carries prose (author note, section intro,
 * TODO callouts for v0.2 wire-in).
 */

const PORTAL_ROOT = path.join(process.cwd(), 'content', 'portal')

export type PortalDoc = {
  data: Record<string, unknown>
  html: string
}

export async function loadPortalDoc(
  authorSlug: string,
  section: string,
): Promise<PortalDoc | null> {
  const filePath = path.join(PORTAL_ROOT, authorSlug, `${section}.mdx`)
  let raw: string
  try {
    raw = await fs.readFile(filePath, 'utf8')
  } catch {
    return null
  }
  const parsed = matter(raw)
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(parsed.content)
  return {
    data: parsed.data,
    html: String(processed),
  }
}
