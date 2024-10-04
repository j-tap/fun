<template lang="pug">
v-app(:theme="commonStore.theme")
  TheHeader

  v-main
    RouterView

  TheFooter
</template>

<script setup>
import TheHeader from '@/components/TheHeader/index.vue'
import TheFooter from '@/components/TheFooter.vue'
import { computed } from 'vue'
import { useCommonStore } from '@/store/common'

const commonStore = useCommonStore()
</script>

<style src="@/assets/sass/app.sass" lang="sass" />
