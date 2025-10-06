import { createI18n } from 'vue-i18n'
import de from './locales/de.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('app-locale') || 'de',
  fallbackLocale: 'en',
  messages: {
    de,
    en,
  },
})

export default i18n
