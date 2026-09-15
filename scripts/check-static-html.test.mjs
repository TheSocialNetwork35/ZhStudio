import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { canonicalUrlFor, routeMetadata } from '../src/seo.js'
import { faqs } from '../src/content.js'

const dist = new URL('../dist/', import.meta.url)
for (const [pathname, metadata] of Object.entries(routeMetadata)) {
  test(`${pathname} ships complete, styled, hydratable HTML`, async () => {
    const html = await readFile(new URL(pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`, dist), 'utf8')
    assert.match(html, /data-prerendered="true"/)
    assert.ok(html.includes(`data-pathname="${pathname}"`))
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
    assert.doesNotMatch(html, /seo-fallback|<main[^>]*\bhidden\b/)
    assert.match(html, /<nav\b[^>]*aria-label="Hauptnavigation"/)
    assert.ok(html.includes(`<title>${metadata.title.replaceAll('&', '&amp;')}</title>`))
    assert.ok(html.includes(`href="${canonicalUrlFor(pathname)}"`))
    assert.ok(html.includes(`content="${metadata.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}"`))
    const stylesheet = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/)
    assert.ok(stylesheet, 'CSS must be render-blocking in the head, not JS-injected')
    assert.ok(html.indexOf(stylesheet[0]) < html.indexOf('</head>'))
    const css = await readFile(new URL(stylesheet[1].slice(1), dist), 'utf8')
    assert.match(css, /\.accordion-gallery/)
    assert.match(css, /html:not\(\[data-reveal-ready\]\)/)
    const schema = JSON.parse(html.match(/<script id="structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
    assert.equal(schema['@graph'].at(-1).url, canonicalUrlFor(pathname))
    if (pathname === '/') {
      for (const {question,answer} of faqs) {
        assert.ok(html.includes(question))
        assert.ok(html.includes(answer))
      }
      assert.deepEqual(schema['@graph'].at(-1).mainEntity.map(q => q.acceptedAnswer.text), faqs.map(q => q.answer))
    }
    if (pathname === '/leistungen') {
      assert.match(html, /<h2[^>]*>Inbox<\/h2>/)
      assert.match(html, /href="https:\/\/inbx\.page\/"/)
      assert.equal([...html.matchAll(/src="\/references\/inbox-/g)].length, 3)
    }
    if (pathname === '/kontakt') assert.match(html, /<form[^>]*action="https:\/\/formspree\.io\/f\/xvzdeqvn"[^>]*method="POST"/)
  })
}
test('the sitemap excludes thank-you and legacy URLs', async () => {
  const xml = await readFile(new URL('sitemap.xml',dist),'utf8')
  assert.doesNotMatch(xml, /<loc>[^<]*(?:\/danke|\/website)/)
  for (const [pathname,metadata] of Object.entries(routeMetadata)) {
    if (!metadata.robots?.includes('noindex')) assert.ok(xml.includes(`<loc>${canonicalUrlFor(pathname)}</loc>`))
  }
})

test('404 ships its own complete design without homepage metadata', async () => {
  const html = await readFile(new URL('404.html', dist), 'utf8')
  assert.match(html, /data-prerendered="true" data-pathname="\/404"/)
  assert.match(html, /404 – Seite nicht gefunden/)
  assert.match(html, /Kurz vom Weg abgekommen/)
  assert.match(html, /not-found-number/)
  assert.match(html, /rel="stylesheet"/)
  assert.match(html, /manrope-latin-variable.woff2/)
  assert.match(html, /content="noindex, nofollow"/)
  assert.doesNotMatch(html, /rel="canonical"|property="og:url"/)
  assert.match(html, /href="\/"[^>]*>Zur Startseite/)
  assert.match(html, /href="\/leistungen"/)
  assert.match(html, /href="\/kontakt"/)
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
  const sitemap = await readFile(new URL('sitemap.xml', dist), 'utf8')
  assert.doesNotMatch(sitemap, /\/404/)
})

test('unknown URLs serve the branded 404, with status and headers intact', async () => {
  const { default: worker } = await import('../src/worker.js')
  const html = await readFile(new URL('404.html', dist), 'utf8')
  const env = { ASSETS: { fetch: async request => {
    const path = new URL(request.url).pathname
    if (path === '/404') return new Response(request.method === 'HEAD' ? null : html, {headers: {'content-type':'text/html'}})
    return new Response('missing', {status:404})
  } } }
  for (const path of ['/impressum2', '/nested/missing', '/missing.html', '/assets/missing.js', '/404', '/404.html']) {
    const response = await worker.fetch(new Request(`https://zhstudio.ch${path}`), env)
    assert.equal(response.status, 404, path)
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow')
    assert.equal(response.headers.get('cache-control'), 'no-cache')
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    assert.match(await response.text(), /Kurz vom Weg abgekommen/)
  }
  const head = await worker.fetch(new Request('https://zhstudio.ch/impressum2', {method:'HEAD'}), env)
  assert.equal(head.status, 404)
  assert.equal(await head.text(), '')
  const api = await worker.fetch(new Request('https://zhstudio.ch/api/missing'), env)
  assert.equal(api.status, 404)
  assert.deepEqual(await api.json(), {error:'Not found'})
  const redirect = await worker.fetch(new Request('https://zhstudio.ch/website/kontakt'), env)
  assert.equal(redirect.status, 301)
  assert.equal(redirect.headers.get('location'), 'https://zhstudio.ch/kontakt')
})
