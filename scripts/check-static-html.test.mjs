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
