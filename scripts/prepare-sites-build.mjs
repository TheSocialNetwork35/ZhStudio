import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { canonicalUrlFor, routeMetadata } from '../src/seo.js'

const defaultRobots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const distUrl = new URL('../dist/', import.meta.url)
const indexUrl = new URL('index.html', distUrl)

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function replaceMeta(html, attribute, key, content) {
  const pattern = new RegExp(`<meta(?=[^>]*${attribute}=["']${key}["'])(?=[^>]*content=["'])[^>]*>`, 'i')
  return html.replace(pattern, `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`)
}

function renderPageHtml(baseHtml, pathname, metadata) {
  const canonicalUrl = canonicalUrlFor(pathname)
  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`)

  html = replaceMeta(html, 'name', 'description', metadata.description)
  html = replaceMeta(html, 'name', 'robots', metadata.robots || defaultRobots)
  html = replaceMeta(html, 'property', 'og:title', metadata.title)
  html = replaceMeta(html, 'property', 'og:description', metadata.description)
  html = replaceMeta(html, 'property', 'og:url', canonicalUrl)
  html = replaceMeta(html, 'name', 'twitter:title', metadata.title)
  html = replaceMeta(html, 'name', 'twitter:description', metadata.description)
  return html
}

const baseHtml = await readFile(indexUrl, 'utf8')

for (const [pathname, metadata] of Object.entries(routeMetadata)) {
  const pageHtml = renderPageHtml(baseHtml, pathname, metadata)
  if (pathname === '/') {
    await writeFile(indexUrl, pageHtml)
    continue
  }
  await writeFile(new URL(`${pathname.slice(1)}.html`, distUrl), pageHtml)
}

const notFoundHtml = baseHtml
  .replace(/<title>[\s\S]*?<\/title>/i, '<title>Seite nicht gefunden | ZhStudio</title>')
  .replace(/<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/<link\s+rel=["']canonical["'][^>]*>/i, '')

await writeFile(new URL('404.html', distUrl), notFoundHtml)

await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true })
await copyFile(
  new URL('../src/worker.js', import.meta.url),
  new URL('../dist/server/index.js', import.meta.url),
)
await copyFile(
  new URL('../src/seo.js', import.meta.url),
  new URL('../dist/server/seo.js', import.meta.url),
)
