import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const offerMailto =
  'mailto:info@zhstudio.ch?subject=Offerte%20f%C3%BCr%20eine%20Website'
const formEndpoint = 'https://formspree.io/f/xvzdeqvn'

function triggerOfferMail(event) {
  event.preventDefault()
  window.location.href = offerMailto
}

function getLocationState() {
  if (typeof window === 'undefined') {
    return { pathname: '/', hash: '' }
  }

  return {
    pathname: window.location.pathname || '/',
    hash: window.location.hash || '',
  }
}

function normalizeHref(href) {
  if (!href) {
    return { pathname: '/', hash: '' }
  }

  if (href.startsWith('#')) {
    return { pathname: '/', hash: href }
  }

  const url = new URL(href, window.location.origin)
  return {
    pathname: url.pathname || '/',
    hash: url.hash || '',
  }
}

function navigateTo(href, updateLocation) {
  const nextLocation = normalizeHref(href)
  const currentLocation = getLocationState()
  const nextUrl = `${nextLocation.pathname}${nextLocation.hash}`
  const currentUrl = `${currentLocation.pathname}${currentLocation.hash}`

  if (nextUrl !== currentUrl) {
    window.history.pushState({}, '', nextUrl)
  }

  updateLocation(nextLocation)
}

const services = [
  {
    title: 'Webdesign',
    text: 'Klare Seiten, starke Typografie, ruhiger Auftritt.',
    icon: 'layout',
    meta: 'Struktur & Look',
  },
  {
    title: 'SEO-Basis',
    text: 'Saubere Struktur, schnell geladen, lokal auffindbar.',
    icon: 'search',
    meta: 'Lokal sichtbar',
  },
  {
    title: 'Branding Light',
    text: 'Farben, Ton und Details, die zusammenpassen.',
    icon: 'spark',
    meta: 'Ton & Details',
  },
]

function ServiceIcon({ type }) {
  if (type === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
        <path d="M8.5 11h5" />
      </svg>
    )
  }

  if (type === 'spark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l1.8 5.1L19 10l-5.2 1.9L12 17l-1.8-5.1L5 10l5.2-1.9L12 3Z" />
        <path d="M18.5 15.5 20 18l-2.5 1.5L16 22l-1.5-2.5L12 18l2.5-1.5L16 14l1.5 2.5Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M4 10h16" />
      <path d="M9 14h6" />
      <path d="M9 17h3" />
    </svg>
  )
}

const steps = [
  'Kurz sprechen',
  'Look festlegen',
  'Sauber umsetzen',
  'Live schalten',
]

const showcases = [
  {
    name: 'Seegarten Bistro',
    location: 'Meilen',
    type: 'Restaurant & Reservierungen',
    detail:
      'Warme Bildsprache, klare Menüführung und ein schneller Weg zu Tischreservation, Karte und Öffnungszeiten.',
    tags: ['Mobile zuerst', 'Google-ready', 'Mehr Reservierungen'],
  },
  {
    name: 'Baur Sanitär',
    location: 'Stäfa',
    type: 'Handwerksbetrieb',
    detail:
      'Vertrauensvoller Auftritt mit Leistungen, Referenzen und Kontaktstruktur, die Anfragen ohne Reibung möglich macht.',
    tags: ['KMU-Auftritt', 'Lokales SEO', 'Saubere Struktur'],
  },
  {
    name: 'Praxis am See',
    location: 'Männedorf',
    type: 'Praxis & Dienstleistungen',
    detail:
      'Ruhiges Design, klare Informationen und eine Sprache, die Kompetenz und persönliche Nähe gleichzeitig vermittelt.',
    tags: ['Seriös', 'Barrierearm', 'Professionell'],
  },
]

