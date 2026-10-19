import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'
import esCatalog from './locales/es.catalog.json'
import enCatalog from './locales/en.catalog.json'
import esFeatures from './locales/es.features.json'
import enFeatures from './locales/en.features.json'

// Combina objetos de forma recursiva (los textos nuevos se suman a los base)
const merge = (a, b) => {
  const out = { ...a }
  for (const [key, value] of Object.entries(b)) {
    out[key] = value && typeof value === 'object' ? merge(a[key] || {}, value) : value
  }
  return out
}

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: merge(merge(es, esCatalog), esFeatures) },
    en: { translation: merge(merge(en, enCatalog), enFeatures) },
  },
  lng: localStorage.getItem('lang') || 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

document.documentElement.lang = i18n.language
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng)
  document.documentElement.lang = lng
})

export default i18n
