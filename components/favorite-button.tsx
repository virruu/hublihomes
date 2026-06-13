"use client";

import { useEffect, useState } from "react";

import { HeartIcon } from "./icons";

const KEY = "hh-favorites";

function readFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function FavoriteButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(readFavorites().includes(slug));
  }, [slug]);

  function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const current = readFavorites();
    const next = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("hh-favorites-changed"));
    setFavorite(next.includes(slug));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorite}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/85 text-rose-500 shadow-md backdrop-blur transition-transform hover:scale-110 ${className}`}
    >
      <HeartIcon className="h-5 w-5" filled={favorite} />
    </button>
  );
}
