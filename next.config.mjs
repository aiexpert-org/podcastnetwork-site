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
    // 2026-08-02: Home + Founders + Legal are the only surfaces left.
    // Every retired route and legacy path lands on the homepage.
    return [
      // Retired offer ladder (2026-08-02). The package, method, and
      // knowledge-panel routes are gone, along with the application and
      // assessment funnels and the case-study hub. Everything lands on
      // the homepage, which no longer carries offer anchors.
      { source: '/the-method', destination: '/', permanent: false },
      { source: '/the-method/:path*', destination: '/', permanent: false },
      { source: '/the-package', destination: '/', permanent: false },
      { source: '/the-package/:path*', destination: '/', permanent: false },
      { source: '/knowledge-panel-install', destination: '/', permanent: false },
      { source: '/knowledge-panel-install/:path*', destination: '/', permanent: false },
      { source: '/apply', destination: '/', permanent: false },
      { source: '/apply/:path*', destination: '/', permanent: false },
      { source: '/assessment', destination: '/', permanent: false },
      { source: '/assessment/:path*', destination: '/', permanent: false },
      { source: '/case-studies', destination: '/', permanent: false },
      { source: '/case-studies/:path*', destination: '/', permanent: false },

      // Legacy paths from the pre-rebuild sitemaps. Every one of these
      // used to target a homepage offer anchor that no longer exists.
      { source: '/book', destination: '/', permanent: false },
      { source: '/book/:path*', destination: '/', permanent: false },
      { source: '/podcast', destination: '/', permanent: false },
      { source: '/podcast/:path*', destination: '/', permanent: false },
      { source: '/about', destination: '/', permanent: false },
      { source: '/about/:path*', destination: '/', permanent: false },
      { source: '/faq', destination: '/', permanent: false },
      { source: '/journal', destination: '/', permanent: false },
      { source: '/journal/:path*', destination: '/', permanent: false },
      { source: '/methodology', destination: '/', permanent: false },
      { source: '/pre-sold-author-package', destination: '/', permanent: false },
      { source: '/pillars/:path*', destination: '/', permanent: false },
      { source: '/knowledge-panel', destination: '/', permanent: false },
      { source: '/contact', destination: '/', permanent: false },
      { source: '/work', destination: '/', permanent: false },
      { source: '/work/:path*', destination: '/', permanent: false },
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
