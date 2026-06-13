# AGENTS.md

HubliHomes is a Next.js 14 (App Router, TypeScript) + Tailwind CSS real estate site for Hubli. Listings are file-based (one JSON per property in `content/properties/`) — there is **no database**. The admin dashboard is Decap CMS (git-based) at `/admin/`.

See `README.md` for the full project structure, scripts, and deployment details.

## Cursor Cloud specific instructions

### Services

There is a single service: the Next.js app.

- Dev server: `npm run dev` → http://localhost:3000 (standard scripts are in `package.json`).
- Lint / build: `npm run lint`, `npm run build`.
- Optional second service: `npx decap-server` (Decap CMS local backend on port `8081`). Only needed to actually log in and edit content through `/admin/` locally; the public site runs fine without it.

### Non-obvious gotchas

- **Property cover/gallery images are Tailwind gradient classes stored in JSON** (e.g. `from-amber-400 via-orange-500 to-rose-500`). Tailwind only generates these because `tailwind.config.ts` includes `./content/**/*.{json,md}` in `content` **and** has a `safelist` regex for `(from|via|to)-<color>-<shade>`. If gradient images render as gray/blank boxes, a new color/shade was used that isn't covered — extend the safelist regex (and restart `next dev`, since Tailwind config changes are not hot-reloaded).
- **The admin dashboard is served at `/admin/index.html`, not `/admin/`.** Next.js does not serve a directory index for files in `public/`, so `/admin/` 308-redirects to `/admin` which 404s. Always link to `/admin/index.html`.
- The Decap local backend (`npx decap-server`) writes edits **directly to the working tree** in `content/properties/`. Revert any throwaway test listings before committing.
- Property pages and SEO location pages use `dynamicParams = false`, so they are fully prerendered; a slug that has no matching JSON file 404s by design.
