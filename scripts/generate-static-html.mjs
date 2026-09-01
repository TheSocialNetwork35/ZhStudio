import { readFile, writeFile } from 'node:fs/promises'
import { canonicalOrigin, routeMetadata } from '../src/seo.js'
const distUrl = new URL('../dist/', import.meta.url)

const pages = {
  '/': {
    title: 'ZhStudio | Webdesign aus Stäfa',
    description: 'ZhStudio gestaltet professionelle, schnelle Websites für lokale Unternehmen in Stäfa, an der Goldküste und im Kanton Zürich.',
    body: `
      <main class="seo-fallback">
        <header><a href="/">ZhStudio – Webdesign aus Stäfa</a><nav aria-label="Hauptnavigation"><a href="/leistungen">Leistungen</a> <a href="/kontakt">Kontakt</a></nav></header>
        <section>
          <p>Webdesign aus Stäfa</p>
          <h1>Websites, die Vertrauen schaffen.</h1>
          <p>ZhStudio konzipiert und gestaltet professionelle, schnelle Websites für lokale Unternehmen in Stäfa, an der Goldküste und im Kanton Zürich.</p>
          <p>Klare Strukturen, sorgfältiges Design und eine responsive technische Umsetzung machen Angebote verständlich und führen Besucher zuverlässig zum nächsten Schritt.</p>
        </section>
        <section>
          <h2>Ein seriöser Webauftritt beginnt mit Klarheit.</h2>
          <p>ZhStudio entwickelt individuelle Websites für lokale KMU, Restaurants, Cafés, Vereine, Praxen, Dienstleistungs- und Handwerksbetriebe. Jede Seite erhält eine nachvollziehbare Hierarchie, klare Kontaktwege und eine glaubwürdige visuelle Sprache.</p>
        </section>
        <section>
          <h2>Konzept, Webdesign und technische Umsetzung</h2>
          <p>Das Angebot umfasst Seitenstruktur und Nutzerführung, individuelles Webdesign, responsive Frontend-Umsetzung, Performance-Grundlagen, technische SEO sowie Veröffentlichung und Übergabe.</p>
        </section>
        <section>
          <h2>Einfache Webauftritte ab CHF 680</h2>
          <p>Nach einem kurzen Kennenlernen folgen eine persönliche Einschätzung und eine klare Offerte. ZhStudio begleitet das Projekt direkt von der ersten Struktur bis zur veröffentlichten Website.</p>
          <p><a href="/kontakt">Website bei ZhStudio anfragen</a></p>
        </section>
      </main>`,
  },
  '/leistungen': {
    title: 'Webdesign-Leistungen in Stäfa & Zürich | ZhStudio',
    description: 'Konzept, Webdesign, responsive Umsetzung und technische SEO-Basis für professionelle Websites aus Stäfa.',
    body: `
      <main class="seo-fallback">
        <header><a href="/">ZhStudio – Webdesign aus Stäfa</a><nav aria-label="Hauptnavigation"><a href="/leistungen">Leistungen</a> <a href="/kontakt">Kontakt</a></nav></header>
        <section><p>Leistungen</p><h1>Websites mit Substanz.</h1><p>ZhStudio verbindet klare Konzeption, individuelles Webdesign und zuverlässige technische Umsetzung für Unternehmen in Stäfa und im Kanton Zürich.</p></section>
        <section><h2>Konzept und Struktur</h2><p>Seitenstruktur, Nutzerführung, inhaltliche Prioritäten und klare Kontaktwege schaffen die Grundlage für einen verständlichen Webauftritt.</p></section>
        <section><h2>Webdesign und responsive Umsetzung</h2><p>Das individuelle Design wird für grosse und kleine Bildschirme umgesetzt. Typografie, Abstände, Kontraste und Interaktionen werden sorgfältig aufeinander abgestimmt.</p></section>
        <section><h2>Technische Basis</h2><p>Performance-Grundlagen, technische SEO, Veröffentlichung und Übergabe sorgen dafür, dass die Website schnell, auffindbar und zuverlässig nutzbar ist.</p></section>
        <section><h2>Projekt und Offerte</h2><p>Einfache Webauftritte starten ab CHF 680. Der konkrete Preis richtet sich nach Umfang, Seitenzahl, Funktionen und vorhandenen Inhalten.</p><p><a href="/kontakt">Persönliche Offerte anfragen</a></p></section>
      </main>`,
  },
  '/kontakt': {
    title: 'Webdesign anfragen | ZhStudio Stäfa',
    description: 'Website oder Redesign bei ZhStudio in Stäfa anfragen und eine persönliche, klare Offerte erhalten.',
    body: `
      <main class="seo-fallback">
        <header><a href="/">ZhStudio – Webdesign aus Stäfa</a><nav aria-label="Hauptnavigation"><a href="/leistungen">Leistungen</a> <a href="/kontakt">Kontakt</a></nav></header>
        <section><p>Kontakt</p><h1>Erzählt kurz, welche Website ihr braucht.</h1><p>ZhStudio beantwortet Anfragen zu neuen Websites und Redesigns persönlich und erstellt nach der ersten Einschätzung eine klare Offerte.</p></section>
        <section><h2>Projektanfrage</h2><p>Hilfreich sind ein kurzer Überblick über das Unternehmen, die gewünschte Website, vorhandene Inhalte, benötigte Funktionen und der geplante Zeitrahmen.</p><p>E-Mail: <a href="mailto:info@zhstudio.ch">info@zhstudio.ch</a><br>Telefon: <a href="tel:+41782512023">+41 78 251 20 23</a><br>Adresse: Weberstrasse 4, 8712 Stäfa, Schweiz</p></section>
      </main>`,
  },
  '/danke': {
    title: 'Danke für eure Anfrage | ZhStudio',
    description: 'Die Anfrage ist bei ZhStudio angekommen. Wir melden uns so bald wie möglich persönlich zurück.',
    robots: 'noindex, nofollow',
    body: `
      <main class="seo-fallback">
        <header><a href="/">ZhStudio – Webdesign aus Stäfa</a></header>
        <section><h1>Danke. Eure Nachricht ist angekommen.</h1><p>Wir prüfen die Angaben und melden uns so bald wie möglich persönlich zurück.</p><p><a href="/">Zur Startseite</a></p></section>
      </main>`,
  },
  '/impressum': {
    title: 'Impressum | ZhStudio Stäfa',
    description: 'Anbieter-, Kontakt- und Verantwortlichkeitsangaben von ZhStudio in Stäfa, Kanton Zürich.',
    body: `
      <main class="seo-fallback"><header><a href="/">ZhStudio – Webdesign aus Stäfa</a></header>
        <section><h1>Impressum für ZhStudio</h1><p>Angaben zum Anbieter und zur verantwortlichen Person dieser Website.</p></section>
        <section><h2>Anbieter</h2><p>ZhStudio<br>Weberstrasse 4<br>8712 Stäfa, Schweiz</p></section>
        <section><h2>Kontakt</h2><p>E-Mail: <a href="mailto:info@zhstudio.ch">info@zhstudio.ch</a><br>Telefon: <a href="tel:+41782512023">+41 78 251 20 23</a></p></section>
        <section><h2>Verantwortlich für den Inhalt</h2><p>Yannis Ress Lasser</p></section>
      </main>`,
  },
  '/datenschutz': {
    title: 'Datenschutzerklärung | ZhStudio',
    description: 'Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten auf zhstudio.ch.',
    body: `
      <main class="seo-fallback"><header><a href="/">ZhStudio – Webdesign aus Stäfa</a></header>
        <section><h1>Datenschutzerklärung</h1><p>Diese Datenschutzerklärung beschreibt, wie ZhStudio personenbezogene Daten im Zusammenhang mit dieser Website verarbeitet.</p></section>
        <section><h2>Erhebung und Verwendung von Daten</h2><p>Technisch notwendige Zugriffsdaten und freiwillig übermittelte Kontaktangaben werden zur Bereitstellung der Website und zur Bearbeitung von Anfragen verarbeitet.</p></section>
        <section><h2>Hosting und Kontaktformular</h2><p>Die Website wird über Cloudflare bereitgestellt. Formularanfragen werden über Formspree zur Zustellung und technischen Verarbeitung übermittelt.</p></section>
        <section><h2>Kontakt für Datenschutzanfragen</h2><p>Anfragen zu Auskunft, Berichtigung oder Löschung können an <a href="mailto:info@zhstudio.ch">info@zhstudio.ch</a> gerichtet werden.</p></section>
      </main>`,
  },
}

