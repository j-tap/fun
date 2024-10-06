<template lang="pug">
v-app(:theme="commonStore.theme")
  TheHeader

  v-main
    RouterView

  TheFooter
  TheSnackbars
</template>

<script setup>
import TheHeader from '@/components/TheHeader/index.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheSnackbars from '@/components/TheSnackbars.vue'
import { useCommonStore } from '@/store/common'

const commonStore = useCommonStore()
</script>

<style src="@/assets/sass/app.sass" lang="sass" />
