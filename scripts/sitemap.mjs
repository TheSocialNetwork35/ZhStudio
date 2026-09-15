import { routeMetadata, canonicalUrlFor } from '../src/seo.js'
import { languageAlternates } from '../src/languages.js'
export function sitemapXml() {
  const urls = Object.entries(routeMetadata).filter(([, meta]) => !meta.robots?.includes('noindex')).map(([path]) => {
    const alternates = languageAlternates(path).map(item => `    <xhtml:link rel="alternate" hreflang="${item.lang}" href="${canonicalUrlFor(item.path)}" />`).join('\n')
    return `  <url>\n    <loc>${canonicalUrlFor(path)}</loc>\n${alternates}\n  </url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/css" href="/sitemap.css"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
}
