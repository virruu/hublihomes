import type { MetadataRoute } from "next";

import { getLocationPages } from "@/lib/locations";
import { getAllProperties } from "@/lib/properties";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/properties", "/favorites"].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const propertyRoutes = getAllProperties().map((property) => ({
    url: `${site.url}/properties/${property.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const locationRoutes = getLocationPages().map((page) => ({
    url: `${site.url}/${page.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes, ...locationRoutes];
}
