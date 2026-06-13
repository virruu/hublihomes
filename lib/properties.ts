import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { Property } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "properties");

let cache: Property[] | null = null;

function parseProperty(file: string): Property {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const description = content.trim();

  return {
    ...(data as Omit<Property, "description" | "body">),
    description,
    body: description,
  };
}

export function getAllProperties(): Property[] {
  if (cache) return cache;

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"));

  const properties = files.map(parseProperty);

  properties.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.title.localeCompare(b.title);
  });

  cache = properties;
  return properties;
}

export function getPropertySlugs(): string[] {
  return getAllProperties().map((property) => property.slug);
}

export function getProperty(slug: string): Property | undefined {
  return getAllProperties().find((property) => property.slug === slug);
}

export function getFeaturedProperties(limit = 6): Property[] {
  return getAllProperties()
    .filter((property) => property.featured)
    .slice(0, limit);
}

export function getSimilarProperties(property: Property, limit = 3): Property[] {
  return getAllProperties()
    .filter((candidate) => candidate.slug !== property.slug)
    .map((candidate) => {
      let score = 0;
      if (candidate.locality === property.locality) score += 3;
      if (candidate.propertyType === property.propertyType) score += 2;
      if (candidate.listing === property.listing) score += 2;
      if (candidate.bhk === property.bhk) score += 1;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export function getLocalities(): string[] {
  return Array.from(
    new Set(getAllProperties().map((property) => property.locality)),
  ).sort();
}

export function clearPropertyCache() {
  cache = null;
}
