import { useLocale, LocaleContext, rememberLanguage } from './i18n.jsx'
import { baseRoute, localeFor, localizedPath, languageAlternates } from './languages.js'
import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { canonicalUrlFor, knownRoutes, legacyRoutes, routeMetadata, notFoundMetadataFor } from './seo'
import { faqsFor } from './content.js'
import NotFoundPage from './components/NotFoundPage'
import FaqItem from './components/FaqItem'
import { structuredDataFor } from './structured-data.js'

const SideRays = lazy(() => import('./components/SideRays'))
const Lanyard = lazy(() => import('./components/Lanyard/Lanyard'))
const AccordionGallery = lazy(() => import('./components/AccordionGallery/AccordionGallery'))

const formEndpoint = 'https://formspree.io/f/xvzdeqvn'

const servicesDe = [
  {
    number: '01',
    title: 'Konzept & Struktur',
    text: 'Eine klare Seitenlogik führt Menschen schnell zu den Informationen und Kontaktwegen, die wirklich zählen.',
    points: ['Seitenstruktur und Nutzerführung', 'Inhaltliche Prioritäten', 'Klare Kontaktwege'],
  },
  {
    number: '02',
    title: 'Webdesign & Umsetzung',
    text: 'Individuelles Design, responsive umgesetzt und auf einen ruhigen, glaubwürdigen Gesamtauftritt ausgerichtet.',
    points: ['Individuelle Gestaltung', 'Responsive Frontend-Umsetzung', 'Saubere Interaktionen'],
  },
  {
    number: '03',
    title: 'Technische Basis',
    text: 'Solide Grundlagen für schnelle Ladezeiten, Auffindbarkeit und eine Website, die zuverlässig funktioniert.',
    points: ['Performance-Grundlagen', 'Technische SEO-Basis', 'Veröffentlichung und Übergabe'],
  },
]

const inboxReferenceViewsDe = [
  {
    image: '/references/inbox-overview.jpg',
    label: 'Alles drin',
    link: 'https://inbx.page/#alles-drin',
    alt: 'Inbox-Website mit der Überschrift Eine App. Dein ganzer Schultag.',
  },
  {
    image: '/references/inbox-grades.jpg',
    label: 'Noten & Prüfungen',
    link: 'https://inbx.page/funktionen#noten',
    alt: 'Inbox-Website mit Notenübersicht, Pluspunkten und kommenden Prüfungen',
  },
  {
    image: '/references/inbox-absences.jpg',
    label: 'Absenzen',
    link: 'https://inbx.page/funktionen#absenzen',
    alt: 'Inbox-Website mit einer mobilen Übersicht offener und erledigter Absenzen',
  },
]

const processStepsDe = [
  ['01', 'Kennenlernen', 'Ziele, Umfang und vorhandene Inhalte werden in einem kurzen Gespräch geklärt.'],
  ['02', 'Richtung festlegen', 'Struktur, visuelle Richtung und die wichtigsten Entscheidungen werden transparent abgestimmt.'],
  ['03', 'Gestalten & umsetzen', 'Die Website entsteht responsiv und wird in nachvollziehbaren Schritten geprüft.'],
  ['04', 'Veröffentlichen', 'Nach der Freigabe wird die fertige Seite live geschaltet und sauber übergeben.'],
]

const standardsDe = [
  ['Klarheit', 'Jede Seite hat eine erkennbare Aufgabe und eine nachvollziehbare Hierarchie.'],
  ['Sorgfalt', 'Typografie, Abstände, Kontraste und mobile Zustände werden konsequent ausgearbeitet.'],
  ['Tempo', 'Bilder, Code und technische Grundlagen werden auf kurze Ladezeiten ausgerichtet.'],
  ['Nähe', 'Direkte Abstimmung mit ZhStudio in Stäfa – ohne unnötige Übergaben.'],
]

