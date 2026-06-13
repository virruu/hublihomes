import { formatPrice } from "./format";
import { site } from "./site";
import type { Property } from "./types";

export function residenceSchema(property: Property) {
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    description: property.description,
    url: `${site.url}/properties/${property.slug}`,
    numberOfRooms: property.bhk ?? undefined,
    numberOfBathroomsTotal: property.bathrooms || undefined,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.area,
      unitText: "SqFt",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.locality,
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      description: `${property.listing} - ${formatPrice(property)}`,
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    areaServed: {
      "@type": "City",
      name: "Hubli",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hubli",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
  };
}
