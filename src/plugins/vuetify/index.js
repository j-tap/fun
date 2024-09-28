import { watch } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ru, en, es } from 'vuetify/locale'
import '@mdi/font/css/materialdesignicons.css'
import i18n from '@/plugins/i18n'
import customIcons from './customIcons.js'

const { locale } = i18n.global

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    current: locale.value,
    fallback: locale.value,
    messages: { ru, en, es },
  },
  icons: {
    sets: { custom: customIcons },
  },
})

export default vuetify
