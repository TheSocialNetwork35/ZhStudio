import { readFile, rm, writeFile } from 'node:fs/promises'
import { build } from 'vite'
import { fileURLToPath } from 'node:url'
import { routeMetadata } from '../src/seo.js'

const distUrl = new URL('../dist/', import.meta.url)
const serverUrl = new URL('../.prerender/', import.meta.url)

// Build the real React components for Node. This is build-time rendering only:
// production still serves static files, with no additional runtime or server.
try {
  await build({
    build: {
      ssr: 'src/entry-server.jsx',
      outDir: fileURLToPath(serverUrl),
      emptyOutDir: true,
      copyPublicDir: false,
      sourcemap: false,
    },
  })
  const { render } = await import(new URL('entry-server.js', serverUrl))
  for (const pathname of Object.keys(routeMetadata)) {
    const file = pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`
    const outputUrl = new URL(file, distUrl)
    const template = await readFile(outputUrl, 'utf8')
    if (!/<link\b[^>]*rel="stylesheet"/.test(template)) {
      throw new Error(`Missing render-blocking stylesheet for ${pathname}`)
    }
    const markup = await render(pathname)
    const html = template.replace(
      '<div id="root"></div>',
      () => `<div id="root" data-prerendered="true" data-pathname="${pathname}">${markup}</div>`,
    )
    if (html === template) throw new Error(`Missing app root for ${pathname}`)
    await writeFile(outputUrl, html)
  }
  console.log(`Prerendered ${Object.keys(routeMetadata).length} complete React pages.`)
} finally {
  await rm(serverUrl, { recursive: true, force: true })
}
