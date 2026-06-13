"use client";

import { useState } from "react";

import { ShareIcon } from "./icons";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" onClick={share} className="btn-ghost">
      <ShareIcon className="h-4 w-4" />
      {copied ? "Link copied!" : "Share"}
    </button>
  );
}
