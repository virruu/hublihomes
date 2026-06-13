import Link from "next/link";

import { HomeHero } from "@/components/home-hero";
import { PropertyCard } from "@/components/property-card";
import { RecentlyViewed } from "@/components/recently-viewed";
import { ArrowIcon } from "@/components/icons";
import { getAllProperties, getFeaturedProperties } from "@/lib/properties";

const categories = [
  { label: "Family Homes", href: "/properties?listing=Rent&family=Preferred" },
  { label: "Bachelor Friendly", href: "/properties?listing=Rent&bachelors=Allowed" },
  { label: "Vegetarian Only", href: "/properties?veg=Yes" },
  { label: "Independent Houses", href: "/properties?type=House" },
  { label: "Flats", href: "/properties?type=Flat" },
  { label: "PG / Hostels", href: "/properties?type=PG" },
  { label: "Villas", href: "/properties?type=Villa" },
  { label: "Plots", href: "/properties?type=Plot" },
];

export default function HomePage() {
  const featured = getFeaturedProperties(6);
  const allProperties = getAllProperties();

  return (
    <div>
      <HomeHero />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">Browse by category</h2>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-4 sm:gap-3">
          {categories.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="card flex items-center justify-between p-3.5 text-sm font-semibold text-ink sm:p-4"
            >
              {category.label}
              <ArrowIcon className="h-4 w-4 shrink-0 text-brand-600" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink sm:text-2xl">Featured properties</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Handpicked homes across Hubli&apos;s most-loved localities.
            </p>
          </div>
          <Link
            href="/properties"
            className="hidden items-center gap-1 text-sm font-semibold text-brand-600 sm:inline-flex"
          >
            View all <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      </section>

      <RecentlyViewed properties={allProperties} />
    </div>
  );
}
