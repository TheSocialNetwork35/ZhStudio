import business from './business.json' with { type: 'json' }
import { faqs } from './content.js'
import { canonicalUrlFor, routeMetadata } from './seo.js'

export function structuredDataFor(pathname) {
  const metadata = routeMetadata[pathname] || routeMetadata['/']
  const url = canonicalUrlFor(pathname)
  const page = {
    '@type': pathname === '/kontakt' ? 'ContactPage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: metadata.title,
    description: metadata.description,
    inLanguage: 'de-CH',
    isPartOf: { '@id': 'https://zhstudio.ch/#website' },
    about: { '@id': 'https://zhstudio.ch/#business' },
  }
  if (pathname === '/') {
    page['@type'] = ['WebPage', 'FAQPage']
    page.mainEntity = faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    }))
  }
  if (pathname === '/leistungen') {
    page.mainEntity = {
      '@type': 'Service',
      name: 'Webdesign und Website-Entwicklung',
      serviceType: 'Webdesign',
      provider: { '@id': 'https://zhstudio.ch/#business' },
      areaServed: business['@graph'][0].areaServed,
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
    '@graph': [...business['@graph'], page],
  }
}
