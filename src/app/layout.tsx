import { type Metadata } from 'next'
import { Playfair_Display, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'

import { RootLayout } from '@/components/RootLayout'
import { PostHogInit } from '@/components/analytics/PostHogInit'
import { siteConfig } from '@/lib/site-config'

import '@/styles/tailwind.css'

/* Azo Sans (v0.6.11, per Brett): six static weights through next/font so
 * they self-host from public/fonts/azo-sans. display: swap because the
 * files are 18KB each; the brand face should always render and the swap
 * flash is negligible at that size. The CSS variable keeps its historical
 * name so the Tailwind theme is untouched; renaming the token is a
 * post-pitch cleanup item. */
const azoSans = localFont({
  src: [
    {
      path: '../../public/fonts/azo-sans/AzoSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/azo-sans/AzoSans-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/azo-sans/AzoSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/azo-sans/AzoSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/azo-sans/AzoSans-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/azo-sans/AzoSans-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-mona-sans',
})

/* Accent faces render below the fold only, so they skip preload and leave
 * the bandwidth to the primary face. */
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
      className={`h-full bg-white text-base antialiased ${azoSans.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-full flex-col">
        <RootLayout>{children}</RootLayout>
        <Analytics />
        <PostHogInit />
      </body>
    </html>
  )
}
