import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ru from './locales/ru.json'
import { decodeHtmlEntities } from './utils/decodeHtmlEntities'

export const resources = {
  en: { translation: en },
  ru: { translation: ru },
} as const

const decodeEntitiesPostProcessor = {
  type: 'postProcessor' as const,
  name: 'decodeEntities',
  process(value: string) {
    if (typeof value !== 'string') return value
    return decodeHtmlEntities(decodeHtmlEntities(value))
  },
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(decodeEntitiesPostProcessor)
  .init({
    resources,
    fallbackLng: 'ru',
    supportedLngs: ['en', 'ru'],
    interpolation: { escapeValue: false },
    postProcess: ['decodeEntities'],
    react: { useSuspense: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })
  .then(() => {
    document.documentElement.lang = i18n.language
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

export default i18n
