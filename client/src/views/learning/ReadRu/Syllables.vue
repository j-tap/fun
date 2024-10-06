<template lang="pug">
CardInfo(
  outlined
  @prev="getPrevCard"
  @next="getNextCard"
)
  .d-flex.justify-center.ga-3
    v-hover(
      v-for="(letter, ind) in cardCurrent.syllable"
      :key="ind"
    )
      template(v-slot:default="{ isHovering, props }")
        .text-h2.font-weight-bold.select-none(
          v-bind="props"
          :class="{ 'text-red-darken-3': isHovering }"
          v-text="letter"
        )
</template>

<script setup>
import CardInfo from '@/components/CardInfo/index.vue'
import { onMounted, ref } from 'vue'
import { strRevert } from '@/utils/common.js'
import useArray from '@/composables/useArray.js'

// const path = '/learning/read-ru'
// const config = ref({})
const { shuffleArray } = useArray()
const syllables = ref([])
const counter = ref(0)
const cardCurrent = ref({})

onMounted(() => {
  const arr = getSyllables()
  syllables.value = shuffleArray(arr)
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
  if (counter.value >= syllables.value.length) {
    counter.value = 0
  }
  else if (counter.value < 0) {
    counter.value = syllables.value.length - 1
  }

  cardCurrent.value = {
    syllable: syllables.value[counter.value],
  }
}

function getSyllables () {
  const result = []
  const vow = 'ьауоеыиэяёю'
  const variants = {
    'б': vow,
    'в': vow,
    'г': 'ьауоеиэя',
    'д': vow,
    'ж': 'ьауоеи',
    'з': vow,
    'к': 'ьауоеиэ',
    'л': 'ьауоеыияёю',
    'м': vow,
    'н': vow,
    'п': vow,
    'р': vow,
    'с': vow,
    'т': vow,
    'ф': 'ьауоеиыё',
    'х': 'ьауоеиэ',
    'ц': 'аиеуыо',
    'ч': 'ьауоеи',
    'ш': 'ьауоеи',
    'щ': 'ьауоеи',
  }

  for (const ind in variants) {
    const vowels = variants[ind]

    for (const vowel of vowels) {
      result.push(ind + vowel)
    }
  }

  for (const ind in result) {
    const syllable = result[ind]

    if (!syllable.includes('ь')) {
      result.push(strRevert(syllable))
    }
  }

  return result
}
</script>
