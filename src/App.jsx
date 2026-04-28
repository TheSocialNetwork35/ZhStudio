import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const offerMailto =
  'mailto:info@zhstudio.ch?subject=Offerte%20f%C3%BCr%20eine%20Website'

function triggerOfferMail(event) {
  event.preventDefault()
  window.location.href = offerMailto
}

const services = [
  {
    title: 'Webdesign',
    text: 'Klare Seiten, starke Typografie, ruhiger Auftritt.',
  },
  {
    title: 'SEO-Basis',
    text: 'Saubere Struktur, schnell geladen, lokal auffindbar.',
  },
  {
    title: 'Branding Light',
    text: 'Farben, Ton und Details, die zusammenpassen.',
  },
]

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
          'Kontaktanfragen erfolgen derzeit per E-Mail oder Telefon.',
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
          'Wenn ihr uns per E-Mail kontaktiert, werden die von euch übermittelten Angaben zur Bearbeitung der Anfrage verwendet.',
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
        title: 'Kommunikation',
        body: [
          'Aktuell wird kein Kontaktformular eingesetzt. Kontaktaufnahmen erfolgen ausschliesslich per E-Mail an info@zhstudio.ch oder telefonisch.',
          'Dabei werden die übermittelten Angaben zur Bearbeitung der Anfrage und für mögliche Anschlusskommunikation verwendet.',
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

function Header({ legal = false }) {
  return (
    <header className="topbar">
      <a className="brand" href="/">
        <img src="/logo-mark.png" alt="ZhStudio Logo" />
        <div>
          <strong>ZhStudio</strong>
          <span>Stäfa, Schweiz</span>
        </div>
      </a>

      <nav className="nav">
        {legal ? (
          <>
            <a href="/">Startseite</a>
            <a href="/impressum">Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
          </>
        ) : (
          <>
            <a href="#leistungen">Leistungen</a>
            <a href="#arbeiten">Arbeiten</a>
            <a href="#kontakt">Kontakt</a>
            <a className="nav-cta" href={offerMailto} onClick={triggerOfferMail}>
              Offerte anfragen
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
                href={offerMailto}
                onClick={triggerOfferMail}
              >
                Offerte anfragen
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
          <div className="section-heading section-heading-stacked">
            <span className="eyebrow">Warum ZhStudio</span>
            <h2>Eine Website darf ruhig wirken.</h2>
            <p className="section-lead">Aber sie muss im richtigen Moment überzeugen.</p>
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
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
            <aside className="service-side interactive-card parallax-card">
              <span className="eyebrow">Was man spürt</span>
              <h3>Ordnung, Tempo und ein Auftritt mit Gewicht.</h3>
              <p>Eine gute Website ordnet, beruhigt und macht Vertrauen sofort leichter.</p>
            </aside>
          </div>
        </section>

        <section className="section reveal" id="arbeiten">
          <div className="section-heading section-heading-quote">
            <span className="eyebrow">Typische Projekte aus der Region</span>
            <h2>Websites für Betriebe, die online so gut aussehen sollen wie ihre Arbeit vor Ort.</h2>
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
              href={offerMailto}
              onClick={triggerOfferMail}
            >
              Offerte anfragen
            </a>
          </div>
        </section>

        <section className="section contact-section reveal" id="kontakt">
          <div className="section-heading section-heading-contact">
            <span className="eyebrow">Kontakt</span>
            <h2>Wenn der Auftritt besser werden soll, reicht eine kurze Nachricht.</h2>
          </div>
          <div className="contact-panel interactive-card">
            <div>
              <p>
                Für lokale Unternehmen im Kanton Zürich, die online ruhiger, klarer und stärker
                auftreten wollen.
              </p>
              <a href="mailto:info@zhstudio.ch">info@zhstudio.ch</a>
            </div>
            <div className="contact-badge interactive-card">
              <strong>Standort</strong>
              <span>Weberstrasse 4, Stäfa, 8712, Schweiz</span>
              <small>Lokaler Fokus auf den Kanton Zürich und umliegende Gemeinden.</small>
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
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  const isLegalPage = path === '/impressum' || path === '/datenschutz'

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

      gsap.utils.toArray(['.ambient-a', '.ambient-b', '.ambient-c', '.ambient-d']).forEach(
        (selector, index) => {
          gsap.to(selector, {
            x: index % 2 === 0 ? 42 : -34,
            y: index % 2 === 0 ? -28 : 36,
            scale: index % 2 === 0 ? 1.08 : 0.92,
            duration: 9 + index * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        },
      )

      gsap.to('.background-motion', {
        backgroundPosition: '120% 20%, 0% 100%, 85% 0%, 10% 90%, 50% 50%',
        duration: 28,
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
  }, [isLegalPage])

  return (
    <div className={`site-shell${isLegalPage ? ' legal-shell' : ''}`} ref={appRef}>
      <div className="background-motion" />
      <div className="background-grid" />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />
      <div className="ambient ambient-d" />

      <Header legal={isLegalPage} />
      {path === '/impressum' ? <LegalPage pageKey="impressum" /> : null}
      {path === '/datenschutz' ? <LegalPage pageKey="datenschutz" /> : null}
      {path !== '/impressum' && path !== '/datenschutz' ? <HomePage /> : null}
    </div>
  )
}
