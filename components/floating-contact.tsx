import { site } from "@/lib/site";

import { PhoneIcon, WhatsAppIcon } from "./icons";

export function FloatingContact() {
  const waText = encodeURIComponent(
    "Hi HubliHomes, I'm interested in a property listed on your site.",
  );

  return (
    <div className="fixed bottom-24 right-4 z-30 hidden flex-col gap-3 sm:bottom-5 sm:right-5 sm:flex md:bottom-5">
      <a
        href={`https://wa.me/${site.whatsapp}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      <a
        href={`tel:${site.phone}`}
        aria-label="Call HubliHomes"
        className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white shadow-lift transition-transform hover:scale-105"
      >
        <PhoneIcon className="h-6 w-6" />
      </a>
    </div>
  );
}
