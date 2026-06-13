import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PropertyCard } from "@/components/property-card";
import { JsonLd } from "@/components/jsonld";
import {
  getLocationPage,
  getLocationPageProperties,
  getLocationPages,
} from "@/lib/locations";
import { breadcrumbSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocationPages().map((page) => ({ location: page.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { location: string };
}): Metadata {
  const page = getLocationPage(params.location);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.title, description: page.description },
  };
}

export default function LocationPage({
  params,
}: {
  params: { location: string };
}) {
  const page = getLocationPage(params.location);
  if (!page) notFound();

  const properties = getLocationPageProperties(page);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: page.heading, url: `${site.url}/${page.slug}` },
        ])}
      />
      <nav className="mb-3 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span className="px-1.5">/</span>
        <span className="text-slate-900 dark:text-white">{page.heading}</span>
      </nav>
      <h1 className="text-3xl font-black tracking-tight">{page.heading}</h1>
      <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
        {page.description}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.slug} property={property} />
        ))}
      </div>

      <div className="mt-10">
        <Link href="/properties" className="btn-ghost">
          Browse all properties
        </Link>
      </div>
    </div>
  );
}
