import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const offerMailto =
  'mailto:info@zhstudio.ch?subject=Offerte%20f%C3%BCr%20Instagram%20und%20TikTok%20Marketing'
const formEndpoint = 'https://formspree.io/f/xvzdeqvn'
const formRedirectPath = '/danke'

function getFormRedirectUrl() {
  if (typeof window === 'undefined') {
    return formRedirectPath
  }

  return `${window.location.origin}${formRedirectPath}`
}

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
    title: 'Content-Strategie',
    text: 'Klare Themen, starke Formate, ein Auftritt mit Wiedererkennung.',
    icon: 'layout',
    meta: 'Plan & Position',
    points: ['Zielgruppe und Tonalität', 'Content-Säulen und Formate', 'Redaktionsplan für Posts und Reels'],
  },
  {
    title: 'Reels & TikToks',
    text: 'Kurzvideos, die zur Marke passen und nicht nach generischem Trend aussehen.',
    icon: 'search',
    meta: 'Video & Schnitt',
    points: ['Ideen und Hooks', 'Drehplan und Skripte', 'Schnitt, Captions und Posting'],
  },
  {
    title: 'Social Branding',
    text: 'Profil, Bildsprache und Kampagnen, die zusammen eine klare Haltung zeigen.',
    icon: 'spark',
    meta: 'Look & Wirkung',
    points: ['Profil-Optimierung', 'Vorlagen für Stories und Posts', 'Kampagnenideen für Instagram und TikTok'],
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
  'Formate festlegen',
  'Content produzieren',
  'Posten & lernen',
]

const studioSignals = [
  'Strategie',
  'Instagram',
  'Kampagne',
  'Content',
  'TikTok',
  'Branding',
]

