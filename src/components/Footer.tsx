import Link from 'next/link'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { Logo } from '@/components/Logo'
import { socialMediaProfiles } from '@/components/SocialMedia'

const navigation = [
  {
    title: 'Case studies',
    links: [
      { title: 'AI or Die', href: '/case-studies/ai-or-die' },
      { title: 'Michele Okimura', href: '/case-studies/michele-okimura' },
      { title: 'Dominic Jones', href: '/case-studies/dominic-jones' },
      {
        title: (
          <>
            See all <span aria-hidden="true">&rarr;</span>
          </>
        ),
        href: '/case-studies',
      },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'The Method', href: '/the-method' },
      { title: 'The Package', href: '/the-package' },
      { title: 'Founders', href: '/founders' },
      { title: 'Apply', href: '/apply' },
      { title: 'Privacy', href: '/legal/privacy' },
      { title: 'Terms', href: '/legal/terms' },
    ],
  },
  {
    title: 'Connect',
    links: socialMediaProfiles,
  },
]

function Navigation() {
  return (
    <nav>
      <ul role="list" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
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

function ArrowIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 6" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 3 10 .5v2H0v1h10v2L16 3Z"
      />
    </svg>
  )
}

function DiagnosticCallout() {
  return (
    <div className="max-w-sm">
      <h2 className="font-display text-sm font-semibold tracking-wider text-neutral-950">
        Start with your URL
      </h2>
      <p className="mt-4 text-sm text-neutral-700">
        The application opens with a schema scan of your public presence.
        See what the engines read before you fill in a single form field.
      </p>
      <Link
        href="/apply"
        className="mt-6 inline-flex items-center gap-x-3 rounded-2xl bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        Run the diagnostic
        <ArrowIcon className="w-4" />
      </Link>
    </div>
  )
}

export function Footer() {
  return (
    <Container as="footer" className="mt-24 w-full sm:mt-32 lg:mt-40">
      <FadeIn>
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
          <Navigation />
          <div className="flex lg:justify-end">
            <DiagnosticCallout />
          </div>
        </div>
        <div className="mt-24 mb-20 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-neutral-950/10 pt-12">
          <Link href="/" aria-label="Home">
            <Logo className="h-8" fillOnHover />
          </Link>
          <p className="text-sm text-neutral-700">
            © PodcastNetwork.org {new Date().getFullYear()}
          </p>
        </div>
      </FadeIn>
    </Container>
  )
}
