import { type Metadata } from 'next'
import { Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

import { RootLayout } from '@/components/RootLayout'
import { PostHogInit } from '@/components/analytics/PostHogInit'
import { siteConfig } from '@/lib/site-config'

import '@/styles/tailwind.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
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
      className={`h-full bg-neutral-950 text-base antialiased ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-full flex-col">
        <RootLayout>{children}</RootLayout>
        <Analytics />
        <PostHogInit />
      </body>
    </html>
  )
}
