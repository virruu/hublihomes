import { site } from "@/lib/site";

import { PhoneIcon, WhatsAppIcon } from "./icons";

export function FloatingContact() {
  const waText = encodeURIComponent(
    "Hi HubliHomes, I'm interested in a property listed on your site.",
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${site.whatsapp}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-600/30 transition-transform hover:scale-110"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      <a
        href={`tel:${site.phone}`}
        aria-label="Call HubliHomes"
        className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-110"
      >
        <PhoneIcon className="h-6 w-6" />
      </a>
    </div>
  );
}
