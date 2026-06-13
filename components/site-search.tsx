"use client";

import { useEffect, useRef, useState } from "react";

import { CloseIcon, SearchIcon } from "./icons";

type PagefindResult = {
  url: string;
  meta: { title?: string };
  excerpt: string;
};

type PagefindAPI = {
  init: () => Promise<void>;
  search: (q: string) => Promise<{ results: { data: () => Promise<PagefindResult> }[] }>;
};

declare global {
  interface Window {
    pagefind?: PagefindAPI;
  }
}

export function SiteSearch({
  variant = "button",
}: {
  variant?: "button" | "hidden-trigger";
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pagefindRef = useRef<PagefindAPI | null>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    async function loadPagefind() {
      if (pagefindRef.current) return;
      try {
        if (window.pagefind) {
          const existing = window.pagefind as PagefindAPI;
          await existing.init();
          pagefindRef.current = existing;
          return;
        }
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "/pagefind/pagefind.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load pagefind"));
          document.head.appendChild(script);
        });
        const pf = (window as Window).pagefind as PagefindAPI | undefined;
        if (!pf) return;
        await pf.init();
        pagefindRef.current = pf;
      } catch {
        // Pagefind index is generated at build time
      }
    }

    loadPagefind();
  }, [open]);

  useEffect(() => {
    if (!open || !query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (!pagefindRef.current) return;
      setLoading(true);
      try {
        const search = await pagefindRef.current.search(query);
        const data = await Promise.all(search.results.slice(0, 8).map((r) => r.data()));
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (variant === "hidden-trigger") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-ink-muted hover:bg-brand-100 transition-colors"
        aria-label="Search properties"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto mt-16 w-full max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet animate-slide-up overflow-hidden">
              <div className="flex items-center gap-3 border-b border-brand-100 px-4 py-3">
                <SearchIcon className="h-5 w-5 text-brand-600" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search properties, localities…"
                  className="flex-1 bg-transparent py-1 text-base outline-none placeholder:text-ink-faint"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1.5 hover:bg-brand-50"
                  aria-label="Close search"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {loading && (
                  <p className="px-3 py-4 text-sm text-ink-faint">Searching…</p>
                )}
                {!loading && query && results.length === 0 && (
                  <p className="px-3 py-4 text-sm text-ink-faint">No results found.</p>
                )}
                {results.map((result) => (
                  <a
                    key={result.url}
                    href={result.url}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 hover:bg-brand-50 transition-colors"
                  >
                    <p className="font-semibold text-ink">
                      {result.meta.title ?? result.url}
                    </p>
                    <p
                      className="mt-0.5 text-sm text-ink-muted line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </a>
                ))}
                {!query && (
                  <p className="px-3 py-4 text-sm text-ink-faint">
                    Try &ldquo;Vidyanagar&rdquo;, &ldquo;3 BHK&rdquo;, or &ldquo;villa&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
