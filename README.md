# HubliHomes

Premium real estate platform for Hubli featuring rental houses, flats, villas, plots and properties for sale. Built with **Next.js**, **Tailwind CSS** and deployed on **Netlify**.

HubliHomes is a city-focused, manually curated real estate portal. Listings are stored as MDX files with YAML frontmatter (no database) and managed through a Git-based admin dashboard (Decap CMS), so the whole site is fast, free to host on Netlify's CDN, and fully version controlled.

## Tech stack

- **Next.js 14** (App Router, TypeScript) — static generation for blazing speed
- **Tailwind CSS** — premium, responsive UI with a soft sage/stone palette
- **MDX content** — each property is an MDX file in `content/properties/` with frontmatter + markdown body
- **next/image** — WebP property photos with blur placeholders
- **Pagefind** — instant full-text search (built in `postbuild`)
- **Decap CMS** — git-based admin dashboard at `/admin/index.html` (no server, no database)
- **SEO** — JSON-LD structured data (`Residence`, `BreadcrumbList`, `FAQPage`, `RealEstateAgent`), dynamic metadata, `sitemap.xml`, `robots.txt`, dynamic Open Graph image
- **On-demand revalidation** — `POST /api/revalidate` with optional Netlify build hook
- **Netlify** — free static hosting on the edge CDN

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (http://localhost:3000) |
| `npm run build` | Production build + Pagefind search index |
| `npm run images` | Regenerate WebP placeholder images for listings |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
app/                     Next.js App Router pages
  page.tsx               Home (hero, search, featured)
  properties/            Listings + rich filters
  properties/[slug]/     Property detail page
  [location]/            SEO landing pages (/rent-house-vidyanagar, ...)
  favorites/             Saved favorites (localStorage)
  sitemap.ts, robots.ts  SEO infra
components/              UI components
content/properties/      Property listings (one MDX file each — the "database")
public/images/properties/ WebP photos per listing
lib/                     Content loader, formatting, SEO schema helpers
public/admin/            Decap CMS admin dashboard
```

## Managing listings (no database)

Each property is an MDX file in `content/properties/`. Add, edit or delete a file and the site regenerates.

### Admin dashboard

The Decap CMS dashboard lives at `/admin/index.html`.

- **Production:** uses Netlify Identity + Git Gateway. Editors log in via Netlify (no credentials stored in the repo). Changes commit MDX files to GitHub → Netlify rebuilds the site.
- **Local development:** run the Decap local backend in a second terminal:

  ```bash
  npx decap-server
  ```

  Then open http://localhost:3000/admin/index.html and click **Login** (the local backend needs no credentials and writes changes directly to your working copy).

## Deployment (Netlify)

`netlify.toml` is preconfigured. Connect the repo to Netlify; the build command is `npm run build` with the official `@netlify/plugin-nextjs`. Enable Netlify Identity + Git Gateway to use the admin dashboard in production.
