import Link from "next/link";

const NAV = [
  { href: "/the-method/", label: "Method" },
  { href: "/the-package/", label: "Package" },
  { href: "/case-studies/", label: "Case Studies" },
  { href: "/founders/", label: "Founders" },
  { href: "/apply/", label: "Apply" },
];

const PARTNERS = [
  {
    name: "AI Expert",
    href: "https://aiexpert.org",
    line: "Sister firm. Builds the AI-native architecture underneath the sequence. Same co-founders.",
  },
  {
    name: "Legacy Publishing",
    href: "https://legacypublishing.press",
    line: "Application-only elite publisher. 10 percent of net book sales, no upfront fee. Publishing partner on every book in the package.",
  },
  {
    name: "Apex Podcast Co",
    href: "https://apexpodcast.co",
    line: "Ongoing white-glove podcast production. Optional retainer for authors after Day 180.",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-papyrus">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-(family-name:--font-display) text-xl font-bold text-ink">
              PodcastNetwork<span className="text-foil-dark">.org</span>
            </p>
            <p className="text-body-sm mt-3 max-w-xs text-slate">
              The coordinating operator for a productized 6-month author
              launch. One offer, one sequence, four pillars in parallel.
            </p>
            <p className="text-body-sm mt-4">
              <a
                href="mailto:hello@podcastnetwork.org"
                className="text-signal underline underline-offset-2 hover:decoration-foil"
              >
                hello@podcastnetwork.org
              </a>
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-eyebrow text-slate">Site</p>
            <ul className="mt-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm inline-flex items-center py-1.5 text-ink hover:text-signal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-eyebrow text-slate">Partners</p>
            <ul className="mt-3 space-y-4">
              {PARTNERS.map((p) => (
                <li key={p.name}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm font-semibold text-ink hover:text-signal"
                  >
                    {p.name}
                  </a>
                  <p className="text-caption mt-0.5 text-slate">{p.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/8 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-caption text-slate">
            © 2026 PodcastNetwork.org. Co-founded by Brett K Moore and Mike
            Partners.
          </p>
          <p className="text-caption text-slate">
            Application-only intake. Serious authors only.
          </p>
          <p className="text-caption space-x-3 text-slate">
            <Link
              href="/legal/privacy/"
              className="inline-flex items-center py-2 hover:text-signal"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms/"
              className="inline-flex items-center py-2 hover:text-signal"
            >
              Terms
            </Link>
            <Link
              href="/legal/legacy-jv/"
              className="inline-flex items-center py-2 hover:text-signal"
            >
              Legacy JV Disclosure
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
