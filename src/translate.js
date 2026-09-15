import { fr } from './locales/fr.js'

export function translate(text, locale) { return locale === 'fr' ? (fr[text] ?? text) : text }
export function localize(data, locale) {
  if (typeof data === 'string') return translate(data, locale)
  if (Array.isArray(data)) return data.map(value => localize(value, locale))
  if (data && typeof data === 'object') return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, localize(value, locale)]))
  return data
}
