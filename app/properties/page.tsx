import type { Metadata } from "next";

import { PropertyExplorer, type ExplorerFilters } from "@/components/property-explorer";
import { getAllProperties, getLocalities } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Browse Properties in Hubli",
  description:
    "Search and filter curated houses, flats, villas, plots and PGs for rent and sale across Hubli with rich filters for Vastu, vegetarian, bachelor and family preferences.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
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
    veg: str(searchParams.veg) === "Yes",
    bachelors: str(searchParams.bachelors) === "Allowed",
    family: str(searchParams.family) === "Preferred",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight">Properties in Hubli</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Curated and verified listings — updated by the HubliHomes team.
      </p>
      <div className="mt-8">
        <PropertyExplorer
          properties={properties}
          localities={localities}
          initial={initial}
        />
      </div>
    </div>
  );
}
