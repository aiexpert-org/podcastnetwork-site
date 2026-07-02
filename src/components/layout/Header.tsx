"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";

const NAV = [
  { href: "/the-method/", label: "Method" },
  { href: "/the-package/", label: "Package" },
  { href: "/case-studies/", label: "Case Studies" },
  { href: "/founders/", label: "Founders" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-vellum/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="font-(family-name:--font-display) text-xl font-bold tracking-tight text-ink"
        >
          PodcastNetwork<span className="text-foil-dark">.org</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-body-sm font-medium transition-colors hover:text-ink",
                pathname?.startsWith(item.href)
                  ? "text-ink underline decoration-foil decoration-2 underline-offset-8"
                  : "text-slate",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button href="/apply/" variant="primary" className="!py-2 !px-4">
            Apply
          </Button>
        </nav>

        <button
          className="rounded p-2 text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-ink/8 bg-vellum px-5 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 text-lg font-medium text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Button href="/apply/" variant="primary" className="w-full">
                Apply
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
