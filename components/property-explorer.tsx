"use client";

import { useMemo, useState } from "react";

import type { Property } from "@/lib/types";

import { PropertyCard } from "./property-card";
import { SearchIcon } from "./icons";

export interface ExplorerFilters {
  listing: string;
  type: string;
  locality: string;
  bhk: string;
  budget: number;
  furnished: string;
  facing: string;
  vastu: boolean;
  veg: boolean;
  bachelors: boolean;
  family: boolean;
  parking: boolean;
}

const defaults: ExplorerFilters = {
  listing: "Any",
  type: "Any",
  locality: "Any",
  bhk: "Any",
  budget: 0,
  furnished: "Any",
  facing: "Any",
  vastu: false,
  veg: false,
  bachelors: false,
  family: false,
  parking: false,
};

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 outline-none focus:border-brand-500 dark:border-white/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`chip border ${
        checked
          ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-100"
          : "border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

export function PropertyExplorer({
  properties,
  initial,
  localities,
}: {
  properties: Property[];
  initial: Partial<ExplorerFilters>;
  localities: string[];
}) {
  const [filters, setFilters] = useState<ExplorerFilters>({
    ...defaults,
    ...initial,
  });
  const [sort, setSort] = useState("relevance");

  function update<K extends keyof ExplorerFilters>(
    key: K,
    value: ExplorerFilters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const results = useMemo(() => {
    const filtered = properties.filter((property) => {
      if (filters.listing !== "Any" && property.listing !== filters.listing)
        return false;
      if (filters.type !== "Any" && property.propertyType !== filters.type)
        return false;
      if (filters.locality !== "Any" && property.locality !== filters.locality)
        return false;
      if (filters.bhk !== "Any") {
        if (filters.bhk === "4+") {
          if ((property.bhk ?? 0) < 4) return false;
        } else if (String(property.bhk) !== filters.bhk) {
          return false;
        }
      }
      if (filters.budget > 0 && property.price > filters.budget) return false;
      if (filters.furnished !== "Any" && property.furnished !== filters.furnished)
        return false;
      if (filters.facing !== "Any" && property.facing !== filters.facing)
        return false;
      if (filters.vastu && !property.vastu) return false;
      if (filters.veg && property.vegetarian !== "Yes") return false;
      if (filters.bachelors && property.bachelors !== "Allowed") return false;
      if (filters.family && property.family !== "Preferred") return false;
      if (filters.parking && /^(open|none)$/i.test(property.parking))
        return false;
      return true;
    });

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "area-desc") sorted.sort((a, b) => b.area - a.area);
    return sorted;
  }, [properties, filters, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="card h-fit space-y-4 p-5 lg:sticky lg:top-20">
        <div className="flex items-center gap-2 font-bold">
          <SearchIcon className="h-5 w-5 text-brand-600" /> Filters
        </div>
        <Select label="Listing" value={filters.listing} options={["Any", "Rent", "Sale"]} onChange={(v) => update("listing", v)} />
        <Select label="Property type" value={filters.type} options={["Any", "House", "Flat", "Villa", "Plot", "PG", "Commercial"]} onChange={(v) => update("type", v)} />
        <Select label="Locality" value={filters.locality} options={["Any", ...localities]} onChange={(v) => update("locality", v)} />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">BHK</span>
          <div className="flex flex-wrap gap-2">
            {["Any", "1", "2", "3", "4+"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => update("bhk", option)}
                className={`chip border ${
                  filters.bhk === option
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Max budget: {filters.budget === 0 ? "Any" : `\u20B9${filters.budget.toLocaleString("en-IN")}`}
          </span>
          <input
            type="range"
            min={0}
            max={20000000}
            step={1000}
            value={filters.budget}
            onChange={(event) => update("budget", Number(event.target.value))}
            className="w-full accent-brand-600"
            aria-label="Maximum budget"
          />
        </div>

        <Select label="Furnishing" value={filters.furnished} options={["Any", "Fully Furnished", "Semi Furnished", "Unfurnished"]} onChange={(v) => update("furnished", v)} />
        <Select label="Facing" value={filters.facing} options={["Any", "East", "West", "North", "South"]} onChange={(v) => update("facing", v)} />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Preferences</span>
          <div className="flex flex-wrap gap-2">
            <Toggle label="Vastu" checked={filters.vastu} onChange={(v) => update("vastu", v)} />
            <Toggle label="Vegetarian" checked={filters.veg} onChange={(v) => update("veg", v)} />
            <Toggle label="Bachelor" checked={filters.bachelors} onChange={(v) => update("bachelors", v)} />
            <Toggle label="Family" checked={filters.family} onChange={(v) => update("family", v)} />
            <Toggle label="Parking" checked={filters.parking} onChange={(v) => update("parking", v)} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFilters(defaults)}
          className="btn-ghost w-full justify-center"
        >
          Reset filters
        </button>
      </aside>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-white">{results.length}</span> properties found
          </p>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
            aria-label="Sort"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="area-desc">Largest Area</option>
          </select>
        </div>

        {results.length === 0 ? (
          <div className="card grid place-items-center p-16 text-center">
            <p className="text-lg font-semibold">No matching properties</p>
            <p className="mt-1 text-slate-500">Try adjusting or resetting your filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
