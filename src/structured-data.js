import { localeFor, baseRoute } from './languages.js'
import business from './business.json' with { type: 'json' }
import { faqsFor } from './content.js'
import { canonicalUrlFor, routeMetadata } from './seo.js'

export function structuredDataFor(pathname) {
  const locale = localeFor(pathname)
  const route = baseRoute(pathname)
  const provider = locale === 'fr' ? {
    ...business['@graph'][0],
    image: 'https://zhstudio.ch/og-fr.png',
    areaServed: [{ '@type': 'City', name: 'Stäfa' }, { '@type': 'AdministrativeArea', name: 'Canton de Zurich' }],
    knowsAbout: ['Design web', 'Développement adapté à tous les écrans', 'Référencement local', 'Conception de sites web', 'Développement frontend'],
  } : business['@graph'][0]
  const metadata = routeMetadata[pathname] || routeMetadata['/']
  const url = canonicalUrlFor(pathname)
  const page = {
    '@type': route === '/kontakt' ? 'ContactPage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: metadata.title,
    description: metadata.description,
    inLanguage: `${locale}-CH`,
    isPartOf: { '@id': 'https://zhstudio.ch/#website' },
    about: { '@id': 'https://zhstudio.ch/#business' },
  }
  if (route === '/') {
    page['@type'] = ['WebPage', 'FAQPage']
    page.mainEntity = faqsFor(locale).map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    }))
  }
  if (route === '/leistungen') {
    page.mainEntity = {
      '@type': 'Service',
      name: locale === 'fr' ? 'Design et développement de sites web' : 'Webdesign und Website-Entwicklung',
      serviceType: locale === 'fr' ? 'Création de sites web' : 'Webdesign',
      provider: { '@id': 'https://zhstudio.ch/#business' },
      areaServed: provider.areaServed,
      description: metadata.description,
    }
    page.mentions = {
      '@type': 'WebSite',
      name: 'Inbox',
      url: 'https://inbx.page/',
      creator: { '@id': 'https://zhstudio.ch/#business' },
    }
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [...business['@graph'].map(item => item['@type'] === 'WebSite' ? { ...item, inLanguage: ['de-CH', 'fr-CH'] } : provider), page],
  }
}
