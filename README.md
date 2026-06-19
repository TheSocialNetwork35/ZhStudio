# ZhStudio

React/Vite website for ZhStudio. The root page lets visitors choose between the website offer at `/website` and the marketing offer at `/marketing`.

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

## Cloudflare Workers

This project deploys as a Cloudflare Worker with static assets.

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

The Worker serves the built Vite app from `dist/` and keeps React routes working with the SPA fallback. API routes can be added under `/api/*`; `/api/request-info` already returns basic request and Cloudflare edge metadata.

## Main Files

- `src/App.jsx` - page content, routing, sections, and animations
- `src/styles.css` - complete visual styling and responsive layout
- `src/worker.js` - Cloudflare Worker entry for API routes
- `public/` - public assets and static files
- `index.html` - metadata, fonts, app mount
