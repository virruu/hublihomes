import type { Metadata } from "next";
import { Suspense } from "react";

import { PropertyExplorer, type ExplorerFilters } from "@/components/property-explorer";
import { getAllProperties, getLocalities } from "@/lib/properties";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Browse Properties in Hubli",
  description:
    "Search and filter curated houses, flats, villas, plots and PGs for rent and sale across Hubli with rich filters for Vastu, vegetarian, bachelor and family preferences.",
  alternates: { canonical: "/properties" },
  openGraph: {
    title: "Browse Properties in Hubli",
    description:
      "Search and filter curated houses, flats, villas, plots and PGs for rent and sale across Hubli with rich filters for Vastu, vegetarian, bachelor and family preferences.",
    url: `${site.url}/properties`,
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function ExplorerFallback() {
  return <div className="skeleton h-96 rounded-2xl" />;
}

export default function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const properties = getAllProperties();
  const localities = getLocalities();

  const initial: Partial<ExplorerFilters> = {
    listing: str(searchParams.listing) ?? "Any",
    type: str(searchParams.type) ?? "Any",
    locality: str(searchParams.locality) ?? "Any",
    bhk: str(searchParams.bhk) ?? "Any",
    budget: Number(str(searchParams.budget) ?? 0),
    furnished: str(searchParams.furnished) ?? "Any",
    facing: str(searchParams.facing) ?? "Any",
    vastu: str(searchParams.vastu) === "true",
    veg: str(searchParams.veg) === "Yes",
    bachelors: str(searchParams.bachelors) === "Allowed",
    family: str(searchParams.family) === "Preferred",
    parking: str(searchParams.parking) === "true",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10" data-pagefind-body>
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Properties in Hubli
      </h1>
      <p className="mt-1 text-sm text-ink-muted sm:text-base">
        Curated and verified listings — updated by the HubliHomes team.
      </p>
      <div className="mt-6 sm:mt-8">
        <Suspense fallback={<ExplorerFallback />}>
          <PropertyExplorer
            properties={properties}
            localities={localities}
            initial={initial}
          />
        </Suspense>
      </div>
    </div>
  );
}
