import { createI18n } from 'vue-i18n'
import ru from './locales/ru.json'
import en from './locales/en.json'
import es from './locales/es.json'

const defaultLocale = 'ru'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {
    ru,
    en,
    es,
  }
})

export default i18n
