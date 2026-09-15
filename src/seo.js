import { frenchRoutes } from './languages.js'

export const canonicalOrigin = 'https://zhstudio.ch'

export const routeMetadata = {
  '/': {
    title: 'Webdesign Stäfa | Professionelle Websites | ZhStudio',
    description: 'ZhStudio gestaltet professionelle, schnelle Websites für Unternehmen in Stäfa, an der Goldküste und im Kanton Zürich.',
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
    robots: 'noindex, nofollow',
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

const frenchMetadata = {
  '/': { title: 'Création de sites web à Stäfa | ZhStudio', description: 'ZhStudio crée des sites professionnels et rapides pour les entreprises de Stäfa, de la Goldküste et du canton de Zurich.' },
  '/leistungen': { title: 'Création de sites web à Stäfa et Zurich | Prestations ZhStudio', description: 'Concept, design web, réalisation adaptée à tous les écrans et bases du référencement technique pour votre site professionnel.' },
  '/kontakt': { title: 'Parlons de votre site web | ZhStudio Stäfa', description: 'Contactez ZhStudio à Stäfa pour votre site web ou sa refonte et recevez une offre claire et personnalisée.' },
  '/danke': { title: 'Merci pour votre demande | ZhStudio', description: 'Votre demande est bien arrivée chez ZhStudio. Nous vous répondrons personnellement dès que possible.', robots: 'noindex, nofollow' },
  '/impressum': { title: 'Mentions légales | ZhStudio Stäfa', description: 'Informations sur l’éditeur, les coordonnées et la responsabilité du contenu de ZhStudio à Stäfa, dans le canton de Zurich.' },
  '/datenschutz': { title: 'Politique de confidentialité | ZhStudio', description: 'Informations sur la protection et le traitement des données personnelles sur zhstudio.ch.' },
}
for (const [base, metadata] of Object.entries(frenchMetadata)) routeMetadata[frenchRoutes[base]] = metadata

export const knownRoutes = Object.keys(routeMetadata)

export const legacyRoutes = {
  '/website': '/',
  '/website/leistungen': '/leistungen',
  '/website/kontakt': '/kontakt',
  '/website/danke': '/danke',
}

export function canonicalUrlFor(pathname) {
  return `${canonicalOrigin}${pathname === '/' ? '/' : pathname}`
}

export const notFoundMetadata = {
  title: '404 – Seite nicht gefunden | ZhStudio',
  description: 'Diese Seite wurde nicht gefunden. Zurück zur Startseite, zu unseren Leistungen oder zum Kontakt mit ZhStudio.',
  robots: 'noindex, nofollow',
}

export function notFoundMetadataFor(locale) {
  return locale === 'fr' ? {
    title: '404 – Page introuvable | ZhStudio',
    description: 'Cette page est introuvable. Retrouvez l’accueil, nos prestations ou les coordonnées de ZhStudio.',
    robots: 'noindex, nofollow',
  } : notFoundMetadata
}
