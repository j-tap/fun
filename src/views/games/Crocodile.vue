<template lang="pug">
v-container(fluid)
  v-card(
    v-if="config"
    :title="$t('games.crocodile.title')"
    variant="elevated"
    prepend-icon="custom:crocodile"
  )
    v-card-text.mt-6
      v-row(justify="center")
        v-col(cols="12" sm="6" md="5" lg="4")
          .d-flex.justify-center
            v-btn(color="success" @click="getItem") {{ $t('new_task') }}
          .text-h4.text-center.mt-4 {{ item?.titles[locale] }}
          v-img.mt-2(
            v-if="item"
            :src="item.src"
            :alt="name"
            rounded
          )

    v-card-text
      v-expansion-panels
        v-expansion-panel
          v-expansion-panel-title {{ $t('description') }}
          v-expansion-panel-text
            .text-pre-wrap(v-html="$t('games.crocodile.description')")
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useArray from '@/composables/useArray.js'

const { locale } = useI18n()
const { shuffleArray } = useArray()
const path = '/games/crocodile'
const config = ref(null)
const item = ref(null)
const items = ref([])
let counter = 0

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
  items.value = shuffleArray(config.value?.items)
})

function getItem () {
  if (counter >= items.value.length) {
    items.value = shuffleArray(config.value.items)
    counter = 0
  }

  const info = items.value[counter]
  counter++

  item.value = {
    ...info,
    src: `${path}/images/${info.name}.webp`,
  }
}
</script>

<style src="@/assets/sass/views/games/crocodile.sass" lang="sass" scoped/>
