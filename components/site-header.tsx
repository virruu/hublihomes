import Link from "next/link";

import { site } from "@/lib/site";

import { ThemeToggle } from "./theme-provider";

const navLinks = [
  { href: "/properties?listing=Rent", label: "Rent" },
  { href: "/properties?listing=Sale", label: "Buy" },
  { href: "/properties?type=Villa", label: "Villas" },
  { href: "/properties?type=Plot", label: "Plots" },
  { href: "/favorites", label: "Favorites" },
];

export function SiteHeader() {
  return (
    <header className="glass sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-lg font-black text-white">
            H
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Hubli<span className="text-brand-600">Homes</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={`tel:${site.phone}`} className="btn-primary hidden sm:inline-flex">
            Call Us
          </a>
          <Link href="/properties" className="btn-primary sm:hidden">
            Browse
          </Link>
        </div>
      </div>
    </header>
  );
}
