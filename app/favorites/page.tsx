import type { Metadata } from "next";

import { FavoritesList } from "@/components/favorites-list";
import { getAllProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Your Saved Favorites",
  description: "Your shortlisted HubliHomes properties, saved on this device.",
  robots: { index: false, follow: false },
};

export default function FavoritesPage() {
  const properties = getAllProperties();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight">Saved favorites</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Your shortlist is stored on this device — no login required.
      </p>
      <div className="mt-8">
        <FavoritesList properties={properties} />
      </div>
    </div>
  );
}
