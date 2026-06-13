import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PropertyBadges } from "@/components/badges";
import { FavoriteButton } from "@/components/favorite-button";
import { Gallery } from "@/components/gallery";
import { AreaIcon, BathIcon, BedIcon, CheckIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/jsonld";
import { PropertyCard } from "@/components/property-card";
import { RecordView } from "@/components/record-view";
import { ShareButton } from "@/components/share-button";
import { bhkLabel, formatPrice } from "@/lib/format";
import { getProperty, getPropertySlugs, getSimilarProperties } from "@/lib/properties";
import { breadcrumbSchema, faqSchema, residenceSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPropertySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const property = getProperty(params.slug);
  if (!property) return {};

  const tags: string[] = [];
  if (property.family === "Preferred") tags.push("Family");
  if (property.vegetarian === "Yes") tags.push("Vegetarian");
  if (property.vastu) tags.push("Vastu");
  const tagLabel = tags.length ? ` | ${tags.join(" & ")}` : "";

  const title = `${property.title}, ${property.locality} Hubli${tagLabel}`;
  const description = `${formatPrice(property)} · ${bhkLabel(property)} · ${property.area} sqft · ${property.facing} facing in ${property.locality}, Hubli. ${property.description}`;

  return {
    title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title,
      description,
      url: `${site.url}/properties/${property.slug}`,
      type: "website",
    },
  };
}

function Highlight({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-600/20">
        {icon}
      </span>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default function PropertyPage({ params }: { params: { slug: string } }) {
  const property = getProperty(params.slug);
  if (!property) notFound();

  const similar = getSimilarProperties(property, 3);
  const waText = encodeURIComponent(
    `Hi, I'm interested in "${property.title}" (${formatPrice(property)}) listed on HubliHomes.`,
  );

  const breadcrumb = [
    { name: "Home", url: site.url },
    { name: "Properties", url: `${site.url}/properties` },
    { name: property.title, url: `${site.url}/properties/${property.slug}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <RecordView slug={property.slug} />
      <JsonLd data={residenceSchema(property)} />
      <JsonLd data={breadcrumbSchema(breadcrumb)} />
      <JsonLd data={faqSchema(property.faq)} />

      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/properties" className="hover:text-brand-600">Properties</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white">{property.locality}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <Gallery property={property} />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <PropertyBadges property={property} />
              <h1 className="mt-2 text-3xl font-black tracking-tight">{property.title}</h1>
              <p className="mt-1 flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <PinIcon className="h-4 w-4" /> {property.locality}, {property.city}, Karnataka
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton slug={property.slug} className="h-11 w-11" />
              <ShareButton title={property.title} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Highlight icon={<BedIcon className="h-5 w-5" />} label="Configuration" value={bhkLabel(property)} />
            <Highlight icon={<BathIcon className="h-5 w-5" />} label="Bathrooms" value={property.bathrooms ? `${property.bathrooms}` : "—"} />
            <Highlight icon={<AreaIcon className="h-5 w-5" />} label="Built-up area" value={`${property.area} sqft`} />
            <Highlight icon={<CheckIcon className="h-5 w-5" />} label="Facing" value={property.facing} />
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Overview</h2>
            <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">{property.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              <KeyValue label="Listing" value={property.listing === "Rent" ? "For Rent" : "For Sale"} />
              <KeyValue label="Furnishing" value={property.furnished} />
              <KeyValue label="Parking" value={property.parking} />
              <KeyValue label="Vastu" value={property.vastu ? "Compliant" : "Not specified"} />
              <KeyValue label="Vegetarian" value={property.vegetarian} />
              <KeyValue label="Bachelors" value={property.bachelors} />
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Amenities</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {property.amenities.map((amenity) => (
                <span key={amenity} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-white/5">
                  <CheckIcon className="h-4 w-4 text-emerald-500" /> {amenity}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Rules &amp; preferences</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {property.rules.map((rule) => (
                <span key={rule} className="chip bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  {rule}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">What&apos;s nearby</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <NearbyCard title="Schools" items={property.nearby.schools} />
              <NearbyCard title="Hospitals" items={property.nearby.hospitals} />
              <NearbyCard title="Bus stop" items={[property.nearby.busStop]} />
              <NearbyCard title="Railway station" items={[property.nearby.railway]} />
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Location</h2>
            <iframe
              title="Map"
              className="mt-3 h-64 w-full rounded-2xl border border-slate-200 dark:border-white/10"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(property.mapQuery)}&output=embed`}
            />
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Frequently asked questions</h2>
            <div className="mt-3 divide-y divide-slate-200 rounded-2xl border border-slate-200 dark:divide-white/10 dark:border-white/10">
              {property.faq.map((entry) => (
                <details key={entry.question} className="group p-4">
                  <summary className="cursor-pointer list-none font-semibold marker:hidden">
                    {entry.question}
                  </summary>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{entry.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="card p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {property.listing === "Rent" ? "Monthly rent" : "Sale price"}
            </p>
            <p className="text-3xl font-black text-brand-600">{formatPrice(property)}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Listed by {property.owner.name}
            </p>

            <a href={`tel:${property.owner.phone}`} className="btn-primary mt-5 w-full justify-center">
              <PhoneIcon className="h-5 w-5" /> Call Owner
            </a>
            <a
              href={`https://wa.me/${property.owner.whatsapp}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:brightness-95"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp Inquiry
            </a>

            <p className="mt-4 text-center text-xs text-slate-400">
              No brokerage. Direct owner contact.
            </p>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold">Similar properties</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <PropertyCard key={item.slug} property={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1.5 dark:border-white/5">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function NearbyCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card p-4">
      <p className="text-sm font-bold">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <PinIcon className="h-4 w-4 text-brand-600" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
