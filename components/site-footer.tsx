import Link from "next/link";

import { getLocationPages } from "@/lib/locations";
import { site } from "@/lib/site";

export function SiteFooter() {
  const locationPages = getLocationPages().slice(0, 8);

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <span className="text-lg font-extrabold tracking-tight">
            Hubli<span className="text-brand-600">Homes</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            {site.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/properties?listing=Rent" className="hover:text-brand-600">Properties for Rent</Link></li>
            <li><Link href="/properties?listing=Sale" className="hover:text-brand-600">Properties for Sale</Link></li>
            <li><Link href="/favorites" className="hover:text-brand-600">Saved Favorites</Link></li>
            <li><a href="/admin/index.html" className="hover:text-brand-600">Admin Dashboard</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Popular Searches
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {locationPages.map((page) => (
              <li key={page.slug}>
                <Link href={`/${page.slug}`} className="hover:text-brand-600">
                  {page.heading}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>{site.phone}</li>
            <li>{site.email}</li>
            <li>Hubli, Karnataka, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 text-center text-sm text-slate-500 dark:border-white/10">
        © {new Date().getFullYear()} {site.name}. Curated real estate for Hubli.
      </div>
    </footer>
  );
}
