<template lang="pug">
.dev-content(v-if="isDev")
  slot
</template>

<script setup>
import { useStorage } from '@vueuse/core'

const isDev = useStorage('dev', false)
</script>