const legalContentDe = {
  impressum: {
    eyebrow: 'Impressum',
    title: 'Impressum für ZhStudio',
    intro: 'Angaben gemäss den aktuell verfügbaren Informationen zu ZhStudio. Wenn sich Rechtsform, Firmenstatus oder Kontaktdaten ändern, wird diese Seite entsprechend aktualisiert.',
    sections: [
      {
        title: 'Anbieter',
        body: ['ZhStudio', 'Neuhausweg 1, 8712 Stäfa, Schweiz', 'Derzeit nicht im Handelsregister eingetragen.', 'Aktuell ohne eingetragene Rechtsform / ohne Handelsregistereintrag.'],
      },
      {
        title: 'Kontakt',
        body: ['Website: zhstudio.ch', 'E-Mail: info@zhstudio.ch', 'Telefon: +41 78 251 20 23', 'Kontaktanfragen können per Kontaktformular, E-Mail oder Telefon erfolgen.'],
      },
      { title: 'Verantwortlich für den Inhalt', body: ['Yannis Ress Lasser', 'Verantwortlich für die Inhalte dieser Website.'] },
      {
        title: 'Haftungshinweis',
        body: ['Die Inhalte dieser Website werden mit grösstmöglicher Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität wird jedoch keine Gewähr übernommen.', 'Externe Links liegen in der Verantwortung der jeweiligen Anbieter.'],
      },
    ],
  },
  datenschutz: {
    eyebrow: 'Datenschutz',
    title: 'Datenschutzerklärung',
    intro: 'Diese Datenschutzerklärung beschreibt, wie ZhStudio personenbezogene Daten im Zusammenhang mit dieser Website verarbeitet.',
    sections: [
      {
        title: 'Allgemeines',
        body: ['Der Schutz persönlicher Daten ist ZhStudio wichtig.', 'Personenbezogene Daten werden vertraulich und im Rahmen der anwendbaren Datenschutzgesetze behandelt.'],
      },
      {
        title: 'Erhebung von Daten',
        body: ['Beim Besuch dieser Website können technisch notwendige Daten wie Browsertyp, Uhrzeit oder IP-Adresse vorübergehend verarbeitet werden.', 'Wenn ihr uns per Kontaktformular, E-Mail oder Telefon kontaktiert, werden die von euch übermittelten Angaben zur Bearbeitung der Anfrage verwendet.'],
      },
      {
        title: 'Hosting und technische Bereitstellung',
        body: ['Diese Website wird über Cloudflare bereitgestellt. Im Rahmen des Hostings können technisch notwendige Server- und Sicherheitsprotokolle verarbeitet werden.', 'Für Versionsverwaltung und Bereitstellung wird GitHub als technische Plattform im Hintergrund eingesetzt.'],
      },
      {
        title: 'Kontaktformular und Kommunikation',
        body: ['Über das Kontaktformular können Name, E-Mail-Adresse, Firma, bestehende Website, Telefonnummer und Nachricht übermittelt werden.', 'Die Formularübermittlung erfolgt über den Dienst Formspree. Die eingegebenen Daten werden dort zur Zustellung und technischen Verarbeitung der Anfrage verarbeitet.', 'Zusätzlich sind Kontaktaufnahmen per E-Mail an info@zhstudio.ch oder telefonisch möglich. Die Angaben werden zur Bearbeitung der Anfrage und für mögliche Anschlusskommunikation verwendet.'],
      },
      {
        title: 'Cookies, Analyse und Einbettungen',
        body: ['Nach aktuellem Stand werden keine Analyse- oder Tracking-Tools wie Google Analytics eingesetzt.', 'Die gewählte Sprache wird lokal im Browser gespeichert, damit sie bei späteren Besuchen erhalten bleibt. Diese Einstellung wird nicht für Werbung oder Analyse verwendet.', 'Es werden keine zusätzlichen Cookies zu Werbe- oder Statistikzwecken, keine Karten, keine Newsletter-Dienste und keine eingebetteten Drittinhalte verwendet.'],
      },
      { title: 'Schriftarten', body: ['Die auf dieser Website eingesetzten Web-Schriftarten werden lokal bereitgestellt.'] },
      {
        title: 'Rechte der betroffenen Personen',
        body: ['Betroffene Personen können Auskunft über gespeicherte Daten verlangen sowie Berichtigung oder Löschung im rechtlich zulässigen Rahmen beantragen.', 'Anfragen können an info@zhstudio.ch gerichtet werden.'],
      },
      { title: 'Räumlicher Geltungsbereich', body: ['Das Angebot richtet sich primär an Kundinnen und Kunden in der Schweiz und im EU-Raum.'] },
    ],
  },
}

function normalizeRoutePathname(pathname = '/') {
  const withoutTrailingSlash = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const lowerPathname = withoutTrailingSlash.toLowerCase()
  const aliasedPath = legacyRoutes[lowerPathname] || lowerPathname
  return knownRoutes.includes(aliasedPath) ? aliasedPath : pathname
}

