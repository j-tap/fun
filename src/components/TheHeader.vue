<template lang="pug">
v-app-bar(
  color="appBar"
  scroll-behavior="hide"
)
  template(v-slot:image)
    v-img.opacity-20(src="/img/header-bg.webp" cover)
  template(v-slot:append)
    v-app-bar-nav-icon(variant="text" @click.stop="drawer = !drawer")
  v-toolbar-title
    router-link.d-flex.align-center.text-primary.no-link(to="/")
      v-icon.mr-2(size="sm") mdi-emoticon-outline
      span.text-button.font-weight-black FUN

  v-spacer
  v-select.flex-grow-0.pb-2(
    v-model="localeCurrent"
    :items="availableLocales"
    density="compact"
    prepend-inner-icon="mdi-web"
    variant="plain"
    hide-details
  )
  v-btn(
    :icon="$vuetify.theme.current.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    slim
    @click="switchTheme"
  )

v-navigation-drawer(
  v-model="drawer"
  location="right"
  temporary
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
      v-list-item-title {{ $t(title) }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useCommonStore } from '@/store/common'
import menuGames from '@/config/menuGames'

const { availableLocales, locale } = useI18n()
const commonStore = useCommonStore()

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

const items = computed(() => menuGames)

locale.value = localeCurrent.value

function switchTheme () {
  commonStore.setTheme(theme.value === 'light' ? 'dark' : 'light')
}
</script>
