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

export const EXPLORER_FILTER_DEFAULTS: ExplorerFilters = {
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

const LISTING_OPTIONS = ["Any", "Rent", "Sale"] as const;
const TYPE_OPTIONS = [
  "Any",
  "House",
  "Flat",
  "Villa",
  "Plot",
  "PG",
  "Commercial",
] as const;
const BHK_OPTIONS = ["Any", "1", "2", "3", "4+"] as const;
const FURNISHED_OPTIONS = [
  "Any",
  "Fully Furnished",
  "Semi Furnished",
  "Unfurnished",
] as const;
const FACING_OPTIONS = ["Any", "East", "West", "North", "South"] as const;

const FILTER_KEYS = [
  "listing",
  "type",
  "locality",
  "bhk",
  "budget",
  "furnished",
  "facing",
  "vastu",
  "veg",
  "bachelors",
  "family",
  "parking",
] as const;

const MAX_BUDGET = 20_000_000;

type ParamSource = {
  get(name: string): string | null;
};

function pickOption(
  value: string | null | undefined,
  allowed: readonly string[],
  fallback: string,
): string {
  if (!value) return fallback;
  return allowed.includes(value) ? value : fallback;
}

function parseBudget(value: string | null | undefined): number {
  if (!value) return 0;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(parsed, MAX_BUDGET);
}

export function parseExplorerFilters(
  params: ParamSource,
  localities: string[],
): ExplorerFilters {
  const localityOptions = ["Any", ...localities];

  return {
    listing: pickOption(params.get("listing"), LISTING_OPTIONS, "Any"),
    type: pickOption(params.get("type"), TYPE_OPTIONS, "Any"),
    locality: pickOption(params.get("locality"), localityOptions, "Any"),
    bhk: pickOption(params.get("bhk"), BHK_OPTIONS, "Any"),
    budget: parseBudget(params.get("budget")),
    furnished: pickOption(params.get("furnished"), FURNISHED_OPTIONS, "Any"),
    facing: pickOption(params.get("facing"), FACING_OPTIONS, "Any"),
    vastu: params.get("vastu") === "true",
    veg: params.get("veg") === "Yes",
    bachelors: params.get("bachelors") === "Allowed",
    family: params.get("family") === "Preferred",
    parking: params.get("parking") === "true",
  };
}

export function explorerFiltersToQuery(filters: ExplorerFilters): string {
  const params = new URLSearchParams();
  if (filters.listing !== "Any") params.set("listing", filters.listing);
  if (filters.type !== "Any") params.set("type", filters.type);
  if (filters.locality !== "Any") params.set("locality", filters.locality);
  if (filters.bhk !== "Any") params.set("bhk", filters.bhk);
  if (filters.budget > 0) params.set("budget", String(filters.budget));
  if (filters.furnished !== "Any") params.set("furnished", filters.furnished);
  if (filters.facing !== "Any") params.set("facing", filters.facing);
  if (filters.vastu) params.set("vastu", "true");
  if (filters.veg) params.set("veg", "Yes");
  if (filters.bachelors) params.set("bachelors", "Allowed");
  if (filters.family) params.set("family", "Preferred");
  if (filters.parking) params.set("parking", "true");
  return params.toString();
}

export function searchParamsRecordToURLSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = searchParams[key];
    const normalized = Array.isArray(value) ? value[0] : value;
    if (normalized) params.set(key, normalized);
  }
  return params;
}

export function countActiveExplorerFilters(filters: ExplorerFilters): number {
  let count = 0;
  if (filters.listing !== "Any") count++;
  if (filters.type !== "Any") count++;
  if (filters.locality !== "Any") count++;
  if (filters.bhk !== "Any") count++;
  if (filters.budget > 0) count++;
  if (filters.furnished !== "Any") count++;
  if (filters.facing !== "Any") count++;
  if (filters.vastu) count++;
  if (filters.veg) count++;
  if (filters.bachelors) count++;
  if (filters.family) count++;
  if (filters.parking) count++;
  return count;
}

export function hasActiveExplorerFilters(filters: ExplorerFilters): boolean {
  return countActiveExplorerFilters(filters) > 0;
}

function normalizedKnownQuery(params: URLSearchParams): string {
  const normalized = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = params.get(key);
    if (value) normalized.set(key, value);
  }
  return normalized.toString();
}

export function shouldNormalizeExplorerQuery(
  params: URLSearchParams,
  localities: string[],
): boolean {
  const sanitized = explorerFiltersToQuery(parseExplorerFilters(params, localities));
  return sanitized !== normalizedKnownQuery(params);
}

export function normalizedExplorerPath(
  params: URLSearchParams,
  localities: string[],
): string {
  const query = explorerFiltersToQuery(parseExplorerFilters(params, localities));
  return query ? `/properties?${query}` : "/properties";
}
