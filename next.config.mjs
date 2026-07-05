import rehypeShiki from '@leafac/rehype-shiki'
import nextMDX from '@next/mdx'
import { Parser } from 'acorn'
import jsx from 'acorn-jsx'
import escapeStringRegexp from 'escape-string-regexp'
import * as path from 'path'
import { recmaImportImages } from 'recma-import-images'
import remarkGfm from 'remark-gfm'
import { remarkRehypeWrap } from 'remark-rehype-wrap'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import shiki from 'shiki'
import { unifiedConditional } from 'unified-conditional'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // 3-surface architecture (2026-07-04): Home + Apply + Legal. The five
    // marketing routes and every legacy path route to homepage anchors.
    // Route files for the killed pages remain in the tree until the
    // post-pitch cleanup; these redirects fire before the filesystem, so
    // the routes are unreachable.
    return [
      // Killed marketing routes (2026-07-04 collapse).
      { source: '/the-method', destination: '/#packages', permanent: false },
      { source: '/the-method/:path*', destination: '/#packages', permanent: false },
      { source: '/case-studies', destination: '/#packages', permanent: false },
      { source: '/case-studies/:path*', destination: '/#packages', permanent: false },
      { source: '/founders', destination: '/#proof', permanent: false },
      { source: '/founders/:path*', destination: '/#proof', permanent: false },
      { source: '/the-package', destination: '/#pre-sold-author', permanent: false },
      { source: '/the-package/:path*', destination: '/#pre-sold-author', permanent: false },
      { source: '/knowledge-panel-install', destination: '/#knowledge-panel', permanent: false },
      { source: '/knowledge-panel-install/:path*', destination: '/#knowledge-panel', permanent: false },

      // Legacy paths from the pre-rebuild sitemaps.
      { source: '/book', destination: '/#pre-sold-author', permanent: false },
      { source: '/book/:path*', destination: '/#pre-sold-author', permanent: false },
      { source: '/podcast', destination: '/#packages', permanent: false },
      { source: '/podcast/:path*', destination: '/#packages', permanent: false },
      { source: '/about', destination: '/#proof', permanent: false },
      { source: '/about/:path*', destination: '/#proof', permanent: false },
      { source: '/faq', destination: '/#faq', permanent: false },
      { source: '/journal', destination: '/#packages', permanent: false },
      { source: '/journal/:path*', destination: '/#packages', permanent: false },
      { source: '/methodology', destination: '/#packages', permanent: false },
      { source: '/pre-sold-author-package', destination: '/#pre-sold-author', permanent: false },
      { source: '/pillars/:path*', destination: '/#pre-sold-author', permanent: false },
      { source: '/knowledge-panel', destination: '/#knowledge-panel', permanent: false },
      { source: '/contact', destination: '/apply/', permanent: false },
      { source: '/work', destination: '/#packages', permanent: false },
      { source: '/work/:path*', destination: '/#packages', permanent: false },
      { source: '/privacy', destination: '/legal/privacy/', permanent: false },
      { source: '/terms', destination: '/legal/terms/', permanent: false },
      { source: '/cookies', destination: '/legal/privacy/', permanent: false },
    ]
  },
}

function remarkMDXLayout(source, metaName) {
  let parser = Parser.extend(jsx())
  let parseOptions = { ecmaVersion: 'latest', sourceType: 'module' }

  return (tree) => {
    let imp = `import _Layout from '${source}'`
    let exp = `export default function Layout(props) {
      return <_Layout {...props} ${metaName}={${metaName}} />
    }`

    tree.children.push(
      {
        type: 'mdxjsEsm',
        value: imp,
        data: { estree: parser.parse(imp, parseOptions) },
      },
      {
        type: 'mdxjsEsm',
        value: exp,
        data: { estree: parser.parse(exp, parseOptions) },
      },
    )
  }
}

export default async function config() {
  let highlighter = await shiki.getHighlighter({
    theme: 'css-variables',
  })

  let withMDX = nextMDX({
    extension: /\.mdx$/,
    options: {
      recmaPlugins: [recmaImportImages],
      rehypePlugins: [
        [rehypeShiki, { highlighter }],
        rehypeUnwrapImages,
        [
          remarkRehypeWrap,
          {
            node: { type: 'mdxJsxFlowElement', name: 'Typography' },
            start: ':root > :not(mdxJsxFlowElement)',
            end: ':root > mdxJsxFlowElement',
          },
        ],
      ],
      remarkPlugins: [
        remarkGfm,
        [
          unifiedConditional,
          [
            new RegExp(
              `^${escapeStringRegexp(path.resolve('src/app/case-studies'))}`,
            ),
            [[remarkMDXLayout, '@/app/case-studies/wrapper', 'caseStudy']],
          ],
        ],
      ],
    },
  })

  return withMDX(nextConfig)
}
