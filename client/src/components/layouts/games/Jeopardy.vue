<template lang="pug">
v-container(fluid)
  v-card(
    :title="$t('games.jeopardy.title')"
    variant="elevated"
  )
    template(v-slot:prepend)
      v-icon(color="blue" icon="mdi-school-outline")
    template(v-slot:append)
      v-btn(
        color="info"
        variant="text"
        icon="mdi-information-slab-box"
        @click="displayDialogInfo = true"
      )

    slot

  v-dialog(
    v-model="displayDialogInfo"
    transition="dialog-top-transition"
    width="auto"
  )
    v-card
      v-card-title.d-flex.justify-space-between.align-center
        .text-h5.text-medium-emphasis.ps-2 {{ $t('description') }}
        v-btn(
          icon="mdi-close"
          variant="text"
          @click="displayDialogInfo = false"
        )
      v-card-text
        .text-pre-wrap(v-html="$t('games.jeopardy.description')")
</template>

<script setup>
import { ref } from 'vue'
const displayDialogInfo = ref(false)
</script>
