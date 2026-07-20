import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DotField from './components/DotField'
import LogoLoop from './components/LogoLoop'
import SideRays from './components/SideRays'
import SpecularButton from './components/SpecularButton'

gsap.registerPlugin(ScrollTrigger)

const formEndpoint = 'https://formspree.io/f/xvzdeqvn'
const formRedirectPath = '/danke'
const websiteBasePath = '/website'
const marketingBasePath = '/marketing'
const canonicalOrigin = 'https://www.zhstudio.ch'

function normalizeRoutePathname(pathname = '/') {
  const normalizedPathname = pathname || '/'
  const lowerPathname = normalizedPathname.toLowerCase()

  if (lowerPathname === websiteBasePath || lowerPathname.startsWith(`${websiteBasePath}/`)) {
    return `${websiteBasePath}${normalizedPathname.slice(websiteBasePath.length)}`
  }

  if (lowerPathname === marketingBasePath || lowerPathname.startsWith(`${marketingBasePath}/`)) {
    return `${marketingBasePath}${normalizedPathname.slice(marketingBasePath.length)}`
  }

  return normalizedPathname
}

function triggerOfferMail(event, mailto) {
  event.preventDefault()
  window.location.href = mailto
}

function getLocationState() {
  if (typeof window === 'undefined') {
    return { pathname: '/', hash: '' }
  }

  return {
    pathname: normalizeRoutePathname(window.location.pathname),
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
    pathname: normalizeRoutePathname(url.pathname),
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

function stripBasePath(pathname, basePath) {
  if (pathname === basePath) {
    return '/'
  }

  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || '/'
  }

  return pathname
}

function withBasePath(basePath, path) {
  if (!basePath) {
    return path
  }

  return path === '/' ? basePath : `${basePath}${path}`
}

const ctaPalettes = {
  selector: {
    primary: { tint: '#3157ff', textColor: '#ffffff', baseColor: '#102063' },
    secondary: { tint: '#edf2ec', textColor: '#111614', baseColor: '#738079' },
  },
  web: {
    primary: { tint: '#2457ff', textColor: '#ffffff', baseColor: '#101928' },
    secondary: { tint: '#f7fbff', textColor: '#101928', baseColor: '#2457ff' },
  },
  marketing: {
    primary: { tint: '#111412', textColor: '#f6f3ec', baseColor: '#1e4cff' },
    secondary: { tint: '#f6f3ec', textColor: '#111412', baseColor: '#6b716d' },
  },
}

function StudioButton({ theme = 'marketing', variant = 'primary', className = '', children, ...props }) {
  const palette = ctaPalettes[theme][variant]

  return (
    <SpecularButton
      {...palette}
      {...props}
      radius={30}
      tintOpacity={variant === 'primary' ? 0.96 : 0.82}
      autoAnimate={variant === 'primary'}
      className={`cta-button cta-button-${variant}${className ? ` ${className}` : ''}`}
    >
      {children}
    </SpecularButton>
  )
}

function getCanonicalUrl(pathname) {
  return `${canonicalOrigin}${pathname === '/' ? '/' : pathname}`
}

const webServices = [
  {
    title: 'Webdesign',
    text: 'Klare Seiten, starke Typografie, ruhiger Auftritt.',
    icon: 'layout',
    meta: 'Struktur & Look',
    points: ['Startseite und Unterseiten', 'Mobile sauber aufgebaut', 'Kontaktwege klar geführt'],
  },
  {
    title: 'SEO-Basis',
    text: 'Saubere Struktur, schnell geladen, lokal auffindbar.',
    icon: 'search',
    meta: 'Lokal sichtbar',
    points: ['Seitentitel und Texte', 'Technische Grundstruktur', 'Lokale Suchbegriffe'],
  },
  {
    title: 'Branding Light',
    text: 'Farben, Ton und Details, die zusammenpassen.',
    icon: 'spark',
    meta: 'Ton & Details',
    points: ['Farbwelt und Typografie', 'Bildsprache abstimmen', 'Ruhiger Gesamtauftritt'],
  },
]

const marketingServices = [
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

const webSteps = [
  'Kurz sprechen',
  'Look festlegen',
  'Sauber umsetzen',
  'Live schalten',
]

const marketingSteps = [
  'Kurz sprechen',
  'Formate festlegen',
  'Content produzieren',
  'Posten & lernen',
]

const webStudioSignals = [
  'klar',
  'schnell',
  'vertrauensvoll',
  'lokal',
  'Webdesign',
  'SEO',
]

const marketingStudioSignals = [
  'Strategie',
  'Instagram',
  'Kampagne',
  'Content',
  'TikTok',
  'Branding',
]

const webShowcases = [
  {
    name: 'Seegarten Bistro',
    location: 'Meilen',
    type: 'Restaurant & Reservierungen',
    detail:
      'Warme Bildsprache, klare Menüführung und ein schneller Weg zu Tischreservation, Karte und Öffnungszeiten.',
    tags: ['Mobile zuerst', 'Google-ready', 'Mehr Reservierungen'],
    image: '/showcase-seegarten.jpeg',
    imageAlt: 'Terrasse am See mit Tischen, Sonnenschirmen und Bootssteg',
  },
  {
    name: 'Baur Sanitär',
    location: 'Stäfa',
    type: 'Handwerksbetrieb',
    detail:
      'Vertrauensvoller Auftritt mit Leistungen, Referenzen und Kontaktstruktur, die Anfragen ohne Reibung möglich macht.',
    tags: ['KMU-Auftritt', 'Lokales SEO', 'Saubere Struktur'],
    image: '/showcase-sanitaer.jpeg',
    imageAlt: 'Sanitärinstallation mit Rohren, Boiler und Werkzeug',
  },
  {
    name: 'Praxis am See',
    location: 'Männedorf',
    type: 'Praxis & Dienstleistungen',
    detail:
      'Ruhiges Design, klare Informationen und eine Sprache, die Kompetenz und persönliche Nähe gleichzeitig vermittelt.',
    tags: ['Seriös', 'Barrierearm', 'Professionell'],
    image: '/showcase-praxis.jpeg',
    imageAlt: 'Moderner Empfangsbereich einer Praxis',
  },
]

const marketingShowcases = [
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

const siteContent = {
  web: {
    basePath: websiteBasePath,
    mailto: 'mailto:info@zhstudio.ch?subject=Offerte%20f%C3%BCr%20eine%20Website',
    title: 'ZhStudio | Webdesign aus Stäfa',
    description:
      'ZhStudio aus Stäfa gestaltet elegante, schnelle und lokale Webseiten für Unternehmen, Restaurants und Vereine im Kanton Zürich.',
    services: webServices,
    steps: webSteps,
    studioSignals: webStudioSignals,
    showcases: webShowcases,
    footerSubtitle: 'Webdesign aus Stäfa im Kanton Zürich',
    footerNote: 'Starke lokale Webauftritte für Unternehmen rund um Stäfa, die Goldküste und Zürich.',
    home: {
      eyebrow: 'Webdesign aus Stäfa an der Goldküste',
      titleStart: 'Schöne Websites, die',
      titleHighlight: 'Vertrauen schaffen',
      text:
        'ZhStudio gestaltet elegante, schnelle und moderne Webseiten für lokale Firmen, Restaurants und Vereine im Kanton Zürich. Klar, hochwertig und mit einem Auftritt, der zeigt, dass man euch ernst nehmen kann.',
      metricOne: 'für einfache Webauftritte',
      metricTwo: 'für Unternehmen rund um Zürich',
      kineticLabel: 'Studio für Wirkung',
      kineticWords: ['Design', 'Lokal', 'Website', 'SEO'],
      kineticText: 'Für Firmen, Restaurants und Vereine, die online nicht durchschnittlich wirken wollen.',
      trust: 'Für lokale Firmen, Restaurants, Praxen, Studios und Vereine im Kanton Zürich.',
      spotlightSubline: 'mit einem Auftritt, der nicht austauschbar wirkt.',
      spotlightText: 'Edles Webdesign mit lokaler Klarheit. Weniger Lärm, mehr Wirkung.',
      lookTitle: 'Look & Feel',
      lookText: 'Warme Flächen, Glaslayer, präzise Typografie.',
      audienceTitle: 'Für wen',
      audienceText: 'Für Firmen, die sofort besser wirken wollen.',
      whyTitle: 'Eine Website darf ruhig wirken.',
      whyLead: 'Aber sie muss im richtigen Moment überzeugen.',
      intro: [
        ['Lokale Nähe', 'Aus Stäfa, nah an lokalen Unternehmen und ihren Kunden.'],
        ['Apple-inspirierte Ruhe', 'Helles Layout, viel Ruhe, kontrollierte Bewegung.'],
        ['Faire Einstiegslösung', 'Ab CHF 480 für einen sauberen ersten Auftritt.'],
      ],
      nextTitle: 'Die Startseite ist nur der Einstieg. Das Ziel ist eure Anfrage.',
      nextText:
        'Wer Details sehen möchte, findet sie auf der Leistungsseite. Wer schon weiss, dass der Auftritt besser werden soll, kommt direkt zum Kontaktformular.',
    },
    servicesPage: {
      title: 'Design, Technik und ein sauberer Start.',
      lead:
        'Die Leistungsseite sammelt alles, was vor der Anfrage wichtig ist: Angebot, typische Projekte, Ablauf und Einstiegspreis.',
      sideEyebrow: 'Was man spürt',
      sideTitle: 'Ordnung, Tempo und ein Auftritt mit Gewicht.',
      sideText: 'Eine gute Website ordnet, beruhigt und macht Vertrauen sofort leichter.',
      proof: ['Ruhiger erster Eindruck', 'Schneller Weg zur Anfrage', 'Klare Basis für Wachstum'],
      projectsEyebrow: 'Typische Projekte aus der Region',
      projectsTitle: 'Websites für Betriebe, die online so gut aussehen sollen wie ihre Arbeit vor Ort.',
      projectMain: 'Local Site',
      projectSoftLabel: 'SEO',
      projectSoft: 'Google-ready',
      processTitle: 'Kein Agenturtheater.',
      processLead: 'Vier klare Schritte. Dann ist die Seite live.',
      priceTitle: 'Ein sauberer Einstieg ab CHF 480',
      priceText:
        'Für kleine Webauftritte, Landingpages oder lokale Erstpräsenz. Grössere Projekte, Zusatzseiten oder Branding werden individuell offeriert.',
      contactTitle: 'Wenn der Auftritt besser werden soll, startet es mit einer kurzen Anfrage.',
      contactText:
        'Für lokale Unternehmen im Kanton Zürich, die online ruhiger, klarer und stärker auftreten wollen.',
      contactSmall: 'Lokaler Fokus auf den Kanton Zürich und umliegende Gemeinden.',
    },
    contact: {
      title: 'Die Kontaktseite ist für eine Sache da: eure Anfrage sauber zu erfassen.',
      lead:
        'Kein zusätzlicher Lärm, keine unnötigen Blöcke. Einfach das Formular mit allem, was für eine erste Offerte oder ein Webprojekt gebraucht wird.',
      formTitle: 'Ein klarer Einstieg für Websites, Redesigns und lokale Auftritte im Kanton Zürich.',
      subject: 'Neue Anfrage über zhstudio.ch',
      fourthLabel: 'Website (falls vorhanden)',
      fourthType: 'text',
      fourthInputMode: 'url',
      fourthAutoComplete: 'url',
      fourthName: 'website',
      fourthPlaceholder: 'test.com oder https://www.bäckerbastian.ch',
      messagePlaceholder: 'Erzählt kurz, worum es geht und was ihr euch für eure Website wünscht.',
      thankYouText:
        'Wir prüfen die Angaben und melden uns so bald wie möglich persönlich zurück. Falls noch etwas Wichtiges fehlt, könnt ihr direkt per E-Mail nachreichen.',
    },
  },
  marketing: {
    basePath: marketingBasePath,
    mailto: 'mailto:info@zhstudio.ch?subject=Offerte%20f%C3%BCr%20Instagram%20und%20TikTok%20Marketing',
    title: 'ZhStudio | Instagram & TikTok Marketing aus Stäfa',
    description:
      'Social-Media-Strategie, Reels, TikToks und Kampagnen für lokale Unternehmen im Kanton Zürich.',
    services: marketingServices,
    steps: marketingSteps,
    studioSignals: marketingStudioSignals,
    showcases: marketingShowcases,
    footerSubtitle: 'Social Media Marketing aus Stäfa im Kanton Zürich',
    footerNote: 'Instagram- und TikTok-Marketing für Unternehmen rund um Stäfa, die Goldküste und Zürich.',
    home: {
      eyebrow: 'Instagram & TikTok Marketing aus Stäfa',
      titleStart: 'Content, der',
      titleHighlight: 'im Kopf bleibt',
      text:
        'ZhStudio plant und produziert Social-Media-Marketing für lokale Firmen, Restaurants, Praxen und Vereine im Kanton Zürich. Mit Reels, TikToks und Kampagnen, die nicht nur posten, sondern Aufmerksamkeit in echte Anfragen verwandeln.',
      metricOne: 'für Social-Media-Starts',
      metricTwo: 'für Marken rund um Zürich',
      kineticLabel: 'Studio für Wirkung',
      kineticWords: ['Marke', 'Reels', 'Content', 'TikTok'],
      kineticText: 'Für Unternehmen, die nicht nur posten wollen, sondern wiedererkannt werden.',
      trust: 'Für lokale Firmen, Restaurants, Praxen, Studios und Vereine, die auf Instagram und TikTok sichtbar werden wollen.',
      spotlightSubline: 'mit Content, der nicht austauschbar wirkt.',
      spotlightText: 'Social Content mit klarer Haltung. Weniger Zufall, mehr Wiedererkennung.',
      lookTitle: 'Look & Feel',
      lookText: 'Markante Typografie, klare Schnitte, visuelle Haltung.',
      audienceTitle: 'Für wen',
      audienceText: 'Für Firmen, die nicht austauschbar auftreten wollen.',
      whyTitle: 'Social Media braucht mehr als Aktivität.',
      whyLead: 'Es braucht einen Grund, warum Menschen euch folgen, speichern und anfragen.',
      intro: [
        ['Lokale Nähe', 'Aus Stäfa, nah an lokalen Unternehmen, ihrem Alltag und ihrer Zielgruppe.'],
        ['Reduzierte Gestaltung', 'Klare Formate, wiedererkennbare Serien und bewusst eingesetzte Bewegung.'],
        ['Faire Einstiegslösung', 'Ab CHF 480 für einen klaren Start auf Instagram und TikTok.'],
      ],
      nextTitle: 'Der erste Post ist nur der Einstieg. Das Ziel ist echte Nachfrage.',
      nextText:
        'Wer Details sehen möchte, findet sie auf der Leistungsseite. Wer schon weiss, dass Instagram oder TikTok endlich professioneller laufen soll, kommt direkt zum Kontaktformular.',
    },
    servicesPage: {
      title: 'Strategie, Content und sichtbare Kampagnen.',
      lead:
        'Hier steht, wie ZhStudio Instagram und TikTok für lokale Marken aufbaut: von Idee und Drehplan bis zu Reels, TikToks, Captions und laufender Content-Struktur.',
      sideEyebrow: 'Was man merkt',
      sideTitle: 'Ein Profil, das wirkt, bevor jemand lange nachdenkt.',
      sideText: 'Guter Social Content macht sofort klar, wer ihr seid, warum ihr relevant seid und was als Nächstes passieren soll.',
      proof: ['Mehr Wiedererkennung im Feed', 'Bessere Ideen für Reels und TikToks', 'Klare Basis für laufende Kampagnen'],
      projectsEyebrow: 'Typische Social-Projekte aus der Region',
      projectsTitle: 'Content für Betriebe, die im Feed so gut wirken sollen wie vor Ort.',
      projectMain: 'Local Content',
      projectSoftLabel: 'Social',
      projectSoft: 'Reels-ready',
      processTitle: 'Kein Content-Chaos.',
      processLead: 'Vier klare Schritte. Dann läuft euer Social-Media-System.',
      priceTitle: 'Ein klarer Social-Media-Start ab CHF 480',
      priceText:
        'Für Profil-Optimierung, erste Content-Ideen, Reels oder TikTok-Kampagnen. Laufende Betreuung, Drehtage und grössere Kampagnen werden individuell offeriert.',
      contactTitle: 'Wenn Instagram oder TikTok mehr bringen soll, startet es mit einer kurzen Anfrage.',
      contactText:
        'Für lokale Unternehmen im Kanton Zürich, die auf Social Media sichtbarer, relevanter und professioneller auftreten wollen.',
      contactSmall: 'Lokaler Fokus auf Content, Kampagnen und Social Media für Zürich und umliegende Gemeinden.',
    },
    contact: {
      title: 'Erzählt kurz, was Instagram oder TikTok für euch leisten soll.',
      lead:
        'Kein langer Fragebogen. Ein paar Angaben reichen, damit wir einschätzen können, welche Content-Formate, Plattformen und Kampagnen zu euch passen.',
      formTitle: 'Ein klarer Einstieg für Instagram, TikTok und lokale Social-Kampagnen.',
      subject: 'Neue Social-Media-Anfrage über zhstudio.ch',
      fourthLabel: 'Instagram oder TikTok (falls vorhanden)',
      fourthType: 'text',
      fourthName: 'social_channel',
      fourthPlaceholder: '@bastiansbaeckerei',
      messagePlaceholder: 'Erzählt kurz, worum es geht, welche Plattform wichtig ist und welche Art Content ihr euch wünscht.',
      thankYouText:
        'Wir prüfen die Angaben und melden uns so bald wie möglich persönlich zurück. Falls ihr bereits Profile, Videos oder Kampagnenideen habt, könnt ihr sie direkt per E-Mail nachreichen.',
    },
  },
}

const selectorContent = {
  title: 'ZhStudio | Webdesign und Marketing aus Stäfa',
  description:
    'ZhStudio aus Stäfa bietet Websites, Webdesign, Instagram Marketing und TikTok Marketing für lokale Unternehmen im Kanton Zürich.',
  eyebrow: 'Websites und Marketing aus Stäfa',
  heroTitle: 'Digitaler Auftritt. Echte Wirkung.',
  heroText: 'Webdesign und Content für Unternehmen, die lokal relevant und unverwechselbar auftreten wollen.',
  proof: ['Website', 'Marketing', 'lokal im Kanton Zürich'],
  choices: [
    {
      key: 'website',
      eyebrow: 'Websites',
      title: 'Website',
      text: 'Schnelle, hochwertige Seiten, die Vertrauen schaffen und Anfragen einfacher machen.',
      href: websiteBasePath,
      action: 'Zu Websites',
      tags: ['Webdesign', 'SEO', 'Struktur'],
    },
    {
      key: 'marketing',
      eyebrow: 'Marketing',
      title: 'Marketing',
      text: 'Instagram, TikTok, Reels und Content-Strukturen, die aus Aufmerksamkeit echte Nachfrage machen.',
      href: marketingBasePath,
      action: 'Zu Marketing',
      tags: ['Instagram', 'TikTok', 'Content'],
    },
  ],
}

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

function Header({ basePath = '', hidden = false, location, onNavigate, routePath }) {
  const currentPath = routePath

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
          href={withBasePath(basePath, '/')}
          onClick={(event) => handleNavigate(event, withBasePath(basePath, '/'))}
          aria-current={currentPath === '/' ? 'page' : undefined}
        >
          Start
        </a>
        <a
          className={getNavClassName('/leistungen')}
          href={withBasePath(basePath, '/leistungen')}
          onClick={(event) => handleNavigate(event, withBasePath(basePath, '/leistungen'))}
          aria-current={currentPath === '/leistungen' ? 'page' : undefined}
        >
          Leistungen
        </a>
        <a
          className={getNavClassName('/kontakt')}
          href={withBasePath(basePath, '/kontakt')}
          onClick={(event) => handleNavigate(event, withBasePath(basePath, '/kontakt'))}
          aria-current={currentPath === '/kontakt' ? 'page' : undefined}
        >
          Kontakt
        </a>
      </nav>
    </header>
  )
}

function Footer({ content }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/logo-mark.png" alt="" aria-hidden="true" />
        <div>
          <strong>ZhStudio</strong>
          <span>{content.footerSubtitle}</span>
        </div>
      </div>
      <div className="footer-links">
        <a href="/website">Website</a>
        <a href="/marketing">Marketing</a>
        <a href="mailto:info@zhstudio.ch">E-Mail</a>
        <a href="/impressum">Impressum</a>
        <a href="/datenschutz">Datenschutz</a>
      </div>
      <p className="footer-note">
        {content.footerNote}
      </p>
    </footer>
  )
}

function UnifiedHomeVisual() {
  return (
    <div className="unified-visual" aria-hidden="true">
      <article className="unified-plane unified-plane-website interactive-card parallax-card">
        <div className="unified-plane-topline">
          <span>01</span>
          <strong>Website</strong>
        </div>
        <h2>Schnelle Websites. Klare Wirkung.</h2>
        <div className="unified-browser-preview">
          <span />
          <span />
          <span />
          <strong>zhstudio.ch/website</strong>
        </div>
        <div className="unified-layout-preview">
          <i className="unified-layout-hero" />
          <i className="unified-layout-line" />
          <i className="unified-layout-card" />
          <i className="unified-layout-button" />
        </div>
        <div className="unified-plane-arrow">↗</div>
      </article>

      <article className="unified-plane unified-plane-marketing interactive-card parallax-card">
        <div className="unified-plane-topline">
          <span>02</span>
          <strong>Marketing</strong>
        </div>
        <h2>Content, der sichtbar macht.</h2>
        <div className="unified-social-grid">
          <span>Reels</span>
          <span>TikTok</span>
          <span>Ads</span>
          <span>Feed</span>
        </div>
        <div className="unified-growth-card">
          <span>Reichweite</span>
          <strong>+127%</strong>
        </div>
        <div className="unified-plane-arrow">↗</div>
      </article>
    </div>
  )
}

function SelectorPage({ onNavigate }) {
  const handleNavigate = (event, href) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <main className="selector-page unified-home-page">
      <section className="unified-hero">
        <a className="selector-brand unified-brand" href="/" onClick={(event) => handleNavigate(event, '/')}>
          <img src="/logo-mark.png" alt="ZhStudio Logo" />
          <span>ZhStudio</span>
        </a>

        <div className="unified-nav-actions" aria-label="Bereiche">
          <a href={websiteBasePath} onClick={(event) => handleNavigate(event, websiteBasePath)}>
            Website <span>↗</span>
          </a>
          <a href={marketingBasePath} onClick={(event) => handleNavigate(event, marketingBasePath)}>
            Marketing <span>↗</span>
          </a>
        </div>

        <div className="unified-hero-copy">
          <span className="eyebrow">{selectorContent.eyebrow}</span>
          <h1>{selectorContent.heroTitle}</h1>
          <p>{selectorContent.heroText}</p>
          <div className="unified-actions">
            <StudioButton
              theme="selector"
              href={websiteBasePath}
              onClick={(event) => handleNavigate(event, websiteBasePath)}
            >
              Zu Websites <span>↗</span>
            </StudioButton>
            <StudioButton
              theme="selector"
              variant="secondary"
              href={marketingBasePath}
              onClick={(event) => handleNavigate(event, marketingBasePath)}
            >
              Zu Marketing <span>↗</span>
            </StudioButton>
          </div>
          <div className="unified-proof">
            {selectorContent.proof.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

      </section>

      <section className="unified-services" aria-label="Angebote">
        <div className="unified-services-heading">
          <span>Was ZhStudio anbietet</span>
          <p>
            Ein Auftritt funktioniert besser, wenn Website und Marketing dieselbe Sprache sprechen.
          </p>
        </div>
        <div className="selector-grid unified-service-grid">
          {selectorContent.choices.map((choice) => (
            <a
              className={`selector-card selector-card-${choice.key} unified-service-card interactive-card parallax-card`}
              href={choice.href}
              onClick={(event) => handleNavigate(event, choice.href)}
              key={choice.key}
            >
              <span className="selector-eyebrow">{choice.eyebrow}</span>
              <h2>{choice.title}</h2>
              <p>{choice.text}</p>
              <div className="selector-tags">
                {choice.tags.map((tag) => (
                  <em key={tag}>{tag}</em>
                ))}
              </div>
              <strong className="selector-action">{choice.action}</strong>
            </a>
          ))}
        </div>
      </section>

      <Footer
        content={{
          footerSubtitle: 'Websites und Marketing aus Stäfa',
          footerNote:
            'ZhStudio baut digitale Auftritte für lokale Unternehmen rund um Stäfa, die Goldküste und Zürich.',
        }}
      />
    </main>
  )
}

function WebsiteHeroVisual() {
  return (
    <div className="website-visual interactive-card" aria-hidden="true">
      <div className="website-browser">
        <div className="website-browser-bar">
          <span />
          <span />
          <span />
          <strong>zhstudio.ch/website</strong>
        </div>

        <div className="website-canvas">
          <div className="website-layout website-layout-hero">
            <span />
            <strong />
            <p />
          </div>
          <div className="website-layout website-layout-card-a" />
          <div className="website-layout website-layout-card-b" />
          <div className="website-layout website-layout-card-c" />
          <div className="website-cta" />
          <div className="website-scan" />
        </div>
      </div>

      <svg className="website-paths" viewBox="0 0 540 420" role="img">
        <path className="website-path website-path-a" d="M56 330 C116 242 174 272 226 188 S354 84 472 136" />
        <path className="website-path website-path-b" d="M86 112 C168 170 190 76 276 118 S402 252 490 192" />
      </svg>

      <div className="website-floating website-floating-a">
        <span>Mobile</span>
        <strong>sauber</strong>
      </div>
      <div className="website-floating website-floating-b">
        <span>SEO</span>
        <strong>bereit</strong>
      </div>
      <div className="website-floating website-floating-c">
        <span>Speed</span>
        <strong>95+</strong>
      </div>
    </div>
  )
}

function HomePage({ content }) {
  const basePath = content.basePath
  const home = content.home
  const isWebsiteHome = basePath === websiteBasePath
  const buttonTheme = isWebsiteHome ? 'web' : 'marketing'
  const studioLoopItems = content.studioSignals.map((signal, index) => ({
    node: <span className={index % 3 === 2 ? 'studio-loop-accent' : ''}>{signal}</span>,
    title: signal,
  }))

  return (
    <>
      <main id="top" className={isWebsiteHome ? 'home-main home-main-website' : 'home-main'}>
        <section className={`hero${isWebsiteHome ? ' hero-website' : ''}`}>
          <div className="hero-copy">
            <div className="eyebrow">{home.eyebrow}</div>
            <h1>
              {home.titleStart} <span>{home.titleHighlight}.</span>
            </h1>
            <p className="hero-text">
              {home.text}
            </p>
            <div className="hero-actions">
              <StudioButton
                theme={buttonTheme}
                href={withBasePath(basePath, '/kontakt')}
              >
                Offerte anfragen
              </StudioButton>
              <StudioButton
                theme={buttonTheme}
                variant="secondary"
                href={withBasePath(basePath, '/leistungen')}
              >
                Leistungen ansehen
              </StudioButton>
            </div>
            <div className="hero-meta">
              <div>
                <strong>ab CHF 480</strong>
                <span>{home.metricOne}</span>
              </div>
              <div>
                <strong>lokal & schnell</strong>
                <span>{home.metricTwo}</span>
              </div>
            </div>
          </div>

          <div className="hero-orb">
            <div className="hero-rays" aria-hidden="true">
              <SideRays
                speed={1.15}
                rayColor1={isWebsiteHome ? '#2457ff' : '#d7ff56'}
                rayColor2={isWebsiteHome ? '#79f2c9' : '#1e4cff'}
                intensity={1.05}
                spread={1.7}
                origin="top-right"
                saturation={1.15}
                blend={0.58}
                falloff={1.9}
                opacity={0.48}
              />
            </div>
            {isWebsiteHome ? (
              <WebsiteHeroVisual />
            ) : (
              <>
                <div className="glow-ring" />
                <div className="device-card device-main kinetic-board interactive-card">
                  <span className="kinetic-label">{home.kineticLabel}</span>
                  <div className="kinetic-word kinetic-word-a">{home.kineticWords[0]}</div>
                  <div className="kinetic-word kinetic-word-b">{home.kineticWords[1]}</div>
                  <div className="kinetic-word kinetic-word-c">{home.kineticWords[2]}</div>
                  <div className="kinetic-word kinetic-word-d">{home.kineticWords[3]}</div>
                  <div className="kinetic-line" />
                  <p>
                    {home.kineticText}
                  </p>
                </div>
                <div className="floating-card floating-b interactive-card">
                  <span>Typischer Start</span>
                  <strong>Offerte in kurzer Zeit</strong>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="trust-strip reveal">
          <p>{home.trust}</p>
        </section>

        <section className="studio-marquee reveal" aria-label="Studio-Schwerpunkte">
          <LogoLoop
            logos={studioLoopItems}
            speed={62}
            direction="left"
            logoHeight={34}
            gap={58}
            hoverSpeed={26}
            fadeOut
            fadeOutColor={isWebsiteHome ? '#101928' : '#111412'}
            ariaLabel="Studio-Schwerpunkte"
            className="studio-logo-loop"
          />
        </section>

        <section className="section spotlight-section reveal">
          <div className="spotlight-layout">
            <article className="spotlight-panel spotlight-large interactive-card parallax-card">
              <div className="spotlight-dot-field" aria-hidden="true">
                <DotField
                  dotRadius={1.5}
                  dotSpacing={17}
                  cursorRadius={380}
                  bulgeStrength={48}
                  glowRadius={190}
                  gradientFrom={isWebsiteHome ? 'rgba(121, 242, 201, 0.42)' : 'rgba(215, 255, 86, 0.38)'}
                  gradientTo="rgba(255, 255, 255, 0.16)"
                  glowColor={isWebsiteHome ? '#2457ff' : '#1e4cff'}
                />
              </div>
              <span className="eyebrow">Design-Richtung</span>
              <h2 className="editorial-title">
                Ruhige Präzision
                <span className="editorial-subline">{home.spotlightSubline}</span>
              </h2>
              <p>
                {home.spotlightText}
              </p>
            </article>

            <div className="spotlight-stack">
              <article className="spotlight-panel spotlight-small interactive-card parallax-card">
                <div className="spotlight-icon" aria-hidden="true">
                  ✦
                </div>
                <strong>{home.lookTitle}</strong>
                <p>{home.lookText}</p>
              </article>
              <article className="spotlight-panel spotlight-small interactive-card parallax-card">
                <div className="spotlight-icon" aria-hidden="true">
                  ◎
                </div>
                <strong>{home.audienceTitle}</strong>
                <p>{home.audienceText}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section intro reveal">
          <div className="section-heading-row">
            <div className="section-heading section-heading-stacked">
              <span className="eyebrow">Warum ZhStudio</span>
              <h2>{home.whyTitle}</h2>
              <p className="section-lead">{home.whyLead}</p>
            </div>
          </div>
          <div className="intro-grid">
            {home.intro.map(([title, text]) => (
              <article className="interactive-card" key={title}>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section home-contact-goal reveal">
          <div className="price-card interactive-card">
            <div>
              <span className="eyebrow">Nächster Schritt</span>
              <h2>{home.nextTitle}</h2>
              <p>
                {home.nextText}
              </p>
            </div>
            <StudioButton
              theme={buttonTheme}
              className="cta-button-large"
              href={withBasePath(basePath, '/kontakt')}
            >
              Anfragen
            </StudioButton>
          </div>
        </section>
      </main>

      <Footer content={content} />
    </>
  )
}

function ServicesPage({ content }) {
  const basePath = content.basePath
  const page = content.servicesPage
  const buttonTheme = basePath === websiteBasePath ? 'web' : 'marketing'

  return (
    <>
      <main id="leistungen" className="services-page-main">
        <section className="services-hero reveal">
          <div className="section-heading section-heading-compact services-heading">
            <span className="eyebrow">Leistungen</span>
            <h2>{page.title}</h2>
            <p className="section-lead">
              {page.lead}
            </p>
          </div>
          <div className="service-layout">
            <div className="service-grid">
              {content.services.map((service) => (
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
                <span className="eyebrow">{page.sideEyebrow}</span>
                <span className="service-side-mark" aria-hidden="true">01</span>
              </div>
              <h3>{page.sideTitle}</h3>
              <p>{page.sideText}</p>
              <div className="service-proof">
                {page.proof.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="section reveal" id="projekte">
          <div className="section-heading-row section-heading-row-projects">
            <div className="section-heading section-heading-quote">
              <span className="eyebrow">{page.projectsEyebrow}</span>
              <h2>{page.projectsTitle}</h2>
            </div>
            <div className="heading-visual heading-visual-projects interactive-card parallax-card" aria-hidden="true">
              <div className="project-preview project-preview-main">
                <span>Stäfa</span>
                <strong>{page.projectMain}</strong>
              </div>
              <div className="project-preview project-preview-soft">
                <span>{page.projectSoftLabel}</span>
                <strong>{page.projectSoft}</strong>
              </div>
            </div>
          </div>
          <div className="showcase-grid showcase-grid-alt">
            {content.showcases.map((item, index) => (
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
              <h2>{page.processTitle}</h2>
              <p className="section-lead">{page.processLead}</p>
            </div>
            <div className="steps">
              {content.steps.map((step, index) => (
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
              <h2>{page.priceTitle}</h2>
              <p>
                {page.priceText}
              </p>
            </div>
            <StudioButton
              theme={buttonTheme}
              className="cta-button-large"
              href={withBasePath(basePath, '/kontakt')}
            >
              Offerte anfragen
            </StudioButton>
          </div>
        </section>

        <section className="section contact-section reveal">
          <div className="section-heading section-heading-contact">
            <span className="eyebrow">Kontakt</span>
            <h2>{page.contactTitle}</h2>
          </div>
          <div className="contact-layout">
            <div className="contact-panel interactive-card">
              <div>
                <p>
                  {page.contactText}
                </p>
                <a href={withBasePath(basePath, '/kontakt')}>Zum Kontaktformular</a>
              </div>
              <div className="contact-badge interactive-card">
                <strong>Standort</strong>
                <span>Weberstrasse 4, Stäfa, 8712, Schweiz</span>
                <small>{page.contactSmall}</small>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer content={content} />
    </>
  )
}

function ContactPage({ content, onNavigate }) {
  const basePath = content.basePath
  const contact = content.contact
  const buttonTheme = basePath === websiteBasePath ? 'web' : 'marketing'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    setIsSubmitting(true)
    setFormError('')

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Formspree submission failed')
      }

      form.reset()
      onNavigate(withBasePath(basePath, formRedirectPath))
    } catch (error) {
      setFormError('Das Formular konnte nicht gesendet werden. Bitte versucht es nochmals oder schreibt direkt an info@zhstudio.ch.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <main className="contact-page-main">
        <section className="contact-focus reveal" id="kontaktformular">
          <div className="contact-focus-intro">
            <span className="eyebrow">Kontakt</span>
            <h1>{contact.title}</h1>
            <p className="contact-focus-text">
              {contact.lead}
            </p>
          </div>

          <div className="contact-form-shell reveal">
            <div className="contact-form-head">
              <div>
                <span className="eyebrow">Anfrage senden</span>
                <h2>{contact.formTitle}</h2>
              </div>
              <div className="contact-mini-meta">
                <span>info@zhstudio.ch</span>
                <span>Stäfa, Zürich</span>
              </div>
            </div>

            <form className="contact-form contact-form-focused" action={formEndpoint} method="POST" onSubmit={handleSubmit}>
              <input type="hidden" name="_subject" value={contact.subject} />
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
                  <span>{contact.fourthLabel}</span>
                  <input
                    type={contact.fourthType}
                    name={contact.fourthName}
                    placeholder={contact.fourthPlaceholder}
                    inputMode={contact.fourthInputMode}
                    autoComplete={contact.fourthAutoComplete}
                  />
                </label>

                <label className="form-field">
                  <span>Telefon (optional)</span>
                  <input type="tel" name="phone" placeholder="+41 79 123 45 67" />
                </label>

                <label className="form-field form-field-full">
                  <span>Nachricht</span>
                  <textarea
                    name="message"
                    placeholder={contact.messagePlaceholder}
                    required
                  />
                </label>
              </div>

              <div className="form-actions">
                <StudioButton theme={buttonTheme} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                </StudioButton>
                <p className="form-note">
                  Mit dem Absenden akzeptiert ihr die Verarbeitung gemäss{' '}
                  <a href="/datenschutz">Datenschutzerklärung</a>.
                </p>
              </div>
              {formError ? (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              ) : null}
            </form>
          </div>
        </section>
      </main>

      <Footer content={content} />
    </>
  )
}

function ThankYouPage({ content }) {
  const basePath = content.basePath
  const buttonTheme = basePath === websiteBasePath ? 'web' : 'marketing'

  return (
    <>
      <main className="thank-you-main">
        <section className="thank-you-focus reveal">
          <div className="thank-you-card interactive-card">
            <span className="eyebrow">Anfrage erhalten</span>
            <h1>Danke. Eure Nachricht ist angekommen.</h1>
            <p>
              {content.contact.thankYouText}
            </p>

            <div className="thank-you-actions">
              <StudioButton theme={buttonTheme} href={withBasePath(basePath, '/')}>
                Zur Startseite
              </StudioButton>
              <StudioButton theme={buttonTheme} variant="secondary" href="mailto:info@zhstudio.ch">
                info@zhstudio.ch
              </StudioButton>
            </div>
          </div>
        </section>
      </main>

      <Footer content={content} />
    </>
  )
}

function LegalPage({ content, pageKey }) {
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

      <Footer content={content} />
    </>
  )
}

export default function App() {
  const appRef = useRef(null)
  const [location, setLocation] = useState(getLocationState)
  const [isTopbarHidden, setIsTopbarHidden] = useState(false)
  const [navigationTick, setNavigationTick] = useState(0)
  const path = location.pathname
  const isWebsitePage = path === websiteBasePath || path.startsWith(`${websiteBasePath}/`)
  const isMarketingPage = path === marketingBasePath || path.startsWith(`${marketingBasePath}/`)
  const isRootLegalPage = path === '/impressum' || path === '/datenschutz'
  const isSelectorPage = !isWebsitePage && !isMarketingPage && !isRootLegalPage
  const content = isMarketingPage ? siteContent.marketing : siteContent.web
  const pageMeta = isSelectorPage ? selectorContent : content
  const routePath = isMarketingPage
    ? stripBasePath(path, marketingBasePath)
    : isWebsitePage
      ? stripBasePath(path, websiteBasePath)
      : path
  const isLegalPage = routePath === '/impressum' || routePath === '/datenschutz'
  const isServicesPage = !isSelectorPage && routePath === '/leistungen'
  const isContactPage = !isSelectorPage && routePath === '/kontakt'
  const isThankYouPage = !isSelectorPage && routePath === formRedirectPath
  const siteClassName = isSelectorPage ? ' site-selector' : isMarketingPage ? ' site-marketing' : ' site-web'

  useEffect(() => {
    const currentUrl = `${window.location.pathname}${window.location.hash}`
    const normalizedUrl = `${path}${location.hash}`

    if (currentUrl !== normalizedUrl) {
      window.history.replaceState({}, '', normalizedUrl)
    }
  }, [path, location.hash])

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
    document.title = pageMeta.title

    const description = document.querySelector('meta[name="description"]')
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    const ogUrl = document.querySelector('meta[property="og:url"]')
    const canonical = document.querySelector('link[rel="canonical"]')
    const canonicalUrl = getCanonicalUrl(path)

    description?.setAttribute('content', pageMeta.description)
    ogTitle?.setAttribute('content', pageMeta.title)
    ogDescription?.setAttribute('content', pageMeta.description)
    ogUrl?.setAttribute('content', canonicalUrl)
    canonical?.setAttribute('href', canonicalUrl)
  }, [pageMeta, path])

  useLayoutEffect(() => {
    const scrollToPageTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    if (routePath !== '/') {
      scrollToPageTop()
      requestAnimationFrame(scrollToPageTop)
      return
    }

    if (!location.hash) {
      scrollToPageTop()
      requestAnimationFrame(scrollToPageTop)
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
  }, [path, routePath, location.hash, navigationTick])

  const handleNavigate = (href) => {
    navigateTo(href, setLocation)
    setNavigationTick((tick) => tick + 1)
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

      if (document.querySelector('.unified-hero')) {
        gsap.from('.unified-brand, .unified-nav-actions, .unified-hero-copy > *, .unified-service-card', {
          y: 34,
          opacity: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: 'power3.out',
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
  }, [isLegalPage, isServicesPage, isContactPage, isThankYouPage, isMarketingPage, isSelectorPage])

  return (
    <div className={`site-shell${siteClassName}${isLegalPage ? ' legal-shell' : ''}`} ref={appRef}>
      <div className="background-motion" />
      <div className="background-grid" />
      <div className="background-bubbles" aria-hidden="true">
        <span className="background-bubble bubble-a" />
        <span className="background-bubble bubble-b" />
        <span className="background-bubble bubble-c" />
        <span className="background-bubble bubble-d" />
        <span className="background-bubble bubble-e" />
      </div>

      {!isSelectorPage ? (
        <Header
          hidden={isTopbarHidden}
          basePath={content.basePath}
          location={location}
          onNavigate={handleNavigate}
          routePath={routePath}
        />
      ) : null}
      {isSelectorPage ? <SelectorPage onNavigate={handleNavigate} /> : null}
      {!isSelectorPage && routePath === '/impressum' ? <LegalPage content={siteContent.web} pageKey="impressum" /> : null}
      {!isSelectorPage && routePath === '/datenschutz' ? <LegalPage content={siteContent.web} pageKey="datenschutz" /> : null}
      {!isSelectorPage && routePath === '/leistungen' ? <ServicesPage content={content} /> : null}
      {!isSelectorPage && routePath === '/kontakt' ? <ContactPage content={content} onNavigate={handleNavigate} /> : null}
      {!isSelectorPage && routePath === formRedirectPath ? <ThankYouPage content={content} /> : null}
      {!isSelectorPage &&
      routePath !== '/impressum' &&
      routePath !== '/datenschutz' &&
      routePath !== '/leistungen' &&
      routePath !== '/kontakt' &&
      routePath !== formRedirectPath ? (
        <HomePage content={content} />
      ) : null}
    </div>
  )
}