function replaceMeta(html, page, path) {
  const canonicalUrl = `${canonicalOrigin}${path === '/' ? '/' : path}`
  const robots = page.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/s, `$1${page.description}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*("\s*\/?>)/, `$1${page.title}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*("\s*\/?>)/s, `$1${page.description}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*("\s*\/?>)/, `$1${canonicalUrl}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*("\s*\/?>)/, `$1${page.title}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*("\s*\/?>)/s, `$1${page.description}$2`)
    .replace(/(<meta\s+name="robots"\s+content=")[^"]*("\s*\/?>)/s, `$1${robots}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*("\s*\/?>)/, `$1${canonicalUrl}$2`)
}

const template = await readFile(new URL('index.html', distUrl), 'utf8')

for (const [path, page] of Object.entries(pages)) {
  const html = replaceMeta(template, { ...page, ...routeMetadata[path] }, path).replace(
    /<div id="root">[\s\S]*<\/div>\s*<\/body>/,
    `<div id="root">${page.body}</div>\n  </body>`,
  )
  const outputUrl = path === '/' ? new URL('index.html', distUrl) : new URL(`${path.slice(1)}.html`, distUrl)
  await writeFile(outputUrl, html)
}

console.log(`Generated static HTML for ${Object.keys(pages).length} public pages.`)
