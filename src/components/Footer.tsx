import Link from 'next/link'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { Logo } from '@/components/Logo'

const navigation = [
  {
    title: 'Offering',
    links: [
      { title: 'What we do', href: '#services' },
      { title: 'How it works', href: '#how-it-works' },
      { title: 'Investment', href: '#pricing' },
      { title: 'Get started', href: '#apply' },
    ],
  },
  {
    title: 'Partners',
    links: [
      {
        title: 'Apex Podcast Co (production)',
        href: 'https://apexpodcast.co',
      },
      {
        title: 'Legacy Publishing (book deals)',
        href: 'https://legacypublishing.press',
      },
    ],
  },
]

function Navigation() {
  return (
    <nav>
      <ul role="list" className="grid grid-cols-2 gap-8">
        {navigation.map((section, sectionIndex) => (
          <li key={sectionIndex}>
            <div className="font-display text-sm font-semibold tracking-wider text-neutral-950">
              {section.title}
            </div>
            <ul role="list" className="mt-4 text-sm text-neutral-700">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex} className="mt-4">
                  <Link
                    href={link.href}
                    className="transition hover:text-neutral-950"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Footer() {
  return (
    <Container as="footer" className="mt-24 w-full sm:mt-32 lg:mt-40">
      <FadeIn>
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
          <Navigation />
          <div className="flex flex-col gap-4 lg:items-end lg:text-right">
            <p className="font-display text-sm font-semibold tracking-wider text-neutral-950">
              PodcastNetwork.org
            </p>
            <p className="max-w-sm text-sm text-neutral-700">
              The personal-brand infrastructure layer for authors and
              executives. We build the Knowledge Panel, Wikipedia entry, press,
              and podcast presence that make your name searchable, citable, and
              real.
            </p>
          </div>
        </div>
        <div className="mt-24 mb-20 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-neutral-950/10 pt-12">
          <Link href="/" aria-label="Home">
            <Logo className="h-8" />
          </Link>
          <p className="text-sm text-neutral-700">
            © {new Date().getFullYear()} PodcastNetwork.org. Co-founded by
            Brett K. Moore + Mike Partners.
          </p>
        </div>
      </FadeIn>
    </Container>
  )
}
