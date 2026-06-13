import Link from "next/link";

import { bhkLabel, formatPrice } from "@/lib/format";
import type { Property } from "@/lib/types";

import { PropertyBadges } from "./badges";
import { FavoriteButton } from "./favorite-button";
import { AreaIcon, BathIcon, BedIcon, PinIcon } from "./icons";
import { PropertyImage } from "./property-image";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="card group flex flex-col overflow-hidden fade-up"
    >
      <div className="relative">
        <PropertyImage
          property={property}
          className="h-52 w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <PropertyBadges property={property} />
        </div>
        <div className="absolute right-3 top-3">
          <FavoriteButton slug={property.slug} />
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-slate-900 shadow">
          {formatPrice(property)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {property.listing === "Rent" ? "For Rent" : "For Sale"} ·{" "}
            {property.propertyType}
          </span>
          <h3 className="mt-0.5 line-clamp-1 text-base font-bold">
            {property.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <PinIcon className="h-4 w-4" />
            {property.locality}, {property.city}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
          {property.bhk !== null && (
            <span className="flex items-center gap-1.5">
              <BedIcon className="h-4 w-4" /> {bhkLabel(property)}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BathIcon className="h-4 w-4" /> {property.bathrooms} Bath
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <AreaIcon className="h-4 w-4" /> {property.area} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}
