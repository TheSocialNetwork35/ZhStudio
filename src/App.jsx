import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'

const SideRays = lazy(() => import('./components/SideRays'))
const Lanyard = lazy(() => import('./components/Lanyard/Lanyard'))
const AccordionGallery = lazy(() => import('./components/AccordionGallery/AccordionGallery'))

const formEndpoint = 'https://formspree.io/f/xvzdeqvn'
const canonicalOrigin = 'https://www.zhstudio.ch'
const knownRoutes = ['/', '/leistungen', '/kontakt', '/danke', '/impressum', '/datenschutz']
const legacyRoutes = {
  '/website': '/',
  '/website/leistungen': '/leistungen',
  '/website/kontakt': '/kontakt',
  '/website/danke': '/danke',
}

const services = [
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

const inboxReferenceViews = [
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

const processSteps = [
  ['01', 'Kennenlernen', 'Ziele, Umfang und vorhandene Inhalte werden in einem kurzen Gespräch geklärt.'],
  ['02', 'Richtung festlegen', 'Struktur, visuelle Richtung und die wichtigsten Entscheidungen werden transparent abgestimmt.'],
  ['03', 'Gestalten & umsetzen', 'Die Website entsteht responsiv und wird in nachvollziehbaren Schritten geprüft.'],
  ['04', 'Veröffentlichen', 'Nach der Freigabe wird die fertige Seite live geschaltet und sauber übergeben.'],
]

const standards = [
  ['Klarheit', 'Jede Seite hat eine erkennbare Aufgabe und eine nachvollziehbare Hierarchie.'],
  ['Sorgfalt', 'Typografie, Abstände, Kontraste und mobile Zustände werden konsequent ausgearbeitet.'],
  ['Tempo', 'Bilder, Code und technische Grundlagen werden auf kurze Ladezeiten ausgerichtet.'],
  ['Nähe', 'Direkte Abstimmung mit ZhStudio in Stäfa – ohne unnötige Übergaben.'],
]

const faqs = [
  {
    question: 'Was kostet eine Website bei ZhStudio?',
    answer: 'Einfache Webauftritte starten ab CHF 680. Der konkrete Preis richtet sich nach Umfang, Seitenzahl, Funktionen und dem Zustand der vorhandenen Inhalte. Vor dem Start gibt es eine klare Offerte.',
  },
  {
    question: 'Für welche Unternehmen eignet sich das Angebot?',
    answer: 'ZhStudio arbeitet für lokale Unternehmen, Praxen, Gastronomie, Handwerksbetriebe, Vereine und andere Organisationen, die einen professionellen Webauftritt benötigen.',
  },
  {
    question: 'Kann auch eine bestehende Website überarbeitet werden?',
    answer: 'Ja. Bei einem Redesign wird zuerst geprüft, welche Inhalte, Funktionen und technischen Grundlagen übernommen werden können und wo eine neue Struktur sinnvoller ist.',
  },
  {
    question: 'Was wird für den Projektstart benötigt?',
    answer: 'Hilfreich sind vorhandene Texte, Bilder, Logo-Dateien und ein kurzer Überblick über Ziele und gewünschte Funktionen. Fehlende Grundlagen werden vor Projektbeginn gemeinsam eingeordnet.',
  },
]

const metadata = {
  '/': {
    title: 'ZhStudio | Webdesign aus Stäfa',
    description: 'ZhStudio gestaltet professionelle, schnelle Websites für lokale Unternehmen in Stäfa, an der Goldküste und im Kanton Zürich.',
  },
  '/leistungen': {
    title: 'Webdesign-Leistungen in Stäfa & Zürich | ZhStudio',
    description: 'Konzept, Webdesign, responsive Umsetzung und technische SEO-Basis für professionelle Websites aus Stäfa.',
  },
  '/kontakt': {
    title: 'Webdesign anfragen | ZhStudio Stäfa',
    description: 'Website oder Redesign bei ZhStudio in Stäfa anfragen und eine persönliche, klare Offerte erhalten.',
  },
  '/danke': {
    title: 'Danke für eure Anfrage | ZhStudio',
    description: 'Die Anfrage ist bei ZhStudio angekommen. Wir melden uns so bald wie möglich persönlich zurück.',
  },
  '/impressum': {
    title: 'Impressum | ZhStudio Stäfa',
    description: 'Anbieter-, Kontakt- und Verantwortlichkeitsangaben von ZhStudio in Stäfa, Kanton Zürich.',
  },
  '/datenschutz': {
    title: 'Datenschutzerklärung | ZhStudio',
    description: 'Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten auf zhstudio.ch.',
  },
}

const legalContent = {
  impressum: {
    eyebrow: 'Impressum',
    title: 'Impressum für ZhStudio',
    intro: 'Angaben gemäss den aktuell verfügbaren Informationen zu ZhStudio. Wenn sich Rechtsform, Firmenstatus oder Kontaktdaten ändern, wird diese Seite entsprechend aktualisiert.',
    sections: [
      {
        title: 'Anbieter',
        body: ['ZhStudio', 'Weberstrasse 4, 8712 Stäfa, Schweiz', 'Derzeit nicht im Handelsregister eingetragen.', 'Aktuell ohne eingetragene Rechtsform / ohne Handelsregistereintrag.'],
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
        body: ['Nach aktuellem Stand werden keine Analyse- oder Tracking-Tools wie Google Analytics eingesetzt.', 'Es werden keine zusätzlichen Cookies zu Werbe- oder Statistikzwecken, keine Karten, keine Newsletter-Dienste und keine eingebetteten Drittinhalte verwendet.'],
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
  return knownRoutes.includes(aliasedPath) ? aliasedPath : '/'
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
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateMatches = () => setMatches(mediaQuery.matches)
    updateMatches()
    mediaQuery.addEventListener('change', updateMatches)
    return () => mediaQuery.removeEventListener('change', updateMatches)
  }, [query])
  return matches
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
  const handleNavigate = (event, href) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <header className="topbar">
      <a className="brand" href="/" onClick={(event) => handleNavigate(event, '/')}>
        <img src="/logo-mark.png" alt="ZhStudio Logo" />
        <div><strong>ZhStudio</strong><span>Webdesign · Stäfa</span></div>
      </a>
      <nav className="nav" aria-label="Hauptnavigation">
        {[
          ['/', 'Start'],
          ['/leistungen', 'Leistungen'],
          ['/kontakt', 'Kontakt'],
        ].map(([href, label]) => (
          <a
            className={routePath === href ? 'nav-link-active' : ''}
            href={href}
            onClick={(event) => handleNavigate(event, href)}
            aria-current={routePath === href ? 'page' : undefined}
            key={href}
          >
            {label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="/kontakt" onClick={(event) => handleNavigate(event, '/kontakt')}>Projekt anfragen <span aria-hidden="true">↗</span></a>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/logo-mark.png" alt="" aria-hidden="true" />
        <div><strong>ZhStudio</strong><span>Webdesign aus Stäfa im Kanton Zürich</span></div>
      </div>
      <div className="footer-links">
        <a href="/">Start</a><a href="/leistungen">Leistungen</a><a href="/kontakt">Kontakt</a>
        <a href="mailto:info@zhstudio.ch">E-Mail</a><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a>
      </div>
      <p className="footer-note">Professionelle Websites für Unternehmen rund um Stäfa, die Goldküste und Zürich.</p>
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
    <div className="unified-visual unified-lanyard" role="img" aria-label="Interaktiver ZhStudio-Ausweis. Er kann gezogen und gedreht werden.">
      {is3DReady ? (
        <VisualErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <Lanyard position={[0, 0, 17]} gravity={[0, -40, 0]} fov={20} frontImage="/lanyard/front.png" backImage="/lanyard/back.png" imageFit="cover" lanyardImage="/lanyard/band.png" lanyardWidth={1.12} lanyardRepeat={1} anchorX={2} anchorY={3.25} cardScale={2.25} ropeLength={0.8} />
          </Suspense>
        </VisualErrorBoundary>
      ) : null}
      <div className="unified-lanyard-hint" aria-hidden="true"><span>↙</span>Drag it</div>
    </div>
  )
}

function HomePage({ onNavigate }) {
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
          <span className="eyebrow">Webdesign aus Stäfa</span>
          <h1>Websites, die Vertrauen schaffen.</h1>
          <p>ZhStudio gestaltet professionelle, schnelle Websites für lokale Unternehmen im Kanton Zürich. Klar im Aufbau, hochwertig im Detail und sauber auf Anfragen ausgerichtet.</p>
          <div className="unified-actions">
            <a className="button button-primary" href="/kontakt" onClick={(event) => handleNavigate(event, '/kontakt')}>Projekt anfragen <span>↗</span></a>
            <a className="button button-secondary" href="/leistungen" onClick={(event) => handleNavigate(event, '/leistungen')}>Leistungen <span>↗</span></a>
          </div>
          <div className="unified-proof"><span>Webdesign</span><span>Responsive</span><span>lokal im Kanton Zürich</span></div>
        </div>
        <HomeVisual enabled={showEnhancedVisuals} />
      </section>

      <div className="studio-home-body">
        <section className="studio-intro section-reveal" aria-labelledby="studio-intro-title">
          <span className="studio-index">01 / Haltung</span>
          <div><h2 id="studio-intro-title">Ein seriöser Webauftritt beginnt mit Klarheit.</h2><p>Gute Websites müssen nicht laut sein. Sie müssen verständlich aufgebaut sein, sorgfältig wirken und im richtigen Moment den nächsten Schritt leicht machen.</p></div>
        </section>

        <section className="studio-editorial section-reveal" aria-label="Einblicke in Gestaltung und digitale Arbeitsweise">
          <figure className="editorial-card editorial-card-wide image-reveal">
            <img src="/editorial/architecture.jpg" alt="Klare Raster und Linien einer modernen Fassade" loading="lazy" />
            <figcaption><span>01</span><strong>Struktur schafft Orientierung</strong></figcaption>
          </figure>
          <figure className="editorial-card image-reveal">
            <img src="/editorial/process.jpg" alt="Aufgeräumter Arbeitsplatz mit Laptop, Notizbüchern und Materialmustern" loading="lazy" />
            <figcaption><span>02</span><strong>Sorgfalt bis ins Detail</strong></figcaption>
          </figure>
        </section>

        <section className="studio-standard section-reveal" aria-labelledby="studio-standard-title">
          <div className="studio-standard-copy"><span className="studio-index">02 / Qualitätsanspruch</span><h2 id="studio-standard-title">Was eine Website von ZhStudio auszeichnet.</h2><p>Nicht Effekte um ihrer selbst willen, sondern Entscheidungen, die den Auftritt glaubwürdiger und die Nutzung einfacher machen.</p></div>
          <div className="studio-standard-grid">
            {standards.map(([title, text], index) => <article className="reveal-item" key={title}><span><LineIcon name="clarity" /> 0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="studio-process section-reveal" aria-labelledby="studio-process-title">
          <div className="studio-section-head"><span className="studio-index">03 / Ablauf</span><div><h2 id="studio-process-title">Vier nachvollziehbare Schritte.</h2><p>Direkte Abstimmung, klare Entscheidungen und ein sauberer Weg bis zur Veröffentlichung.</p></div></div>
          <ol className="studio-process-list">
            {processSteps.map(([number, title, text]) => <li className="reveal-item" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
        </section>

        <FaqSection />

        <section className="studio-cta section-reveal" aria-labelledby="studio-cta-title">
          <div><span className="studio-index">Projektstart</span><h2 id="studio-cta-title">Einfache Webauftritte ab CHF 680.</h2><p>Erzählt kurz, was ihr braucht. Danach folgt eine persönliche Einschätzung und eine klare Offerte.</p></div>
          <a className="button studio-cta-button" href="/kontakt" onClick={(event) => handleNavigate(event, '/kontakt')}>Anfrage starten <span>↗</span></a>
        </section>
      </div>
      <Footer />
    </main>
  )
}

function FaqSection() {
  return (
    <section className="studio-faq section-reveal" aria-labelledby="studio-faq-title">
      <div className="studio-section-head"><span className="studio-index">04 / Fragen</span><div><h2 id="studio-faq-title">Häufige Fragen, klar beantwortet.</h2></div></div>
      <div className="studio-faq-list">
        {faqs.map((item) => <details key={item.question}><summary><span>{item.question}</span><i aria-hidden="true">+</i></summary><p>{item.answer}</p></details>)}
      </div>
    </section>
  )
}

function ServicesPage() {
  return (
    <>
      <main className="services-page-main refined-page services-redesign">
        <section className="services-redesign-hero section-reveal" aria-labelledby="services-title">
          <div className="services-redesign-copy">
            <span className="eyebrow">01 / Webdesign</span>
            <h1 id="services-title">Websites mit Substanz.</h1>
            <p>Vom ersten Seitenraster bis zum veröffentlichten Auftritt: ZhStudio gestaltet und entwickelt Websites, die verständlich, hochwertig und auf jedem Gerät überzeugend sind.</p>
            <a className="services-inline-link" href="/kontakt">Projekt besprechen <span aria-hidden="true">↗</span></a>
          </div>
          <figure className="services-redesign-visual image-reveal">
            <img src="/editorial/workspace.jpg" alt="Aufgeräumter Arbeitsplatz für Konzeption und Webdesign" />
            <figcaption><span>Konzept</span><span>Design</span><span>Entwicklung</span></figcaption>
          </figure>
        </section>

        <section className="services-redesign-list section-reveal" aria-labelledby="services-overview-title">
          <header>
            <span className="eyebrow">02 / Leistungen</span>
            <h2 id="services-overview-title">Alles, was ein starker Webauftritt braucht.</h2>
          </header>
          <div className="refined-service-grid" aria-label="Webdesign-Leistungen">
          {services.map((service) => <article className="reveal-item" key={service.number}><span className="service-symbol"><LineIcon name={['structure', 'design', 'performance'][Number(service.number) - 1]} /><small>{service.number}</small></span><h2>{service.title}</h2><p>{service.text}</p><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul></article>)}
          </div>
        </section>

        <section className="reference-showcase section-reveal" aria-labelledby="reference-title">
          <div className="reference-showcase-head">
            <div>
              <span className="eyebrow">03 / Referenz</span>
              <h2 id="reference-title">Inbox</h2>
            </div>
            <div className="reference-showcase-copy">
              <p>Eine vollständig von ZhStudio realisierte Website für eine moderne Schul-App – vom visuellen System bis zur responsiven Umsetzung.</p>
              <a href="https://inbx.page/" target="_blank" rel="noreferrer">Live ansehen <span aria-hidden="true">↗</span></a>
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
          <p className="reference-showcase-note">Mit Maus, Fokus oder Fingertipp erkunden · Das aktive Panel öffnet die jeweilige Seite.</p>
        </section>

        <section className="refined-price section-reveal">
          <div><span className="eyebrow">04 / Offerte</span><h2>Bereit für eine Website, die passt?</h2><p>Einfache Webauftritte starten ab CHF 680. Für den tatsächlichen Umfang folgt eine klare, persönliche Offerte.</p></div>
          <a className="button button-primary" href="/kontakt">Projekt anfragen <span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ContactPage({ onNavigate }) {
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
      setFormError('Das Formular konnte nicht gesendet werden. Bitte versucht es nochmals oder schreibt direkt an info@zhstudio.ch.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <main className="contact-page-main refined-page">
        <section className="contact-focus section-reveal" id="kontaktformular">
          <div className="contact-focus-intro">
            <span className="eyebrow">Kontakt</span><h1>Erzählt kurz, welche Website ihr braucht.</h1>
            <p className="contact-focus-text">Ein paar Angaben reichen für eine erste Einschätzung. ZhStudio meldet sich persönlich zurück und klärt die nächsten Schritte.</p>
            <div className="refined-contact-meta"><a href="mailto:info@zhstudio.ch">info@zhstudio.ch</a><span>Weberstrasse 4, 8712 Stäfa</span><a href="tel:+41782512023">+41 78 251 20 23</a></div>
          </div>
          <div className="contact-form-shell">
            <div className="contact-form-head"><div><span className="eyebrow">Projektanfrage</span><h2>Die wichtigsten Angaben auf einen Blick.</h2></div></div>
            <form className="contact-form contact-form-focused" action={formEndpoint} method="POST" onSubmit={handleSubmit}>
              <input type="hidden" name="_subject" value="Neue Website-Anfrage über zhstudio.ch" />
              <div className="form-grid">
                <label className="form-field"><span>Name</span><input type="text" name="name" placeholder="Bastian Beispiel" required /></label>
                <label className="form-field"><span>E-Mail</span><input type="email" name="email" placeholder="bastian@beispiel.com" required /></label>
                <label className="form-field"><span>Firma</span><input type="text" name="company" placeholder="Bastians Bäckerei" required /></label>
                <label className="form-field"><span>Website (falls vorhanden)</span><input type="text" name="website" placeholder="beispiel.ch" inputMode="url" autoComplete="url" /></label>
                <label className="form-field"><span>Telefon (optional)</span><input type="tel" name="phone" placeholder="+41 79 123 45 67" /></label>
                <label className="form-field form-field-full"><span>Nachricht</span><textarea name="message" placeholder="Worum geht es und was soll die neue Website leisten?" required /></label>
              </div>
              <div className="form-actions">
                <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Wird gesendet…' : 'Nachricht senden'}</button>
                <p className="form-note">Mit dem Absenden akzeptiert ihr die Verarbeitung gemäss <a href="/datenschutz">Datenschutzerklärung</a>.</p>
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
  return (
    <><main className="thank-you-main"><section className="thank-you-focus section-reveal"><div className="thank-you-card"><span className="eyebrow">Anfrage erhalten</span><h1>Danke. Eure Nachricht ist angekommen.</h1><p>Wir prüfen die Angaben und melden uns so bald wie möglich persönlich zurück.</p><div className="thank-you-actions"><a className="button button-primary" href="/">Zur Startseite</a><a className="button button-secondary" href="mailto:info@zhstudio.ch">info@zhstudio.ch</a></div></div></section></main><Footer /></>
  )
}

function LegalPage({ pageKey }) {
  const page = legalContent[pageKey]
  return (
    <><main className="legal-main refined-page"><section className="legal-hero section-reveal"><div className="section-heading"><span className="eyebrow">{page.eyebrow}</span><h1 className="legal-title">{page.title}</h1><p className="hero-text legal-intro">{page.intro}</p></div></section><section className="legal-grid section-reveal">{page.sections.map((section) => <article className="legal-card" key={section.title}><h2>{section.title}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article>)}</section></main><Footer /></>
  )
}

export default function App() {
  const appRef = useRef(null)
  const [location, setLocation] = useState(getLocationState)
  const [navigationTick, setNavigationTick] = useState(0)
  const path = location.pathname
  const isHomePage = path === '/'
  const pageMeta = metadata[path] || metadata['/']

  useEffect(() => {
    const normalizedUrl = `${path}${location.hash}`
    if (`${window.location.pathname}${window.location.hash}` !== normalizedUrl) window.history.replaceState({}, '', normalizedUrl)
  }, [path, location.hash])

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
    document.title = pageMeta.title
    const canonicalUrl = `${canonicalOrigin}${path === '/' ? '/' : path}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageMeta.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageMeta.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', pageMeta.description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', pageMeta.title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', pageMeta.description)
    document.querySelector('meta[name="robots"]')?.setAttribute('content', path === '/danke' ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
  }, [pageMeta, path])

  useLayoutEffect(() => {
    const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    if (!location.hash) {
      scrollToTop()
      requestAnimationFrame(scrollToTop)
      return
    }
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [path, location.hash, navigationTick])

  const handleNavigate = (href) => {
    navigateTo(href, setLocation)
    setNavigationTick((tick) => tick + 1)
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const elements = [...document.querySelectorAll('.section-reveal, .reveal-item, .image-reveal')]
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
    <div className={`site-shell${isHomePage ? ' site-selector' : ' site-web site-web-theme'}${path === '/impressum' || path === '/datenschutz' ? ' legal-shell' : ''}`} ref={appRef}>
      <div className="background-motion" /><div className="background-grid" />
      <Header onNavigate={handleNavigate} routePath={path} />
      {path === '/' ? <HomePage onNavigate={handleNavigate} /> : null}
      {path === '/leistungen' ? <ServicesPage /> : null}
      {path === '/kontakt' ? <ContactPage onNavigate={handleNavigate} /> : null}
      {path === '/danke' ? <ThankYouPage /> : null}
      {path === '/impressum' ? <LegalPage pageKey="impressum" /> : null}
      {path === '/datenschutz' ? <LegalPage pageKey="datenschutz" /> : null}
    </div>
  )
}
