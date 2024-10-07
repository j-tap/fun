<template lang="pug">
v-app-bar(
  color="appBar"
  scroll-behavior="hide"
)
  template(v-slot:image)
    v-img.opacity-30(src="/img/header-bg.webp" cover)
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
    v-list-subheader.text-uppercase.text-grey
      v-icon.me-2(size="x-small" icon="mdi-gamepad-variant-outline")
      | {{ $t('games') }}
    v-divider
    DrawerMenuItems(:items="menuGames")
    v-divider
    v-list-subheader.text-uppercase.text-grey
      v-icon.me-2(size="x-small" icon="mdi-school-outline")
      | {{ $t('learning') }}
    v-divider
    DrawerMenuItems(:items="menuLearning")
</template>

<script setup>
import DrawerMenuItems from './DrawerMenuItems.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useCommonStore } from '@/store/common.js'
import menuGames from '@/config/menuGames.js'
import menuLearning from '@/config/menuLearning.js'

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

locale.value = localeCurrent.value

function switchTheme () {
  commonStore.setTheme(theme.value === 'light' ? 'dark' : 'light')
}
</script>
