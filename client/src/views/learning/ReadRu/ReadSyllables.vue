<template lang="pug">
section.read-syllables
  v-card.mx-auto(
    variant="outlined"
    max-width="340"
  )
    v-card-text.d-flex.justify-center.ga-3
      v-hover(
        v-for="(syllable, ind) in currentCard.word"
        :key="ind"
      )
        template(v-slot:default="{ isHovering, props }")
          span.text-h2.font-weight-bold.select-none(
            v-bind="props"
            :class="{ 'text-red-darken-3': isHovering }"
            v-text="syllable"
          )

  .text-center.my-4
    v-btn(
      :text="$t('next')"
      color="orange"
      size="large"
      @click="getCard"
    )
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const path = '/learning/read-ru'
const config = ref(null)
const currentCard = ref({ word: [] })
const indexWord = ref(0)
const words = computed(() => config.value?.words || [])

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
  getCard()
})

function getCard () {
  if (indexWord.value >= words.value.length) {
    indexWord.value = 0
  }

  currentCard.value = {
    word: words.value[indexWord.value],
  }

  indexWord.value++
}
</script>
