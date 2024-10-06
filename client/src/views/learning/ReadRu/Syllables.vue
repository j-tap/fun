<template lang="pug">
v-container
  |Test
  pre {{ syllables }}
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { strRevert } from '@/utils/common.js'
import useArray from '@/composables/useArray.js'

// const path = '/learning/read-ru'
// const config = ref({})
const { shuffleArray } = useArray()
const syllables = ref([])

onMounted(() => {
  const arr = getSyllables()
  syllables.value = shuffleArray(arr)
})

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
