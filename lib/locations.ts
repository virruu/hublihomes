import { getAllProperties } from "./properties";
import {
  canonicalLocalityName,
  localitiesMatch,
  localitySlug,
} from "./locality";
import type { Listing, Property, PropertyType } from "./types";

export interface LocationPage {
  slug: string;
  listing: Listing;
  propertyType: PropertyType;
  locality: string;
  title: string;
  heading: string;
  description: string;
}

const TYPE_SLUGS: Record<PropertyType, string> = {
  House: "house",
  Flat: "flat",
  Villa: "villa",
  Plot: "plot",
  Commercial: "commercial",
  PG: "pg",
};

export { localitySlug };

function buildSlug(
  listing: Listing,
  propertyType: PropertyType,
  locality: string,
): string {
  const type = TYPE_SLUGS[propertyType];
  const loc = localitySlug(locality);
  return listing === "Rent"
    ? `rent-${type}-${loc}`
    : `${type}-for-sale-${loc}`;
}

function pageFor(
  listing: Listing,
  propertyType: PropertyType,
  locality: string,
): LocationPage {
  const canonical = canonicalLocalityName(locality);
  const verb = listing === "Rent" ? "for Rent" : "for Sale";
  const typeLabel = propertyType === "PG" ? "PG" : `${propertyType}s`;
  return {
    slug: buildSlug(listing, propertyType, canonical),
    listing,
    propertyType,
    locality: canonical,
    title: `${propertyType} ${verb} in ${canonical}, Hubli`,
    heading: `${typeLabel} ${verb} in ${canonical}`,
    description: `Browse curated ${propertyType.toLowerCase()} listings ${verb.toLowerCase()} in ${canonical}, Hubli. Verified details on Vastu, parking, water supply, bachelor & family preferences — only on HubliHomes.`,
  };
}

export function getLocationPages(): LocationPage[] {
  const seen = new Map<string, LocationPage>();

  for (const property of getAllProperties()) {
    const page = pageFor(property.listing, property.propertyType, property.locality);
    if (!seen.has(page.slug)) {
      seen.set(page.slug, page);
    }
  }

  return Array.from(seen.values()).sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getLocationPage(slug: string): LocationPage | undefined {
  return getLocationPages().find((page) => page.slug === slug);
}

export function getLocationPageProperties(page: LocationPage): Property[] {
  return getAllProperties().filter(
    (property) =>
      property.listing === page.listing &&
      property.propertyType === page.propertyType &&
      localitiesMatch(property.locality, page.locality),
  );
}

export function propertyMatchesLocationPage(
  property: Property,
  page: LocationPage,
): boolean {
  return (
    property.listing === page.listing &&
    property.propertyType === page.propertyType &&
    localitiesMatch(property.locality, page.locality)
  );
}
