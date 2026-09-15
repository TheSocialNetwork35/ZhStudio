export const frenchRoutes = {
  '/': '/fr',
  '/leistungen': '/fr/prestations',
  '/kontakt': '/fr/contact',
  '/danke': '/fr/merci',
  '/impressum': '/fr/mentions-legales',
  '/datenschutz': '/fr/confidentialite',
  '/404': '/fr/404',
}
export function localeFor(path = '/') { return /^\/fr(?:\/|$)/i.test(path) ? 'fr' : 'de' }
export function baseRoute(path) {
  return Object.entries(frenchRoutes).find(([, value]) => value === path)?.[0] || path
}
export function localizedPath(path, locale) {
  const match = path.match(/^([^?#]*)(.*)$/)
  const base = baseRoute(match[1])
  return (locale === 'fr' ? (frenchRoutes[base] || match[1]) : base) + match[2]
}
export function languageAlternates(path) {
  const base = baseRoute(path)
  if (!frenchRoutes[base] || base === '/404' || base === '/danke') return []
  return [{ lang: 'de', path: base }, { lang: 'fr', path: frenchRoutes[base] }, { lang: 'x-default', path: base }]
}
