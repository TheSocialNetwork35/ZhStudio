import { createContext, useContext } from 'react'
import { translate, localize } from './translate.js'
import { localizedPath } from './languages.js'

export const LocaleContext = createContext('de')
export function useLocale() {
  const locale = useContext(LocaleContext)
  return { locale, t: text => translate(text, locale), href: path => localizedPath(path, locale), localize: data => localize(data, locale) }
}
export function rememberLanguage(locale) {
  try { localStorage.setItem('zhstudio-language', locale) } catch { /* Navigation works even when storage is unavailable. */ }
}
