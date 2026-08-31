export const canonicalOrigin = 'https://www.zhstudio.ch'

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
