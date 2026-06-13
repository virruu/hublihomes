"use client";

import { useState } from "react";

import type { Property } from "@/lib/types";

import { PropertyImage } from "./property-image";

export function Gallery({ property }: { property: Property }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const gallery = property.gallery.length ? property.gallery : [property.gradient];

  return (
    <div>
      <button
        type="button"
        onClick={() => setFullscreen(true)}
        className="block w-full"
        aria-label="Open fullscreen gallery"
      >
        <PropertyImage
          property={property}
          gradient={gallery[active]}
          label={false}
          className="h-72 w-full rounded-3xl sm:h-[420px]"
        />
      </button>

      <div className="mt-3 flex gap-3">
        {gallery.map((gradient, index) => (
          <button
            key={gradient + index}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`View photo ${index + 1}`}
            className={`h-16 w-24 overflow-hidden rounded-xl ring-2 transition ${
              active === index ? "ring-brand-600" : "ring-transparent opacity-70"
            }`}
          >
            <PropertyImage
              property={property}
              gradient={gradient}
              label={false}
              className="h-full w-full"
            />
          </button>
        ))}
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4"
          onClick={() => setFullscreen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <PropertyImage
              property={property}
              gradient={gallery[active]}
              label={false}
              className="h-[60vh] w-full rounded-2xl"
            />
            <div className="mt-4 flex justify-center gap-3">
              {gallery.map((gradient, index) => (
                <button
                  key={gradient + index}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`h-3 w-3 rounded-full ${
                    active === index ? "bg-white" : "bg-white/40"
                  }`}
                  aria-label={`Go to photo ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute right-5 top-5 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
