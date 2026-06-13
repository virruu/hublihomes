import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { FloatingContact } from "@/components/floating-contact";
import { NetlifyIdentityWidget } from "@/components/netlify-identity";
import { JsonLd } from "@/components/jsonld";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { localBusinessSchema } from "@/lib/seo";
import { site } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Hubli real estate",
    "houses for rent Hubli",
    "flats for sale Hubli",
    "villas Hubli",
    "plots Hubli",
    "PG Hubli",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-surface text-ink">
        <JsonLd data={localBusinessSchema()} />
        <SiteHeader />
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <SiteFooter />
        <FloatingContact />
        <MobileBottomNav />
        <NetlifyIdentityWidget />
      </body>
    </html>
  );
}
