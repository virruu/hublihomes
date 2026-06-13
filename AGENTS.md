# AGENTS.md

HubliHomes is a Next.js 14 (App Router, TypeScript) + Tailwind CSS real estate site for Hubli. Listings are file-based (one MDX file per property in `content/properties/`) — there is **no database**. The admin dashboard is Decap CMS (git-based) at `/admin/`.

See `README.md` for the full project structure, scripts, and deployment details.

## Cursor Cloud specific instructions

### Services

There is a single service: the Next.js app.

- Dev server: `npm run dev` → http://localhost:3000 (standard scripts are in `package.json`).
- Lint / build: `npm run lint`, `npm run build`.
- Property images: `npm run images` regenerates WebP placeholders in `public/images/properties/`.
- Optional second service: `npx decap-server` (Decap CMS local backend on port `8081`). Only needed to actually log in and edit content through `/admin/` locally; the public site runs fine without it.

### Non-obvious gotchas

- **Property images** are WebP files under `public/images/properties/{slug}/`, referenced in MDX frontmatter as `coverImage` and `gallery`. Run `npm run images` after adding a new listing slug. `next/image` uses blur placeholders from `lib/image-blur.json`.
- **The admin dashboard is served at `/admin/index.html`, not `/admin/`.** Next.js does not serve a directory index for files in `public/`, so `/admin/` 308-redirects to `/admin` which 404s. Always link to `/admin/index.html`.
- The Decap local backend (`npx decap-server`) writes edits **directly to the working tree** in `content/properties/`. Revert any throwaway test listings before committing.
- Property pages and SEO location pages use `dynamicParams = false`, so they are fully prerendered; a slug that has no matching MDX file 404s by design.
- **Pagefind** search index is built in `postbuild` → `public/pagefind/`. Search only works after `npm run build` (not in dev).
- **On-demand revalidation**: `POST /api/revalidate` with header `x-revalidate-secret` matching `REVALIDATE_SECRET`. Optionally set `NETLIFY_BUILD_HOOK_URL` to trigger a Netlify rebuild.
