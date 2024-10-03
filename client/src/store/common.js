import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const id = 'common'

export const useCommonStore = defineStore(id, () => {
  const { locale:localeI18n } = useI18n()

  const theme = useStorage(`${id}.theme`, 'dark')
  const drawer = useStorage(`${id}.drawer`, false)
  const locale = useStorage(`${id}.locale`, localeI18n.value)

  const setTheme = (value) => {
    theme.value = value
  }
  const setDrawer = (value) => {
    drawer.value = value
  }

  const setLocale = (value) => {
    localeI18n.value = value
    locale.value = value
  }

  return { locale, theme, drawer, setTheme, setDrawer, setLocale }
})