const legalContent = {
  impressum: {
    eyebrow: 'Impressum',
    title: 'Impressum für ZhStudio',
    intro:
      'Angaben gemäss den aktuell verfügbaren Informationen zu ZhStudio. Wenn sich Rechtsform, Firmenstatus oder Kontaktdaten ändern, sollte diese Seite entsprechend aktualisiert werden.',
    sections: [
      {
        title: 'Anbieter',
        body: [
          'ZhStudio',
          'Weberstrasse 4, 8712 Stäfa, Schweiz',
          'Derzeit nicht im Handelsregister eingetragen.',
          'Aktuell ohne eingetragene Rechtsform / ohne Handelsregistereintrag.',
        ],
      },
      {
        title: 'Kontakt',
        body: [
          'Website: zhstudio.ch',
          'E-Mail: info@zhstudio.ch',
          'Telefon: +41 78 251 20 23',
          'Kontaktanfragen können per Kontaktformular, E-Mail oder Telefon erfolgen.',
        ],
      },
      {
        title: 'Verantwortlich für den Inhalt',
        body: [
          'Yannis Ress Lasser',
          'Verantwortlich für die Inhalte dieser Website.',
        ],
      },
      {
        title: 'Haftungshinweis',
        body: [
          'Die Inhalte dieser Website werden mit grösstmöglicher Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität wird jedoch keine Gewähr übernommen.',
          'Externe Links liegen in der Verantwortung der jeweiligen Anbieter.',
        ],
      },
    ],
  },
  datenschutz: {
    eyebrow: 'Datenschutz',
    title: 'Datenschutzerklärung',
    intro:
      'Diese Datenschutzerklärung beschreibt, wie ZhStudio personenbezogene Daten im Zusammenhang mit dieser Website verarbeitet. Sie basiert auf den aktuell genannten Diensten und dem geplanten Hosting über Cloudflare Pages mit GitHub.',
    sections: [
      {
        title: 'Allgemeines',
        body: [
          'Der Schutz persönlicher Daten ist ZhStudio wichtig.',
          'Personenbezogene Daten werden vertraulich und im Rahmen der anwendbaren Datenschutzgesetze behandelt.',
        ],
      },
      {
        title: 'Erhebung von Daten',
        body: [
          'Beim Besuch dieser Website können technisch notwendige Daten wie Browsertyp, Uhrzeit oder IP-Adresse vorübergehend verarbeitet werden.',
          'Wenn ihr uns per Kontaktformular, E-Mail oder Telefon kontaktiert, werden die von euch übermittelten Angaben zur Bearbeitung der Anfrage verwendet.',
        ],
      },
      {
        title: 'Hosting und technische Bereitstellung',
        body: [
          'Diese Website wird voraussichtlich über Cloudflare Pages bereitgestellt. Im Rahmen des Hostings können technisch notwendige Server- und Sicherheitsprotokolle verarbeitet werden.',
          'Für die Versionsverwaltung und Bereitstellung kann GitHub als technische Plattform im Hintergrund eingesetzt werden.',
        ],
      },
      {
        title: 'Kontaktformular und Kommunikation',
        body: [
          'Für Anfragen über die Website steht ein Kontaktformular zur Verfügung. Dabei können Name, E-Mail-Adresse, Firma, Website, Telefonnummer und die Nachricht übermittelt werden.',
          'Die Formularübermittlung erfolgt über den Dienst Formspree. Dabei werden die eingegebenen Daten an Formspree übermittelt und dort zur Zustellung und technischen Verarbeitung der Anfrage verarbeitet.',
          'Zusätzlich sind Kontaktaufnahmen per E-Mail an info@zhstudio.ch oder telefonisch möglich. Die übermittelten Angaben werden zur Bearbeitung der Anfrage und für mögliche Anschlusskommunikation verwendet.',
        ],
      },
      {
        title: 'Cookies, Analyse und Einbettungen',
        body: [
          'Nach aktuellem Stand werden keine Analyse- oder Tracking-Tools wie Google Analytics eingesetzt.',
          'Es werden keine zusätzlichen Cookies zu Marketing- oder Statistikzwecken, keine Karten, keine Newsletter-Dienste und keine eingebetteten Drittinhalte wie YouTube oder Instagram verwendet.',
        ],
      },
      {
        title: 'Schriftarten',
        body: [
          'Auf der Website können Web-Schriftarten eingesetzt werden. Falls diese direkt von externen Anbietern geladen werden, kann dabei technisch bedingt eine Verbindung zum jeweiligen Dienst entstehen.',
          'Falls die Schriftarten später lokal auf dem Hosting bereitgestellt werden, entfällt diese direkte Verbindung.',
        ],
      },
      {
        title: 'Rechte der betroffenen Personen',
        body: [
          'Betroffene Personen können Auskunft über gespeicherte Daten verlangen sowie Berichtigung oder Löschung im rechtlich zulässigen Rahmen beantragen.',
          'Anfragen können derzeit an info@zhstudio.ch gerichtet werden.',
        ],
      },
      {
        title: 'Räumlicher Geltungsbereich',
        body: [
          'Das Angebot richtet sich primär an Kundinnen und Kunden in der Schweiz und im EU-Raum.',
        ],
      },
    ],
  },
}

