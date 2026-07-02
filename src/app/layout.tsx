import { type Metadata } from 'next'
import { Playfair_Display, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'

import { RootLayout } from '@/components/RootLayout'
import { PostHogInit } from '@/components/analytics/PostHogInit'
import { siteConfig } from '@/lib/site-config'

import '@/styles/tailwind.css'

/* Mona Sans through next/font so it preloads and swaps: the homepage LCP is
 * hero text, and font-display: block would hold the paint hostage. */
const monaSans = localFont({
  src: '../fonts/Mona-Sans.var.woff2',
  weight: '200 900',
  // `optional` + preload: the font wins on any healthy connection, and a
  // late arrival never re-anchors LCP with a second hero paint.
  display: 'optional',
  variable: '--font-mona-sans',
  declarations: [{ prop: 'font-stretch', value: '75% 125%' }],
})

/* Accent faces render below the fold only, so they skip preload and leave
 * the bandwidth to Mona Sans. */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}. Authority Architecture, Engineered`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`h-full bg-neutral-950 text-base antialiased ${monaSans.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-full flex-col">
        <RootLayout>{children}</RootLayout>
        <Analytics />
        <PostHogInit />
      </body>
    </html>
  )
}
