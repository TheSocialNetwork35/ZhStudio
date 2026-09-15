# ZhStudio

React/Vite website for ZhStudio, focused exclusively on professional websites and webdesign.

## Requirements

- Node.js
- npm

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

The built files are generated in `dist/`.

## Cloudflare

The Git-connected production site deploys to Cloudflare Pages. A small Pages middleware reuses the Worker routing logic for canonical redirects, security headers and real 404 responses. The same app can also be deployed directly as a Cloudflare Worker with static assets.

Cloudflare build settings:

```text
Build command: npm run build
Deploy command: npx wrangler deploy
Root directory: /
Build output directory: dist
```

Useful local commands:

```bash
npm run worker:dev
npm run deploy
```

The Worker serves the built Vite app from `dist/`. The build prerenders every public React route with its complete content and route-specific metadata and returns a real 404 for unknown paths. API routes can be added under `/api/*`; `/api/request-info` already returns basic request and Cloudflare edge metadata.

## Main Files

- `src/App.jsx` - page content, routing, sections, and animations
- `src/styles.css` - complete visual styling and responsive layout
- `src/worker.js` - Cloudflare Worker entry for API routes
- `public/` - public assets and static files
- `index.html` - metadata, fonts, app mount


## Rendering regression checks

Run `npm test` to build and verify the complete static HTML, blocking CSS, metadata, reference links and sitemap rules. The build-time React entry is `src/entry-server.jsx`; the browser hydrates its markup without replacing the page. No server-side runtime is needed in production.

## Languages

German retains the existing URLs. French uses `/fr`, `/fr/prestations`, `/fr/contact`, `/fr/mentions-legales`, `/fr/confidentialite`, `/fr/merci` and `/fr/404`.

- `src/locales/fr.js` contains the French copy; `src/languages.js` maps equivalent routes.
- French is auto-selected from the primary browser language only on first entry to `/` in a tab. A sessionStorage marker prevents further automatic redirects in that tab: manually removing `/fr` opens German. Explicit subpage URLs always win, internal links retain the current language, and a new tab can detect French again. Former localStorage preferences are cleared. `?lang=de|fr` remains an explicit URL override. There is no visible language switch.
- All internal links retain the current locale. Both language versions are directly accessible by URL, including without JavaScript.
- Each indexable page has a self-canonical, reciprocal DE/FR/x-default alternates and a sitemap entry. Thank-you and error pages remain noindex.
- `scripts/sitemap.mjs` generates the production sitemap from route metadata. Keep `public/sitemap.xml` synchronized for development.
- `node scripts/create-og.mjs --fr` regenerates the French social preview image.