function getLocationState() {
  if (typeof window === 'undefined') return { pathname: '/', hash: '' }
  return { pathname: normalizeRoutePathname(window.location.pathname), hash: window.location.hash || '' }
}

function navigateTo(href, updateLocation) {
  const url = new URL(href, window.location.origin)
  const nextLocation = { pathname: normalizeRoutePathname(url.pathname), hash: url.hash || '' }
  const nextUrl = `${nextLocation.pathname}${nextLocation.hash}`
  if (`${window.location.pathname}${window.location.hash}` !== nextUrl) window.history.pushState({}, '', nextUrl)
  updateLocation(nextLocation)
}

function useMediaQuery(query) {
  return useSyncExternalStore(
    (notify) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', notify)
      return () => mediaQuery.removeEventListener('change', notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

function LineIcon({ name }) {
  const paths = {
    structure: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 9v11" /></>,
    design: <><path d="m4 16 8-12 8 12" /><path d="M7 16h10v4H7zM12 4v12" /></>,
    performance: <><path d="M4 14a8 8 0 1 1 16 0" /><path d="m12 14 4-5M7 18h10" /></>,
    clarity: <><circle cx="12" cy="12" r="8" /><path d="M8.5 12.5 11 15l5-6" /></>,
  }
  return <svg className="line-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.clarity}</svg>
}

function Header({ onNavigate, routePath }) {
  const { t, href: toLocale, locale } = useLocale()
  const handleNavigate = (event, href) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <header className="topbar">
      <a className="brand" href={toLocale("/")} onClick={(event) => handleNavigate(event, '/')}>
        <img src="/logo-mark.png" alt={t("ZhStudio Logo")} />
        <div><strong>ZhStudio</strong><span>{t("Webdesign · Stäfa")}</span></div>
      </a>
      <nav className="nav" aria-label={t("Hauptnavigation")}>
        {[
          ['/', t("Start")],
          ['/leistungen', t("Leistungen")],
          ['/kontakt', t("Kontakt")],
        ].map(([href, label]) => (
          <a
            className={routePath === href ? 'nav-link-active' : ''}
            href={toLocale(href)}
            onClick={(event) => handleNavigate(event, href)}
            aria-current={routePath === href ? 'page' : undefined}
            key={href}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="language-switch" role="group" aria-label={locale === 'fr' ? 'Langue du site' : 'Sprache der Website'}>
        {['de', 'fr'].map(language => <a key={language} href={`${localizedPath(knownRoutes.includes(localizedPath(routePath, locale)) ? routePath : '/', language)}?lang=${language}`} hrefLang={language} lang={language} aria-current={language === locale ? 'true' : undefined} onClick={() => rememberLanguage(language)}>{language.toUpperCase()}</a>)}
      </div>
      <a className="header-cta" href={toLocale("/kontakt")} onClick={(event) => handleNavigate(event, '/kontakt')}>{t("Projekt anfragen")}{' '}<span aria-hidden="true">↗</span></a>
    </header>
  )
}

function Footer() {
  const { t, href: toLocale } = useLocale()
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/logo-mark.png" alt="" aria-hidden="true" />
        <div><strong>ZhStudio</strong><span>{t("Webdesign aus Stäfa im Kanton Zürich")}</span></div>
      </div>
      <div className="footer-links">
        <a href={toLocale("/")}>{t("Start")}</a><a href={toLocale("/leistungen")}>{t("Leistungen")}</a><a href={toLocale("/kontakt")}>{t("Kontakt")}</a>
        <a href="mailto:info@zhstudio.ch">{t("E-Mail")}</a><a href={toLocale("/impressum")}>{t("Impressum")}</a><a href={toLocale("/datenschutz")}>{t("Datenschutz")}</a>
        <a className="footer-linkedin" href="https://www.linkedin.com/company/zhstudio" target="_blank" rel="noopener noreferrer" aria-label={t("ZhStudio auf LinkedIn (öffnet in neuem Tab)")}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0Z" /></svg>
          <span>LinkedIn</span>
        </a>
      </div>
      <p className="footer-note">{t("Professionelle Websites für Unternehmen rund um Stäfa, die Goldküste und Zürich.")}</p>
    </footer>
  )
}

class VisualErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error) { console.error('The interactive 3D visual could not be rendered.', error) }
  render() { return this.state.hasError ? this.props.fallback : this.props.children }
}

function HomeVisual({ enabled }) {
  const { t } = useLocale()
  const [is3DReady, setIs3DReady] = useState(false)
  useEffect(() => {
    if (!enabled || is3DReady) return undefined
    const mount3D = () => setIs3DReady(true)
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(mount3D, { timeout: 800 })
      return () => window.cancelIdleCallback(idleId)
    }
    const timeoutId = window.setTimeout(mount3D, 200)
    return () => window.clearTimeout(timeoutId)
  }, [enabled, is3DReady])
  if (!enabled) return null

  return (
    <div className="unified-visual unified-lanyard" role="img" aria-label={t("Interaktiver ZhStudio-Ausweis. Er kann gezogen und gedreht werden.")}>
      {is3DReady ? (
        <VisualErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <Lanyard position={[0, 0, 17]} gravity={[0, -40, 0]} fov={20} frontImage="/lanyard/front.png" backImage="/lanyard/back.png" imageFit="cover" lanyardImage="/lanyard/band.png" lanyardWidth={1.12} lanyardRepeat={1} anchorX={2} anchorY={3.25} cardScale={2.25} ropeLength={0.8} />
          </Suspense>
        </VisualErrorBoundary>
      ) : null}
      <div className="unified-lanyard-hint" aria-hidden="true"><span>↙</span>{t("Drag it")}</div>
    </div>
  )
}

function HomePage({ onNavigate }) {
  const { t, href: toLocale, localize } = useLocale()
  const standards = localize(standardsDe)
  const processSteps = localize(processStepsDe)
  const showEnhancedVisuals = useMediaQuery('(min-width: 641px)')
  const handleNavigate = (event, href) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <main className="selector-page unified-home-page studio-home">
      <section className="unified-hero">
        <div className="unified-side-rays" aria-hidden="true">
          {showEnhancedVisuals ? (
            <Suspense fallback={null}>
              <SideRays speed={2} rayColor1="#5968ee" rayColor2="#d7d9e1" intensity={1.6} spread={2} origin="top-right" tilt={0} saturation={0.8} blend={0.68} falloff={1.7} opacity={0.88} />
            </Suspense>
          ) : null}
        </div>
        <div className="unified-hero-copy">
          <span className="eyebrow">{t("Webdesign aus Stäfa")}</span>
          <h1>{t("Websites, die Vertrauen schaffen.")}</h1>
          <p>{t("ZhStudio gestaltet professionelle, schnelle Websites für lokale Unternehmen im Kanton Zürich. Klar im Aufbau, hochwertig im Detail und sauber auf Anfragen ausgerichtet.")}</p>
          <div className="unified-actions">
            <a className="button button-primary" href={toLocale("/kontakt")} onClick={(event) => handleNavigate(event, '/kontakt')}>{t("Projekt anfragen")}{' '}<span>↗</span></a>
            <a className="button button-secondary" href={toLocale("/leistungen")} onClick={(event) => handleNavigate(event, '/leistungen')}>{t("Leistungen")}{' '}<span>↗</span></a>
          </div>
          <div className="unified-proof"><span>{t("Webdesign")}</span><span>{t("Responsive")}</span><span>{t("lokal im Kanton Zürich")}</span></div>
        </div>
        <HomeVisual enabled={showEnhancedVisuals} />
      </section>

      <div className="studio-home-body">
        <section className="studio-intro section-reveal" aria-labelledby="studio-intro-title">
          <span className="studio-index">{t("01 / Haltung")}</span>
          <div><h2 id="studio-intro-title">{t("Ein seriöser Webauftritt beginnt mit Klarheit.")}</h2><p>{t("Gute Websites schaffen Vertrauen: Sie sind verständlich aufgebaut, wirken sorgfältig und machen im richtigen Moment den nächsten Schritt leicht.")}</p></div>
        </section>

        <section className="studio-editorial section-reveal" aria-label={t("Einblicke in Gestaltung und digitale Arbeitsweise")}>
          <figure className="editorial-card editorial-card-wide image-reveal">
            <img src="/editorial/architecture.jpg" alt={t("Klare Raster und Linien einer modernen Fassade")} loading="lazy" />
            <figcaption><span>01</span><strong>{t("Struktur schafft Orientierung")}</strong></figcaption>
          </figure>
          <figure className="editorial-card image-reveal">
            <img src="/editorial/process.jpg" alt={t("Aufgeräumter Arbeitsplatz mit Laptop, Notizbüchern und Materialmustern")} loading="lazy" />
            <figcaption><span>02</span><strong>{t("Sorgfalt bis ins Detail")}</strong></figcaption>
          </figure>
        </section>

        <section className="studio-standard section-reveal" aria-labelledby="studio-standard-title">
          <div className="studio-standard-copy"><span className="studio-index">{t("02 / Qualitätsanspruch")}</span><h2 id="studio-standard-title">{t("Was eine Website von ZhStudio auszeichnet.")}</h2><p>{t("Nicht Effekte um ihrer selbst willen, sondern Entscheidungen, die den Auftritt glaubwürdiger und die Nutzung einfacher machen.")}</p></div>
          <div className="studio-standard-grid">
            {standards.map(([title, text], index) => <article className="reveal-item" key={title}><span><LineIcon name="clarity" /> 0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="studio-process section-reveal" aria-labelledby="studio-process-title">
          <div className="studio-section-head"><span className="studio-index">{t("03 / Ablauf")}</span><div><h2 id="studio-process-title">{t("Vier nachvollziehbare Schritte.")}</h2><p>{t("Direkte Abstimmung, klare Entscheidungen und ein sauberer Weg bis zur Veröffentlichung.")}</p></div></div>
          <ol className="studio-process-list">
            {processSteps.map(([number, title, text]) => <li className="reveal-item" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
        </section>

        <FaqSection />

        <section className="studio-cta section-reveal" aria-labelledby="studio-cta-title">
          <div><span className="studio-index">{t("Projektstart")}</span><h2 id="studio-cta-title">{t("Einfache Webauftritte ab CHF 680.")}</h2><p>{t("Erzählt kurz, was ihr braucht. Danach folgt eine persönliche Einschätzung und eine klare Offerte.")}</p></div>
          <a className="button studio-cta-button" href={toLocale("/kontakt")} onClick={(event) => handleNavigate(event, '/kontakt')}>{t("Anfrage starten")}{' '}<span>↗</span></a>
        </section>
      </div>
      <Footer />
    </main>
  )
}

function FaqSection() {
  const { t, locale } = useLocale()
  return (
    <section className="studio-faq section-reveal" aria-labelledby="studio-faq-title">
      <div className="studio-section-head"><span className="studio-index">{t("04 / Fragen")}</span><div><h2 id="studio-faq-title">{t("Häufige Fragen, klar beantwortet.")}</h2></div></div>
      <div className="studio-faq-list">
        {faqsFor(locale).map((item) => <FaqItem key={item.question} {...item} />)}
      </div>
    </section>
  )
}

function ServicesPage() {
  const { t, href: toLocale, localize } = useLocale()
  const services = localize(servicesDe)
  const inboxReferenceViews = localize(inboxReferenceViewsDe)
  return (
    <>
      <main className="services-page-main refined-page services-redesign">
        <section className="services-redesign-hero section-reveal" aria-labelledby="services-title">
          <div className="services-redesign-copy">
            <span className="eyebrow">{t("01 / Webdesign")}</span>
            <h1 id="services-title">{t("Websites mit Substanz.")}</h1>
            <p>{t("Vom ersten Seitenraster bis zum veröffentlichten Auftritt: ZhStudio gestaltet und entwickelt Websites, die verständlich, hochwertig und auf jedem Gerät überzeugend sind.")}</p>
            <a className="services-inline-link" href={toLocale("/kontakt")}>{t("Projekt besprechen")}{' '}<span aria-hidden="true">↗</span></a>
          </div>
          <figure className="services-redesign-visual image-reveal">
            <img src="/editorial/workspace.jpg" alt={t("Aufgeräumter Arbeitsplatz für Konzeption und Webdesign")} />
            <figcaption><span>{t("Konzept")}</span><span>{t("Design")}</span><span>{t("Entwicklung")}</span></figcaption>
          </figure>
        </section>

        <section className="services-redesign-list section-reveal" aria-labelledby="services-overview-title">
          <header>
            <span className="eyebrow">{t("02 / Leistungen")}</span>
            <h2 id="services-overview-title">{t("Alles, was ein starker Webauftritt braucht.")}</h2>
          </header>
          <div className="refined-service-grid" aria-label={t("Webdesign-Leistungen")}>
          {services.map((service) => <article className="reveal-item" key={service.number}><span className="service-symbol"><LineIcon name={['structure', 'design', 'performance'][Number(service.number) - 1]} /><small>{service.number}</small></span><h2>{service.title}</h2><p>{service.text}</p><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul></article>)}
          </div>
        </section>

        <section className="reference-showcase section-reveal" aria-labelledby="reference-title">
          <div className="reference-showcase-head">
            <div>
              <span className="eyebrow">{t("03 / Referenz")}</span>
              <h2 id="reference-title">Inbox</h2>
            </div>
            <div className="reference-showcase-copy">
              <p>{t("Eine vollständig von ZhStudio realisierte Website für eine moderne Schul-App – vom visuellen System bis zur responsiven Umsetzung.")}</p>
              <a href="https://inbx.page/" target="_blank" rel="noreferrer">{t("Live ansehen")}{' '}<span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <Suspense fallback={<div className="reference-gallery-fallback" aria-hidden="true" />}>
            <AccordionGallery
              items={inboxReferenceViews}
              defaultIndex={0}
              expandRatio={0.62}
              accentColor="#7d89ff"
              overlayColor="#0a0a0d"
              height={500}
              gap={10}
              radius={14}
              duration={0.55}
              tilt={4}
              parallax={0.35}
            />
          </Suspense>
          <p className="reference-showcase-note">{t("Mit Maus, Fokus oder Fingertipp erkunden · Das aktive Panel öffnet die jeweilige Seite.")}</p>
        </section>

        <section className="refined-price section-reveal">
          <div><span className="eyebrow">{t("04 / Offerte")}</span><h2>{t("Bereit für eine Website, die passt?")}</h2><p>{t("Einfache Webauftritte starten ab CHF 680. Für den tatsächlichen Umfang folgt eine klare, persönliche Offerte.")}</p></div>
          <a className="button button-primary" href={toLocale("/kontakt")}>{t("Projekt anfragen")}{' '}<span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ContactPage({ onNavigate }) {
  const { t, href: toLocale, locale } = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setIsSubmitting(true)
    setFormError('')
    try {
      const response = await fetch(form.action, { method: form.method, body: formData, headers: { Accept: 'application/json' } })
      if (!response.ok) throw new Error('Form submission failed')
      form.reset()
      onNavigate('/danke')
    } catch {
      setFormError(t("Das Formular konnte nicht gesendet werden. Bitte versucht es nochmals oder schreibt direkt an info@zhstudio.ch."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <main className="contact-page-main refined-page">
        <section className="contact-focus section-reveal" id="kontaktformular">
          <div className="contact-focus-intro">
            <span className="eyebrow">{t("Kontakt")}</span><h1>{t("Erzählt kurz, welche Website ihr braucht.")}</h1>
            <p className="contact-focus-text">{t("Ein paar Angaben reichen für eine erste Einschätzung. ZhStudio meldet sich persönlich zurück und klärt die nächsten Schritte.")}</p>
            <div className="refined-contact-meta"><a href="mailto:info@zhstudio.ch">info@zhstudio.ch</a><span>Neuhausweg 1, 8712 Stäfa</span><a href="tel:+41782512023">+41 78 251 20 23</a></div>
          </div>
          <div className="contact-form-shell">
            <div className="contact-form-head"><div><span className="eyebrow">{t("Projektanfrage")}</span><h2>{t("Die wichtigsten Angaben auf einen Blick.")}</h2></div></div>
            <form className="contact-form contact-form-focused" action={formEndpoint} method="POST" onSubmit={handleSubmit}
              onInvalid={(event) => {
                const field = event.target
                field.setCustomValidity('')
                if (field.validity.valueMissing) field.setCustomValidity(locale === 'fr' ? 'Veuillez remplir ce champ.' : 'Bitte füllt dieses Feld aus.')
                else if (field.validity.typeMismatch) field.setCustomValidity(locale === 'fr' ? 'Veuillez saisir une adresse e-mail valide.' : 'Bitte gebt eine gültige E-Mail-Adresse ein.')
              }}
              onInput={(event) => event.target.setCustomValidity?.('')}>
              <input type="hidden" name="_subject" value={t("Neue Website-Anfrage über zhstudio.ch")} />
              <div className="form-grid">
                <label className="form-field"><span>{t("Name")}</span><input type="text" name="name" placeholder={t("Bastian Beispiel")} required /></label>
                <label className="form-field"><span>{t("E-Mail")}</span><input type="email" name="email" placeholder={t("bastian@beispiel.com")} required /></label>
                <label className="form-field"><span>{t("Firma")}</span><input type="text" name="company" placeholder={t("Bastians Bäckerei")} required /></label>
                <label className="form-field"><span>{t("Website (falls vorhanden)")}</span><input type="text" name="website" placeholder={t("beispiel.ch")} inputMode="url" autoComplete="url" /></label>
                <label className="form-field"><span>{t("Telefon (optional)")}</span><input type="tel" name="phone" placeholder="+41 79 123 45 67" /></label>
                <label className="form-field form-field-full"><span>{t("Nachricht")}</span><textarea name="message" placeholder={t("Worum geht es und was soll die neue Website leisten?")} required /></label>
              </div>
              <div className="form-actions">
                <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? t("Wird gesendet…") : t("Nachricht senden")}</button>
                <p className="form-note">{t("Mit dem Absenden akzeptiert ihr die Verarbeitung gemäss")}{' '}<a href={toLocale("/datenschutz")}>{t("Datenschutzerklärung")}</a>.</p>
              </div>
              {formError ? <p className="form-error" role="alert">{formError}</p> : null}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ThankYouPage() {
  const { t, href: toLocale } = useLocale()
  return (
    <><main className="thank-you-main"><section className="thank-you-focus section-reveal"><div className="thank-you-card"><span className="eyebrow">{t("Anfrage erhalten")}</span><h1>{t("Danke. Eure Nachricht ist angekommen.")}</h1><p>{t("Wir prüfen die Angaben und melden uns so bald wie möglich persönlich zurück.")}</p><div className="thank-you-actions"><a className="button button-primary" href={toLocale("/")}>{t("Zur Startseite")}</a><a className="button button-secondary" href="mailto:info@zhstudio.ch">info@zhstudio.ch</a></div></div></section></main><Footer /></>
  )
}

function LegalPage({ pageKey }) {
  const { localize } = useLocale()
  const page = localize(legalContentDe[pageKey])
  return (
    <><main className="legal-main refined-page"><section className="legal-hero section-reveal"><div className="section-heading"><span className="eyebrow">{page.eyebrow}</span><h1 className="legal-title">{page.title}</h1><p className="hero-text legal-intro">{page.intro}</p></div></section><section className="legal-grid section-reveal">{page.sections.map((section) => <article className="legal-card" key={section.title}><h2>{section.title}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article>)}</section></main><Footer /></>
  )
}

export default function App({ initialPathname }) {
  const appRef = useRef(null)
  const [location, setLocation] = useState(() => initialPathname
    ? { pathname: normalizeRoutePathname(initialPathname), hash: '' }
    : getLocationState())
  const [navigationTick, setNavigationTick] = useState(0)
  const path = location.pathname
  const isHomePage = baseRoute(path) === '/'
  const isNotFound = !knownRoutes.includes(path)
  const locale = localeFor(path)
  const route = baseRoute(path)
  const pageMeta = routeMetadata[path] || notFoundMetadataFor(locale)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const explicit = params.get('lang')
    if (explicit === 'de' || explicit === 'fr') {
      rememberLanguage(explicit)
      const target = localizedPath(window.location.pathname, explicit)
      params.delete('lang')
      const query = params.size ? `?${params}` : ''
      if (target !== window.location.pathname) { window.location.replace(`${target}${query}${window.location.hash}`); return }
      window.history.replaceState({}, '', `${target}${query}${window.location.hash}`)
      return
    }
    const current = window.location.pathname
    if (current !== '/') { rememberLanguage(localeFor(current)); return }
    let saved
    try { saved = localStorage.getItem('zhstudio-language') } catch { /* Storage may be disabled. */ }
    const language = saved || ((navigator.languages?.[0] || navigator.language || '').toLowerCase().startsWith('fr') ? 'fr' : 'de')
    if (language === 'fr') window.location.replace(`/fr${window.location.search}${window.location.hash}`)
    else rememberLanguage('de')
  }, [])

  useEffect(() => {
    // Hashes are client-only; retain incoming deep links after hydration.
    if (window.location.hash && !location.hash) {
      setLocation(getLocationState())
      return
    }
    // A shared prerendered 404 must keep the visitor's original URL.
    if (isNotFound) return
    const normalizedUrl = `${path}${location.hash}`
    if (`${window.location.pathname}${window.location.hash}` !== normalizedUrl) window.history.replaceState({}, '', normalizedUrl)
  }, [path, location.hash, isNotFound])

  useEffect(() => {
    const handleLocationChange = () => setLocation(getLocationState())
    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = `${locale}-CH`
    document.title = pageMeta.title
    const structuredData = document.getElementById('structured-data')
    if (structuredData) structuredData.textContent = JSON.stringify(isNotFound ? {} : structuredDataFor(path))
    const canonicalUrl = canonicalUrlFor(path)
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageMeta.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageMeta.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', pageMeta.description)
    let ogUrl = document.querySelector('meta[property="og:url"]')
    if (!isNotFound && !ogUrl) {
      ogUrl = document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      document.head.append(ogUrl)
    }
    ogUrl?.setAttribute('content', canonicalUrl)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', pageMeta.title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', pageMeta.description)
    document.querySelector('meta[name="robots"]')?.setAttribute('content', pageMeta.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    let canonical = document.querySelector('link[rel="canonical"]')
    if (isNotFound) {
      canonical?.remove()
      document.querySelector('meta[property="og:url"]')?.removeAttribute('content')
    } else {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.append(canonical)
      }
      canonical.href = canonicalUrl
    }
    const socialImage = `https://zhstudio.ch/${locale === 'fr' ? 'og-fr.png' : 'og.png?v=2'}`
    const socialAlt = locale === 'fr' ? 'ZhStudio – Création de sites web à Stäfa' : 'ZhStudio – Webdesign aus Stäfa'
    for (const key of ['og:image', 'og:image:secure_url']) document.querySelector(`meta[property="${key}"]`)?.setAttribute('content', socialImage)
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', socialImage)
    document.querySelector('meta[property="og:image:alt"]')?.setAttribute('content', socialAlt)
    document.querySelector('meta[name="twitter:image:alt"]')?.setAttribute('content', socialAlt)
    const textSource = document.querySelector('link[rel="alternate"][type="text/plain"]')
    textSource?.setAttribute('href', locale === 'fr' ? '/fr/llms.txt' : '/llms.txt')
    textSource?.setAttribute('title', locale === 'fr' ? 'Informations pour les systèmes d’IA' : 'Informationen für KI-Systeme')
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', `${locale}_CH`)
    document.querySelectorAll('link[hreflang]').forEach(link => link.remove())
    for (const alternate of languageAlternates(path)) {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = alternate.lang
      link.href = canonicalUrlFor(alternate.path)
      document.head.append(link)
    }
  }, [pageMeta, path, isNotFound, locale])

  useLayoutEffect(() => {
    const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    if (!location.hash) {
      scrollToTop()
      requestAnimationFrame(scrollToTop)
      return
    }
    let anchor = location.hash.slice(1)
    try { anchor = decodeURIComponent(anchor) } catch { /* Keep malformed hashes harmless. */ }
    requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }))
  }, [path, location.hash, navigationTick])

  const handleNavigate = (href) => {
    navigateTo(localizedPath(href, locale), setLocation)
    setNavigationTick((tick) => tick + 1)
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const elements = [...document.querySelectorAll('.section-reveal, .reveal-item, .image-reveal')]
    if (!('IntersectionObserver' in window)) return undefined
    // The initial HTML is visible. Mark the current viewport before enabling
    // off-screen reveal effects so hydration never hides already painted text.
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) element.classList.add('is-visible')
    })
    document.documentElement.dataset.revealReady = 'true'
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [path])

  return (
    <LocaleContext.Provider value={locale}>
    <div className={`site-shell${isHomePage ? ' site-selector' : ' site-web site-web-theme'}${route === '/impressum' || route === '/datenschutz' ? ' legal-shell' : ''}`} ref={appRef}>
      <div className="background-motion" /><div className="background-grid" />
      <Header onNavigate={handleNavigate} routePath={route} />
      {isNotFound ? <><NotFoundPage /><Footer /></> : null}
      {route === '/' ? <HomePage onNavigate={handleNavigate} /> : null}
      {route === '/leistungen' ? <ServicesPage /> : null}
      {route === '/kontakt' ? <ContactPage onNavigate={handleNavigate} /> : null}
      {route === '/danke' ? <ThankYouPage /> : null}
      {route === '/impressum' ? <LegalPage pageKey="impressum" /> : null}
      {route === '/datenschutz' ? <LegalPage pageKey="datenschutz" /> : null}
    </div>
    </LocaleContext.Provider>
  )
}