const showcases = [
  {
    name: 'Seegarten Bistro',
    location: 'Meilen',
    type: 'Restaurant & Reels',
    detail:
      'Reels für Mittagsmenüs, Team, Terrasse und Wochenaktionen. Nahbar, appetitlich und direkt auf Reservierungen ausgerichtet.',
    tags: ['Reels', 'Story-Serie', 'Mehr Reservierungen'],
    image: '/showcase-seegarten.jpeg',
    imageAlt: 'Terrasse am See mit Tischen, Sonnenschirmen und Bootssteg',
  },
  {
    name: 'Baur Sanitär',
    location: 'Stäfa',
    type: 'Handwerk & Vertrauen',
    detail:
      'Kurzvideos aus echten Einsätzen, Vorher-nachher-Momente und einfache Erklärformate für lokale Sichtbarkeit.',
    tags: ['TikTok-Ideen', 'Reels', 'Lokale Präsenz'],
    image: '/showcase-sanitaer.jpeg',
    imageAlt: 'Sanitärinstallation mit Rohren, Boiler und Werkzeug',
  },
  {
    name: 'Praxis am See',
    location: 'Männedorf',
    type: 'Praxis & Aufklärung',
    detail:
      'Ruhige Content-Serie mit Vertrauen, Alltagseinblicken und verständlichen Antworten auf häufige Fragen.',
    tags: ['Seriös', 'Content-Serie', 'Professionell'],
    image: '/showcase-praxis.jpeg',
    imageAlt: 'Moderner Empfangsbereich einer Praxis',
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
          'Für Anfragen über die Website steht ein Kontaktformular zur Verfügung. Dabei können Name, E-Mail-Adresse, Firma, Social-Media-Profil, Telefonnummer und die Nachricht übermittelt werden.',
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

function Header({ hidden = false, location, onNavigate }) {
  const currentPath = location.pathname

  const handleNavigate = (event, href) => {
    event.preventDefault()
    onNavigate(href)
  }

  const getNavClassName = (href, baseClassName = '') => {
    const classes = [baseClassName].filter(Boolean)

    if (currentPath === href) {
      classes.push('nav-link-active')
    }

    return classes.join(' ')
  }

  return (
    <header className={`topbar${hidden ? ' topbar-hidden' : ''}`}>
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
        <a
          className={getNavClassName('/')}
          href="/"
          onClick={(event) => handleNavigate(event, '/')}
          aria-current={currentPath === '/' ? 'page' : undefined}
        >
          Start
        </a>
        <a
          className={getNavClassName('/leistungen')}
          href="/leistungen"
          onClick={(event) => handleNavigate(event, '/leistungen')}
          aria-current={currentPath === '/leistungen' ? 'page' : undefined}
        >
          Leistungen
        </a>
        <a
          className={getNavClassName('/kontakt')}
          href="/kontakt"
          onClick={(event) => handleNavigate(event, '/kontakt')}
          aria-current={currentPath === '/kontakt' ? 'page' : undefined}
        >
          Kontakt
        </a>
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
          <span>Social Media Marketing aus Stäfa im Kanton Zürich</span>
        </div>
      </div>
      <div className="footer-links">
        <a href="/leistungen">Leistungen</a>
        <a href="/kontakt">Kontakt</a>
        <a href="mailto:info@zhstudio.ch">E-Mail</a>
        <a href="/impressum">Impressum</a>
        <a href="/datenschutz">Datenschutz</a>
      </div>
      <p className="footer-note">
        Instagram- und TikTok-Marketing für Unternehmen rund um Stäfa, die Goldküste und Zürich.
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
            <div className="eyebrow">Instagram & TikTok Marketing aus Stäfa</div>
            <h1>
              Content, der <span>im Kopf bleibt</span>.
            </h1>
            <p className="hero-text">
              ZhStudio plant und produziert Social-Media-Marketing für lokale Firmen,
              Restaurants, Praxen und Vereine im Kanton Zürich. Mit Reels, TikToks und Kampagnen,
              die nicht nur posten, sondern Aufmerksamkeit in echte Anfragen verwandeln.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary button-offer"
                href="/kontakt"
              >
                Offerte anfragen
              </a>
              <a className="button button-secondary" href="/leistungen">
                Leistungen ansehen
              </a>
            </div>
            <div className="hero-meta">
              <div>
                <strong>ab CHF 380</strong>
                <span>für Social-Media-Starts</span>
              </div>
              <div>
                <strong>lokal & schnell</strong>
                <span>für Marken rund um Zürich</span>
              </div>
            </div>
          </div>

          <div className="hero-orb">
            <div className="glow-ring" />
            <div className="device-card device-main kinetic-board interactive-card">
              <span className="kinetic-label">Studio für Wirkung</span>
              <div className="kinetic-word kinetic-word-a">Marke</div>
              <div className="kinetic-word kinetic-word-b">Reels</div>
              <div className="kinetic-word kinetic-word-c">Content</div>
              <div className="kinetic-word kinetic-word-d">TikTok</div>
              <div className="kinetic-line" />
              <p>
                Für Unternehmen, die nicht nur posten wollen, sondern wiedererkannt werden.
              </p>
            </div>
            <div className="floating-card floating-b interactive-card">
              <span>Typischer Start</span>
              <strong>Offerte in kurzer Zeit</strong>
            </div>
          </div>
        </section>

        <section className="trust-strip reveal">
          <p>Für lokale Firmen, Restaurants, Praxen, Studios und Vereine, die auf Instagram und TikTok sichtbar werden wollen.</p>
        </section>

        <section className="studio-marquee reveal" aria-label="Studio-Schwerpunkte">
          <div className="marquee-track">
            {[...studioSignals, ...studioSignals].map((signal, index) => (
              <span key={`${signal}-${index}`}>{signal}</span>
            ))}
          </div>
        </section>

        <section className="section spotlight-section reveal">
          <div className="spotlight-layout">
            <article className="spotlight-panel spotlight-large interactive-card parallax-card">
              <span className="eyebrow">Design-Richtung</span>
              <h2 className="editorial-title">
                Ruhige Präzision
                <span className="editorial-subline">mit Content, der nicht austauschbar wirkt.</span>
              </h2>
              <p>
                Social Content mit klarer Haltung. Weniger Zufall, mehr Wiedererkennung.
              </p>
            </article>

            <div className="spotlight-stack">
              <article className="spotlight-panel spotlight-small interactive-card parallax-card">
                <div className="spotlight-icon" aria-hidden="true">
                  ✦
                </div>
                <strong>Look & Feel</strong>
                <p>Markante Typografie, klare Schnitte, visuelle Haltung.</p>
              </article>
              <article className="spotlight-panel spotlight-small interactive-card parallax-card">
                <div className="spotlight-icon" aria-hidden="true">
                  ◎
                </div>
                <strong>Für wen</strong>
                <p>Für Firmen, die nicht austauschbar auftreten wollen.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section intro reveal">
          <div className="section-heading-row">
            <div className="section-heading section-heading-stacked">
              <span className="eyebrow">Warum ZhStudio</span>
              <h2>Social Media braucht mehr als Aktivität.</h2>
              <p className="section-lead">Es braucht einen Grund, warum Menschen euch folgen, speichern und anfragen.</p>
            </div>
          </div>
          <div className="intro-grid">
            <article className="interactive-card">
              <strong>Lokale Nähe</strong>
              <p>Aus Stäfa, nah an lokalen Unternehmen, ihrem Alltag und ihrer Zielgruppe.</p>
            </article>
            <article className="interactive-card">
              <strong>Reduzierte Gestaltung</strong>
              <p>Klare Formate, wiedererkennbare Serien und bewusst eingesetzte Bewegung.</p>
            </article>
            <article className="interactive-card">
              <strong>Faire Einstiegslösung</strong>
              <p>Ab CHF 380 für einen klaren Start auf Instagram und TikTok.</p>
            </article>
          </div>
        </section>

        <section className="section home-contact-goal reveal">
          <div className="price-card interactive-card">
            <div>
              <span className="eyebrow">Nächster Schritt</span>
              <h2>Der erste Post ist nur der Einstieg. Das Ziel ist echte Nachfrage.</h2>
              <p>
                Wer Details sehen möchte, findet sie auf der Leistungsseite. Wer schon weiss, dass
                Instagram oder TikTok endlich professioneller laufen soll, kommt direkt zum Kontaktformular.
              </p>
            </div>
            <a className="button button-primary button-offer button-large" href="/kontakt">
              Anfragen
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

function ServicesPage() {
  return (
    <>
      <main id="leistungen" className="services-page-main">
        <section className="services-hero reveal">
          <div className="section-heading section-heading-compact services-heading">
            <span className="eyebrow">Leistungen</span>
            <h2>Strategie, Content und sichtbare Kampagnen.</h2>
            <p className="section-lead">
              Hier steht, wie ZhStudio Instagram und TikTok für lokale Marken aufbaut: von Idee
              und Drehplan bis zu Reels, TikToks, Captions und laufender Content-Struktur.
            </p>
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
                  <ul className="service-points">
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <aside className="service-side interactive-card parallax-card">
              <div className="service-side-kicker">
                <span className="eyebrow">Was man merkt</span>
                <span className="service-side-mark" aria-hidden="true">01</span>
              </div>
              <h3>Ein Profil, das wirkt, bevor jemand lange nachdenkt.</h3>
              <p>Guter Social Content macht sofort klar, wer ihr seid, warum ihr relevant seid und was als Nächstes passieren soll.</p>
              <div className="service-proof">
                <span>Mehr Wiedererkennung im Feed</span>
                <span>Bessere Ideen für Reels und TikToks</span>
                <span>Klare Basis für laufende Kampagnen</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="section reveal" id="projekte">
          <div className="section-heading-row section-heading-row-projects">
            <div className="section-heading section-heading-quote">
              <span className="eyebrow">Typische Social-Projekte aus der Region</span>
              <h2>Content für Betriebe, die im Feed so gut wirken sollen wie vor Ort.</h2>
            </div>
            <div className="heading-visual heading-visual-projects interactive-card parallax-card" aria-hidden="true">
              <div className="project-preview project-preview-main">
                <span>Stäfa</span>
                <strong>Local Content</strong>
              </div>
              <div className="project-preview project-preview-soft">
                <span>Social</span>
                <strong>Reels-ready</strong>
              </div>
            </div>
          </div>
          <div className="showcase-grid showcase-grid-alt">
            {showcases.map((item, index) => (
              <article
                className={`showcase-card interactive-card parallax-card showcase-card-${index + 1}`}
                key={item.name}
              >
                <figure className="showcase-image">
                  <img src={item.image} alt={item.imageAlt} loading="lazy" />
                </figure>
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
              <h2>Kein Content-Chaos.</h2>
              <p className="section-lead">Vier klare Schritte. Dann läuft euer Social-Media-System.</p>
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
              <h2>Ein klarer Social-Media-Start ab CHF 380</h2>
              <p>
                Für Profil-Optimierung, erste Content-Ideen, Reels oder TikTok-Kampagnen. Laufende
                Betreuung, Drehtage und grössere Kampagnen werden individuell offeriert.
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

        <section className="section contact-section reveal">
          <div className="section-heading section-heading-contact">
            <span className="eyebrow">Kontakt</span>
            <h2>Wenn Instagram oder TikTok mehr bringen soll, startet es mit einer kurzen Anfrage.</h2>
          </div>
          <div className="contact-layout">
            <div className="contact-panel interactive-card">
              <div>
                <p>
                  Für lokale Unternehmen im Kanton Zürich, die auf Social Media sichtbarer,
                  relevanter und professioneller auftreten wollen.
                </p>
                <a href="/kontakt">Zum Kontaktformular</a>
              </div>
              <div className="contact-badge interactive-card">
                <strong>Standort</strong>
                <span>Weberstrasse 4, Stäfa, 8712, Schweiz</span>
                <small>Lokaler Fokus auf Content, Kampagnen und Social Media für Zürich und umliegende Gemeinden.</small>
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
            <h1>Erzählt kurz, was Instagram oder TikTok für euch leisten soll.</h1>
            <p className="contact-focus-text">
              Kein langer Fragebogen. Ein paar Angaben reichen, damit wir einschätzen können,
              welche Content-Formate, Plattformen und Kampagnen zu euch passen.
            </p>
          </div>

          <div className="contact-form-shell reveal">
            <div className="contact-form-head">
              <div>
                <span className="eyebrow">Anfrage senden</span>
                <h2>Ein klarer Einstieg für Instagram, TikTok und lokale Social-Kampagnen.</h2>
              </div>
              <div className="contact-mini-meta">
                <span>info@zhstudio.ch</span>
                <span>Stäfa, Zürich</span>
              </div>
            </div>

            <form className="contact-form contact-form-focused" action={formEndpoint} method="POST">
              <input type="hidden" name="_next" value={getFormRedirectUrl()} />
              <input type="hidden" name="_subject" value="Neue Social-Media-Anfrage über zhstudio.ch" />
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
                  <span>Instagram oder TikTok (falls vorhanden)</span>
                  <input type="text" name="social_channel" placeholder="@bastiansbaeckerei" />
                </label>

                <label className="form-field">
                  <span>Telefon (optional)</span>
                  <input type="tel" name="phone" placeholder="+41 79 123 45 67" />
                </label>

                <label className="form-field form-field-full">
                  <span>Nachricht</span>
                  <textarea
                    name="message"
                    placeholder="Erzählt kurz, worum es geht, welche Plattform wichtig ist und welche Art Content ihr euch wünscht."
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

function ThankYouPage() {
  return (
    <>
      <main className="thank-you-main">
        <section className="thank-you-focus reveal">
          <div className="thank-you-card interactive-card">
            <span className="eyebrow">Anfrage erhalten</span>
            <h1>Danke. Eure Nachricht ist angekommen.</h1>
            <p>
              Wir prüfen die Angaben und melden uns so bald wie möglich persönlich zurück. Falls
              ihr bereits Profile, Videos oder Kampagnenideen habt, könnt ihr sie direkt per E-Mail nachreichen.
            </p>

            <div className="thank-you-actions">
              <a className="button button-primary" href="/">
                Zur Startseite
              </a>
              <a className="button button-secondary" href="mailto:info@zhstudio.ch">
                info@zhstudio.ch
              </a>
            </div>
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
  const [isTopbarHidden, setIsTopbarHidden] = useState(false)
  const path = location.pathname
  const isLegalPage = path === '/impressum' || path === '/datenschutz'
  const isServicesPage = path === '/leistungen'
  const isContactPage = path === '/kontakt'
  const isThankYouPage = path === formRedirectPath

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

  const handleNavigate = (href) => {
    navigateTo(href, setLocation)
  }

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateTopbarVisibility = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      if (currentScrollY <= 32) {
        setIsTopbarHidden(false)
      } else if (delta > 8) {
        setIsTopbarHidden(true)
      } else if (delta < -8) {
        setIsTopbarHidden(false)
      }

      lastScrollY = currentScrollY
    }

    updateTopbarVisibility()

    window.addEventListener('scroll', updateTopbarVisibility, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateTopbarVisibility)
    }
  }, [])

  useEffect(() => {
    setIsTopbarHidden(false)
  }, [path])

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

      if (document.querySelector('.glow-ring')) {
        gsap.to('.glow-ring', {
          rotate: 360,
          duration: 18,
          repeat: -1,
          ease: 'none',
        })
      }

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
  }, [isLegalPage, isServicesPage, isContactPage, isThankYouPage])

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
        hidden={isTopbarHidden}
        location={location}
        onNavigate={handleNavigate}
      />
      {path === '/impressum' ? <LegalPage pageKey="impressum" /> : null}
      {path === '/datenschutz' ? <LegalPage pageKey="datenschutz" /> : null}
      {path === '/leistungen' ? <ServicesPage /> : null}
      {path === '/kontakt' ? <ContactPage /> : null}
      {path === formRedirectPath ? <ThankYouPage /> : null}
      {path !== '/impressum' &&
      path !== '/datenschutz' &&
      path !== '/leistungen' &&
      path !== '/kontakt' &&
      path !== formRedirectPath ? (
        <HomePage />
      ) : null}
    </div>
  )
}
