<template lang="pug">
v-snackbar-queue(
  v-model="snackbars"
  location="bottom right"
)
</template>

<script setup>
import { VSnackbarQueue } from 'vuetify/components'
import { useSnackbar } from '@/composables/useSnackbar'

const { snackbars } = useSnackbar()
</script>

<style lang="sass" scoped>
</style>
