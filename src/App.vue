<template lang="pug">
v-app(:theme="theme")
  v-app-bar
    template(v-slot:append)
      v-app-bar-nav-icon(variant="text" @click.stop="drawer = !drawer")
    v-toolbar-title
      router-link.d-flex.align-center.text-pink.no-link(to="/")
        v-icon.mr-2(size="sm") mdi-emoticon
        span.text-button FUN

    v-spacer
    v-select.flex-grow-0(
      v-model="localeCurrent"
      :items="availableLocales"
      density="compact"
      prepend-inner-icon="mdi-web"
      variant="text"
      hide-details
    )
    // icon="mdi-theme-light-dark"
    v-btn(
      :icon="theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
      slim
      @click="switchTheme"
    )

  v-navigation-drawer(
    v-model="drawer"
    location="right"
  )
    v-list
      v-list-subheader {{ $t('games') }}
      v-list-item(
        v-for="([icon, title, to], index) in items"
        :key="index"
        :to="to"
      )
        template(v-slot:prepend)
          v-icon(:icon="icon")
        v-list-item-title {{ title }}

  v-main
    //v-date-picker
    RouterView

  v-footer.flex-grow-0.text-grey-darken-1
    v-row(justify="center" no-gutters)
      span.text-caption © VR Nine 2024 — {{ year }}
</template>


<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { useCommonStore } from '@/store/common'

const { locale, availableLocales } = useI18n()
const commonStore = useCommonStore()
const { xsOnly } = useDisplay()
const theme = computed(() => commonStore.theme)
const localeCurrent = computed({
  get: () => commonStore.locale,
  set: (val) => {
    commonStore.setLocale(val)
  },
})
const drawer = computed({
  get: () => commonStore.drawer,
  set: (val) => {
    commonStore.setDrawer(val)
  },
})
const flat = ref(true)
const items = ref([
  ['custom:crocodile', 'Crocodile', '/games/crocodile'],
  ['mdi-home-outline', 'Test', '/test'],
])
const year = new Date().getFullYear()

locale.value = localeCurrent.value

function switchTheme () {
  commonStore.setTheme(theme.value === 'light' ? 'dark' : 'light')
}
</script>

<style src="@/assets/sass/app.sass" lang="sass" scoped/>
