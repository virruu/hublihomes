"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { site } from "@/lib/site";

import { PinIcon, SearchIcon } from "./icons";

const types = ["Any", "House", "Flat", "Villa", "Plot", "PG"];

export function SearchBar() {
  const router = useRouter();
  const [listing, setListing] = useState("Rent");
  const [locality, setLocality] = useState("");
  const [type, setType] = useState("Any");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set("listing", listing);
    if (type !== "Any") params.set("type", type);
    if (locality) params.set("locality", locality);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-4xl rounded-3xl border border-white/40 bg-white/90 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80"
    >
      <div className="mb-3 flex gap-2">
        {["Rent", "Sale"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setListing(option)}
            className={`chip ${
              listing === option
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"
            }`}
          >
            {option === "Rent" ? "Rent" : "Buy"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-3 dark:border-white/10">
          <PinIcon className="h-5 w-5 text-slate-400" />
          <select
            value={locality}
            onChange={(event) => setLocality(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Locality"
          >
            <option value="">Any locality</option>
            {site.localities.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-3 dark:border-white/10">
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            aria-label="Property type"
          >
            {types.map((option) => (
              <option key={option} value={option}>
                {option === "Any" ? "Any type" : option}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary justify-center px-8">
          <SearchIcon className="h-5 w-5" />
          Search
        </button>
      </div>
    </form>
  );
}
