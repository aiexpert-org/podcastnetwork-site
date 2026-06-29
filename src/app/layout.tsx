import { type Metadata } from 'next'

import { RootLayout } from '@/components/RootLayout'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - PodcastNetwork.org',
    default:
      'PodcastNetwork.org - Done-For-You Personal Brand Launch for Authors & Executives',
  },
  description:
    'We build your entire digital presence. Google Knowledge Panel, Wikipedia, press features, podcast bookings, and beyond. All done for you, by our expert team.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-neutral-950 text-base antialiased">
      <body className="flex min-h-full flex-col">
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  )
}
