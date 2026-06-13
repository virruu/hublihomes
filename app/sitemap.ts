import type { MetadataRoute } from "next";

import { getLocationPages } from "@/lib/locations";
import { getBrowseSitemapPaths } from "@/lib/property-filters";
import { getAllProperties, getLocalities } from "@/lib/properties";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  const browseRoutes = getBrowseSitemapPaths(getLocalities()).map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/properties" ? 0.8 : 0.75,
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

  return [...staticRoutes, ...browseRoutes, ...propertyRoutes, ...locationRoutes];
}
