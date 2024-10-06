<template lang="pug">
CardInfo(
  outlined
  @prev="getPrevCard"
  @next="getNextCard"
)
  .d-flex.justify-center.ga-3
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
</template>

<script setup>
import CardInfo from '@/components/CardInfo/index.vue'
import { computed, onMounted, ref } from 'vue'

const path = '/learning/read-ru'
const config = ref(null)
const currentCard = ref({ word: [] })
const counter = ref(0)
const words = computed(() => config.value?.words || [])

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
  getCard()
})

function getNextCard () {
  counter.value++
  getCard()
}

function getPrevCard () {
  counter.value--
  getCard()
}

function getCard () {
  if (counter.value >= words.value.length) {
    counter.value = 0
  }
  else if (counter.value < 0) {
    counter.value = words.value.length - 1
  }

  currentCard.value = {
    word: words.value[counter.value],
  }
}
</script>
