import { localeFor, languageAlternates } from '../src/languages.js'
import { sitemapXml } from './sitemap.mjs'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { canonicalUrlFor, routeMetadata, notFoundMetadataFor } from '../src/seo.js'
import { structuredDataFor } from '../src/structured-data.js'

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
  const locale = localeFor(pathname)
  const canonicalUrl = canonicalUrlFor(pathname)
  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`)

  html = html.replace(/<html lang="[^"]+"/, `<html lang="${locale}-CH"`)
  html = html.replace('</head>', languageAlternates(pathname).map(item => `<link rel="alternate" hreflang="${item.lang}" href="${canonicalUrlFor(item.path)}" />`).join('\n') + '\n</head>')
  html = replaceMeta(html, 'property', 'og:locale', `${locale}_CH`)
  const imageUrl = `https://zhstudio.ch/${locale === 'fr' ? 'og-fr.png' : 'og.png?v=2'}`
  const imageAlt = locale === 'fr' ? 'ZhStudio – Création de sites web à Stäfa' : 'ZhStudio – Webdesign aus Stäfa'
  for (const key of ['og:image', 'og:image:secure_url']) html = replaceMeta(html, 'property', key, imageUrl)
  html = replaceMeta(html, 'property', 'og:image:alt', imageAlt)
  html = replaceMeta(html, 'name', 'twitter:image', imageUrl)
  html = replaceMeta(html, 'name', 'twitter:image:alt', imageAlt)
  if (locale === 'fr') html = html.replace('href="/llms.txt" title="Informationen für KI-Systeme"', 'href="/fr/llms.txt" title="Informations pour les systèmes d’IA"')
  html = replaceMeta(html, 'name', 'description', metadata.description)
  html = replaceMeta(html, 'name', 'robots', metadata.robots || defaultRobots)
  html = replaceMeta(html, 'property', 'og:title', metadata.title)
  html = replaceMeta(html, 'property', 'og:description', metadata.description)
  html = replaceMeta(html, 'property', 'og:url', canonicalUrl)
  html = replaceMeta(html, 'name', 'twitter:title', metadata.title)
  html = replaceMeta(html, 'name', 'twitter:description', metadata.description)
  return html.replace(
    '<script id="structured-data" type="application/ld+json"></script>',
    () => `<script id="structured-data" type="application/ld+json">${JSON.stringify(structuredDataFor(pathname)).replaceAll('<', '\\u003c')}</script>`,
  )
}

const baseHtml = await readFile(indexUrl, 'utf8')

for (const [pathname, metadata] of Object.entries(routeMetadata)) {
  const pageHtml = renderPageHtml(baseHtml, pathname, metadata)
  if (pathname === '/') {
    await writeFile(indexUrl, pageHtml)
    continue
  }
  const output = new URL(`${pathname.slice(1)}.html`, distUrl)
  await mkdir(new URL('.', output), { recursive: true })
  await writeFile(output, pageHtml)
}

for (const pathname of ['/404', '/fr/404']) {
  const notFoundHtml = renderPageHtml(baseHtml, pathname, notFoundMetadataFor(localeFor(pathname)))
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, '')
    .replace(/<meta\s+property=["']og:url["'][^>]*>/i, '')
    .replace(/(<script id="structured-data" type="application\/ld\+json">)[\s\S]*?(<\/script>)/, '$1{}$2')
  await writeFile(new URL(`${pathname.slice(1)}.html`, distUrl), notFoundHtml)
}
await writeFile(new URL('sitemap.xml', distUrl), sitemapXml())

await import('./generate-static-html.mjs')

await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true })
await copyFile(
  new URL('../src/worker.js', import.meta.url),
  new URL('../dist/server/index.js', import.meta.url),
)
await copyFile(
  new URL('../src/seo.js', import.meta.url),
  new URL('../dist/server/seo.js', import.meta.url),
)

await copyFile(new URL('../src/languages.js', import.meta.url), new URL('../dist/server/languages.js', import.meta.url))