function Header({ legal = false, location, activeSection, onNavigate }) {
  const currentPath = location.pathname
  const homePrefix = currentPath === '/' ? '' : '/'
  const activeNav = currentPath === '/kontakt' ? '/kontakt' : activeSection

  const handleNavigate = (event, href) => {
    event.preventDefault()
    onNavigate(href)
  }

  const getNavClassName = (href, baseClassName = '') => {
    const classes = [baseClassName].filter(Boolean)

    if (activeNav === href || currentPath === href) {
      classes.push('nav-link-active')
    }

    return classes.join(' ')
  }

  return (
    <header className="topbar">
      <a
        className="brand"
        href="/"
        onClick={(event) => handleNavigate(event, '/')}
      >
        <img src="/logo-mark.png" alt="ZhStudio Logo" />
        <div>
          <strong>ZhStudio</strong>
          <span>Stäfa, Schweiz</span>
        </div>
      </a>

      <nav className="nav">
        {legal ? (
          <>
            <a
              className={getNavClassName('/')}
              href="/"
              onClick={(event) => handleNavigate(event, '/')}
            >
              Startseite
            </a>
            <a
              className={getNavClassName('/kontakt')}
              href="/kontakt"
              onClick={(event) => handleNavigate(event, '/kontakt')}
            >
              Kontakt
            </a>
            <a
              className={getNavClassName('/impressum')}
              href="/impressum"
              onClick={(event) => handleNavigate(event, '/impressum')}
            >
              Impressum
            </a>
            <a
              className={getNavClassName('/datenschutz')}
              href="/datenschutz"
              onClick={(event) => handleNavigate(event, '/datenschutz')}
            >
              Datenschutz
            </a>
          </>
        ) : (
          <>
            <a
              className={getNavClassName('#leistungen')}
              href={`${homePrefix}#leistungen`}
              onClick={(event) => handleNavigate(event, `${homePrefix}#leistungen`)}
            >
              Leistungen
            </a>
            <a
              className={getNavClassName('#arbeiten')}
              href={`${homePrefix}#arbeiten`}
              onClick={(event) => handleNavigate(event, `${homePrefix}#arbeiten`)}
            >
              Arbeiten
            </a>
            <a
              className={getNavClassName('/kontakt', 'nav-cta')}
              href="/kontakt"
              onClick={(event) => handleNavigate(event, '/kontakt')}
            >
              Kontakt
            </a>
          </>
        )}
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/logo-mark.png" alt="" aria-hidden="true" />
        <div>
          <strong>ZhStudio</strong>
          <span>Webdesign aus Stäfa im Kanton Zürich</span>
        </div>
      </div>
      <div className="footer-links">
        <a href="/kontakt">Kontakt</a>
        <a href="mailto:info@zhstudio.ch">E-Mail</a>
        <a href="/impressum">Impressum</a>
        <a href="/datenschutz">Datenschutz</a>
      </div>
      <p className="footer-note">
        Starke lokale Webauftritte für Unternehmen rund um Stäfa, die Goldküste und Zürich.
      </p>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">Webdesign aus Stäfa an der Goldküste</div>
            <h1>
              Schöne Websites, die <span>Vertrauen schaffen</span>.
            </h1>
            <p className="hero-text">
              ZhStudio gestaltet elegante, schnelle und moderne Webseiten für lokale Firmen,
              Restaurants und Vereine im Kanton Zürich. Klar, hochwertig und mit einem Auftritt,
              der zeigt, dass man euch ernst nehmen kann.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary button-offer"
                href="/kontakt"
              >
                Offerte anfragen
              </a>
              <a className="button button-secondary" href="/kontakt">
                Kontakt aufnehmen
              </a>
              <a className="button button-secondary" href="#arbeiten">
                Arbeiten ansehen
              </a>
            </div>
            <div className="hero-meta">
              <div>
                <strong>ab CHF 380</strong>
                <span>für einfache Webauftritte</span>
              </div>
              <div>
                <strong>lokal & schnell</strong>
                <span>für Unternehmen rund um Zürich</span>
              </div>
            </div>
          </div>

          <div className="hero-orb">
            <div className="glow-ring" />
            <div className="device-card device-main interactive-card">
              <div className="device-topline">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <div className="device-brand">
                <img src="/logo-alt.png" alt="" aria-hidden="true" />
                <span>ZhStudio</span>
              </div>
              <h2>Elegant. Lokal. Technisch sauber.</h2>
              <p>
                Für Firmen, Restaurants und Vereine, die online nicht durchschnittlich wirken
                wollen.
              </p>
              <div className="mini-metrics">
                <div>
                  <strong>01</strong>
                  <span>Design mit Wirkung</span>
                </div>
                <div>
                  <strong>02</strong>
                  <span>Vertrauen durch Klarheit</span>
                </div>
                <div>
                  <strong>03</strong>
                  <span>Sauber für späteres Wachstum</span>
                </div>
              </div>
            </div>
            <div className="floating-card floating-b interactive-card">
              <span>Typischer Start</span>
              <strong>Offerte in kurzer Zeit</strong>
            </div>
          </div>
        </section>

        <section className="trust-strip reveal">
          <p>Für lokale Firmen, Restaurants, Praxen, Studios und Vereine im Kanton Zürich.</p>
        </section>

        <section className="section spotlight-section reveal">
          <div className="spotlight-layout">
            <article className="spotlight-panel spotlight-large interactive-card parallax-card">
              <span className="eyebrow">Design-Richtung</span>
              <h2 className="editorial-title">
                Ruhige Präzision
                <span className="editorial-subline">mit einem Auftritt, der nicht austauschbar wirkt.</span>
              </h2>
              <p>
                Edles Webdesign mit lokaler Klarheit. Weniger Lärm, mehr Wirkung.
              </p>
            </article>

            <div className="spotlight-stack">
              <article className="spotlight-panel spotlight-small interactive-card parallax-card">
                <div className="spotlight-icon" aria-hidden="true">
                  ✦
                </div>
                <strong>Look & Feel</strong>
                <p>Warme Flächen, Glaslayer, präzise Typografie.</p>
              </article>
              <article className="spotlight-panel spotlight-small interactive-card parallax-card">
                <div className="spotlight-icon" aria-hidden="true">
                  ◎
                </div>
                <strong>Für wen</strong>
                <p>Für Firmen, die sofort besser wirken wollen.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section intro reveal">
          <div className="section-heading-row">
            <div className="section-heading section-heading-stacked">
              <span className="eyebrow">Warum ZhStudio</span>
              <h2>Eine Website darf ruhig wirken.</h2>
              <p className="section-lead">Aber sie muss im richtigen Moment überzeugen.</p>
            </div>
            <div className="heading-visual heading-visual-signals interactive-card parallax-card" aria-hidden="true">
              <div className="signal-orbit">
                <span />
                <span />
                <span />
              </div>
              <div className="signal-list">
                <span>klar</span>
                <span>schnell</span>
                <span>vertrauensvoll</span>
              </div>
            </div>
          </div>
          <div className="intro-grid">
            <article className="interactive-card">
              <strong>Lokale Nähe</strong>
              <p>Aus Stäfa, nah an lokalen Unternehmen und ihren Kunden.</p>
            </article>
            <article className="interactive-card">
              <strong>Apple-inspirierte Ruhe</strong>
              <p>Helles Layout, viel Ruhe, kontrollierte Bewegung.</p>
            </article>
            <article className="interactive-card">
              <strong>Faire Einstiegslösung</strong>
              <p>Ab CHF 380 für einen sauberen ersten Auftritt.</p>
            </article>
          </div>
        </section>

        <section className="section reveal" id="leistungen">
          <div className="section-heading section-heading-compact">
            <span className="eyebrow">Leistungen</span>
            <h2>Design, Technik und ein sauberer Start.</h2>
          </div>
          <div className="service-layout">
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card interactive-card parallax-card" key={service.title}>
                  <div className="service-card-head">
                    <span className="service-icon">
                      <ServiceIcon type={service.icon} />
                    </span>
                    <span className="service-meta">{service.meta}</span>
                  </div>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <aside className="service-side interactive-card parallax-card">
              <div className="service-side-kicker">
                <span className="eyebrow">Was man spürt</span>
                <span className="service-side-mark" aria-hidden="true">01</span>
              </div>
              <h3>Ordnung, Tempo und ein Auftritt mit Gewicht.</h3>
              <p>Eine gute Website ordnet, beruhigt und macht Vertrauen sofort leichter.</p>
              <div className="service-proof">
                <span>Ruhiger erster Eindruck</span>
                <span>Schneller Weg zur Anfrage</span>
                <span>Klare Basis für Wachstum</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="section reveal" id="arbeiten">
          <div className="section-heading-row section-heading-row-projects">
            <div className="section-heading section-heading-quote">
              <span className="eyebrow">Typische Projekte aus der Region</span>
              <h2>Websites für Betriebe, die online so gut aussehen sollen wie ihre Arbeit vor Ort.</h2>
            </div>
            <div className="heading-visual heading-visual-projects interactive-card parallax-card" aria-hidden="true">
              <div className="project-preview project-preview-main">
                <span>Stäfa</span>
                <strong>Local Site</strong>
              </div>
              <div className="project-preview project-preview-soft">
                <span>SEO</span>
                <strong>Google-ready</strong>
              </div>
              <div className="project-lines">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
          <div className="showcase-grid showcase-grid-alt">
            {showcases.map((item, index) => (
              <article
                className={`showcase-card interactive-card parallax-card showcase-card-${index + 1}`}
                key={item.name}
              >
                <div className="showcase-topline">
                  <span>{item.location}</span>
                  <strong>{item.type}</strong>
                </div>
                <h3>{item.name}</h3>
                <p>{item.detail}</p>
                <div className="tag-row">
                  {item.tags.map((tag) => (
                    <em key={tag}>{tag}</em>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section process reveal">
          <div className="process-layout">
            <div className="section-heading section-heading-aside">
              <span className="eyebrow">Ablauf</span>
              <h2>Kein Agenturtheater.</h2>
              <p className="section-lead">Vier klare Schritte. Dann ist die Seite live.</p>
            </div>
            <div className="steps">
              {steps.map((step, index) => (
                <div className="step interactive-card parallax-card" key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section price-section reveal" id="offerte">
          <div className="price-card interactive-card">
            <div>
              <span className="eyebrow">Offerte</span>
              <h2>Ein sauberer Einstieg ab CHF 380</h2>
              <p>
                Für kleine Webauftritte, Landingpages oder lokale Erstpräsenz. Grössere Projekte,
                Zusatzseiten oder Branding werden individuell offeriert.
              </p>
            </div>
            <a
              className="button button-primary button-offer button-large"
              href="/kontakt"
            >
              Offerte anfragen
            </a>
          </div>
        </section>

        <section className="section contact-section reveal" id="kontakt">
          <div className="section-heading section-heading-contact">
            <span className="eyebrow">Kontakt</span>
            <h2>Wenn der Auftritt besser werden soll, startet es mit einer kurzen Anfrage.</h2>
          </div>
          <div className="contact-layout">
            <div className="contact-panel interactive-card">
              <div>
                <p>
                  Für lokale Unternehmen im Kanton Zürich, die online ruhiger, klarer und stärker
                  auftreten wollen.
                </p>
                <a href="/kontakt">Zum Kontaktformular</a>
              </div>
              <div className="contact-badge interactive-card">
                <strong>Standort</strong>
                <span>Weberstrasse 4, Stäfa, 8712, Schweiz</span>
                <small>Lokaler Fokus auf den Kanton Zürich und umliegende Gemeinden.</small>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

function ContactPage() {
  return (
    <>
      <main className="contact-page-main">
        <section className="contact-focus reveal" id="kontaktformular">
          <div className="contact-focus-intro">
            <span className="eyebrow">Kontakt</span>
            <h1>Die Kontaktseite ist für eine Sache da: eure Anfrage sauber zu erfassen.</h1>
            <p className="contact-focus-text">
              Kein zusätzlicher Lärm, keine unnötigen Blöcke. Einfach das Formular mit allem, was
              für eine erste Offerte oder ein Webprojekt gebraucht wird.
            </p>
          </div>

          <div className="contact-form-shell reveal">
            <div className="contact-form-head">
              <div>
                <span className="eyebrow">Anfrage senden</span>
                <h2>Ein klarer Einstieg für Websites, Redesigns und lokale Auftritte im Kanton Zürich.</h2>
              </div>
              <div className="contact-mini-meta">
                <span>info@zhstudio.ch</span>
                <span>Stäfa, Zürich</span>
              </div>
            </div>

            <form className="contact-form contact-form-focused" action={formEndpoint} method="POST">
              <div className="form-grid">
                <label className="form-field">
                  <span>Name</span>
                  <input type="text" name="name" placeholder="Bastian Beispiel" required />
                </label>

                <label className="form-field">
                  <span>E-Mail</span>
                  <input type="email" name="email" placeholder="bastian@beispiel.com" required />
                </label>

                <label className="form-field">
                  <span>Firma</span>
                  <input type="text" name="company" placeholder="Bastians Bäckerei" required />
                </label>

                <label className="form-field">
                  <span>Website (falls vorhanden)</span>
                  <input type="url" name="website" placeholder="https://www.bäckerbastian.ch" />
                </label>

                <label className="form-field">
                  <span>Telefon (optional)</span>
                  <input type="tel" name="phone" placeholder="+41 79 123 45 67" />
                </label>

                <label className="form-field form-field-full">
                  <span>Nachricht</span>
                  <textarea
                    name="message"
                    placeholder="Erzählt kurz, worum es geht und was ihr euch für eure Website wünscht."
                    required
                  />
                </label>
              </div>

              <div className="form-actions">
                <button className="button button-primary" type="submit">
                  Nachricht senden
                </button>
                <p className="form-note">
                  Mit dem Absenden akzeptiert ihr die Verarbeitung gemäss{' '}
                  <a href="/datenschutz">Datenschutzerklärung</a>.
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

function LegalPage({ pageKey }) {
  const page = legalContent[pageKey]

  return (
    <>
      <main className="legal-main">
        <section className="legal-hero reveal">
          <div className="section-heading">
            <span className="eyebrow">{page.eyebrow}</span>
            <h1 className="legal-title">{page.title}</h1>
            <p className="hero-text legal-intro">{page.intro}</p>
          </div>
        </section>

        <section className="legal-grid reveal">
          {page.sections.map((section) => (
            <article className="legal-card" key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </>
  )
}

export default function App() {
  const appRef = useRef(null)
  const [location, setLocation] = useState(getLocationState)
  const [activeSection, setActiveSection] = useState('')
  const path = location.pathname
  const isLegalPage = path === '/impressum' || path === '/datenschutz'
  const isContactPage = path === '/kontakt'

  useEffect(() => {
    const handleLocationChange = () => {
      setLocation(getLocationState())
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  useEffect(() => {
    if (path !== '/') {
      setActiveSection('')
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    const scrollToTarget = () => {
      const element = document.querySelector(location.hash)

      if (!element) {
        return
      }

      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    requestAnimationFrame(scrollToTarget)
  }, [path, location.hash])

  useEffect(() => {
    if (path !== '/') {
      return undefined
    }

    const sections = ['#leistungen', '#arbeiten']
      .map((hash) => {
        const element = document.querySelector(hash)

        if (!element) {
          return null
        }

        return { hash, element }
      })
      .filter(Boolean)

    if (!sections.length) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries.length) {
          setActiveSection(`#${visibleEntries[0].target.id}`)
          return
        }

        if (window.scrollY < 240) {
          setActiveSection('')
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    )

    sections.forEach(({ element }) => observer.observe(element))

    return () => observer.disconnect()
  }, [path])

  useEffect(() => {
    if (path === '/' && location.hash) {
      setActiveSection(location.hash)
    }
  }, [path, location.hash])

  const handleNavigate = (href) => {
    navigateTo(href, setLocation)
  }

  useEffect(() => {
    const cleanupFns = []

    const ctx = gsap.context(() => {
      if (document.querySelector('.hero-copy')) {
        gsap.from('.hero-copy > *', {
          y: 48,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
        })
      }

      if (document.querySelector('.hero-orb')) {
        gsap.from('.hero-orb', {
          scale: 0.75,
          opacity: 0,
          duration: 1.4,
          ease: 'power3.out',
          delay: 0.15,
        })
      }

      gsap.utils.toArray('.reveal').forEach((item) => {
        gsap.from(item, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
          },
        })
      })

      gsap.utils.toArray('.parallax-card').forEach((item, index) => {
        gsap.fromTo(
          item,
          { y: 0 },
          {
            y: -22,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      gsap.utils.toArray('.background-bubble').forEach((bubble, index) => {
        gsap.to(bubble, {
          '--idle-x': `${index % 2 === 0 ? 42 : -38}px`,
          '--idle-y': `${index % 3 === 0 ? -30 : 24}px`,
          '--bubble-scale': index % 2 === 0 ? 1.08 : 0.94,
          duration: 10 + index * 2.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })

        gsap.to(bubble, {
          '--scroll-y': `${index % 2 === 0 ? -150 - index * 18 : -90 + index * 14}px`,
          '--scroll-x': `${index % 2 === 0 ? 44 + index * 12 : -52 - index * 8}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.1 + index * 0.2,
          },
        })
      })

      gsap.to('.background-motion', {
        backgroundPosition: '50% 0%, 42% 100%',
        duration: 24,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to('.glow-ring', {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: 'none',
      })

      const interactiveCards = gsap.utils.toArray('.interactive-card')

      interactiveCards.forEach((card) => {
        const handleMove = (event) => {
          const rect = card.getBoundingClientRect()
          const offsetX = event.clientX - rect.left
          const offsetY = event.clientY - rect.top
          const rotateY = gsap.utils.mapRange(0, rect.width, -6, 6, offsetX)
          const rotateX = gsap.utils.mapRange(0, rect.height, 6, -6, offsetY)

          card.style.setProperty('--mx', `${offsetX}px`)
          card.style.setProperty('--my', `${offsetY}px`)

          gsap.to(card, {
            rotateX,
            rotateY,
            duration: 0.45,
            ease: 'power2.out',
            transformPerspective: 1000,
          })
        }

        const handleLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.55,
            ease: 'power3.out',
          })
        }

        card.addEventListener('pointermove', handleMove)
        card.addEventListener('pointerleave', handleLeave)

        cleanupFns.push(() => {
          card.removeEventListener('pointermove', handleMove)
          card.removeEventListener('pointerleave', handleLeave)
        })
      })
    }, appRef)

    return () => {
      cleanupFns.forEach((cleanup) => cleanup())
      ctx.revert()
    }
  }, [isLegalPage, isContactPage])

  return (
      <div className={`site-shell${isLegalPage ? ' legal-shell' : ''}`} ref={appRef}>
      <div className="background-motion" />
      <div className="background-grid" />
      <div className="background-bubbles" aria-hidden="true">
        <span className="background-bubble bubble-a" />
        <span className="background-bubble bubble-b" />
        <span className="background-bubble bubble-c" />
        <span className="background-bubble bubble-d" />
        <span className="background-bubble bubble-e" />
      </div>

      <Header
        legal={isLegalPage}
        location={location}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />
      {path === '/impressum' ? <LegalPage pageKey="impressum" /> : null}
      {path === '/datenschutz' ? <LegalPage pageKey="datenschutz" /> : null}
      {path === '/kontakt' ? <ContactPage /> : null}
      {path !== '/impressum' && path !== '/datenschutz' && path !== '/kontakt' ? <HomePage /> : null}
    </div>
  )
}
