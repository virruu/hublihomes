"use client";

import Script from "next/script";

declare global {
  interface Window {
    netlifyIdentity?: {
      on: (event: string, callback: (user?: unknown) => void) => void;
    };
  }
}

function bindAdminRedirect() {
  const identity = window.netlifyIdentity;
  if (!identity) return;

  identity.on("init", (user) => {
    if (!user) {
      identity.on("login", () => {
        window.location.href = "/admin/index.html";
      });
    }
  });
}

/** Loads Netlify Identity on public pages so invite/recovery links work. */
export function NetlifyIdentityWidget() {
  return (
    <Script
      src="https://identity.netlify.com/v1/netlify-identity-widget.js"
      strategy="afterInteractive"
      onLoad={bindAdminRedirect}
    />
  );
}
