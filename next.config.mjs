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
    // Deferred pages from the old sitemap route to the closest active page,
    // per path-b-v0.5/05-six-page-sitemap-override.md.
    return [
      { source: '/book', destination: '/the-package/', permanent: false },
      { source: '/book/:path*', destination: '/the-package/', permanent: false },
      { source: '/podcast', destination: '/case-studies/', permanent: false },
      { source: '/podcast/:path*', destination: '/case-studies/', permanent: false },
      { source: '/about', destination: '/founders/', permanent: false },
      { source: '/about/:path*', destination: '/founders/', permanent: false },
      { source: '/faq', destination: '/#faq', permanent: false },
      { source: '/journal', destination: '/case-studies/', permanent: false },
      { source: '/journal/:path*', destination: '/case-studies/', permanent: false },
      { source: '/methodology', destination: '/the-method/', permanent: false },
      { source: '/pre-sold-author-package', destination: '/the-package/', permanent: false },
      { source: '/pillars/:path*', destination: '/the-package/', permanent: false },
      { source: '/knowledge-panel', destination: '/', permanent: false },
      { source: '/contact', destination: '/apply/', permanent: false },
      { source: '/work', destination: '/case-studies/', permanent: false },
      { source: '/work/:path*', destination: '/case-studies/:path*', permanent: false },
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
