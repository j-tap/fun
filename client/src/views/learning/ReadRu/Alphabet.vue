<template lang="pug">
v-container(max-width="340")
  v-card.mx-auto(
    :key="letterCard.key"
    v-touch="{ left: () => getPrevCard, right: () => getNextCard }"
    @click="!settings.display_img ? letterCard.isDisplayImg = !letterCard.isDisplayImg : undefined"
  )
    v-img.align-end(
      :src="letterCard.isDisplayImg ? letterCard.src : ''"
      aspect-ratio="1"
      gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.8)"
      cover
    )
      v-card-actions.align-end
        .text-h1.font-weight-bold(:class="`text-${letterCard.color}`")
          span.text-uppercase {{ letterCard.letter }}
          span.text-lowercase {{ letterCard.letter }}
        v-spacer
        v-btn(
          :icon="letterCard.isPlaying ? 'mdi-stop' : 'mdi-play'"
          color="green"
          variant="outlined"
          @click.stop="togglePlay"
        )
  .d-flex.flex-center.my-4
    v-btn(
      :text="$t('prev')"
      color="orange"
      size="large"
      @click.stop="getPrevCard"
    )
    v-spacer
    v-btn(
      :text="$t('next')"
      color="orange"
      size="large"
      @click.stop="getNextCard"
    )
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import useArray from '@/composables/useArray.js'
import { useLearningReadRuStore } from '@/store/learning/readRu.js'

const { shuffleArray } = useArray()
const learningReadRuStore = useLearningReadRuStore()
const resourcesUrl = '/learning/read-ru'
const audioUrl = `${resourcesUrl}/sounds/`
const imgUrl = `${resourcesUrl}/images/`
const vowels = 'аеёиоуыэюя'.split('')
const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('')
const alphabetList = ref([])
const letterCard = ref({})
const counter = ref(0)
const settings = computed(() => learningReadRuStore.settings)

watch(() => settings.value.shuffle, () => {
  counter.value = 0
  printCard()
})

watch(() => settings.value.display_img, (val) => {
  letterCard.value.isDisplayImg = val
})

onMounted(() => {
  printCard()
})

function printCard () {
  alphabetList.value = getAlphabet()
  getNewLetterCard()
}

function getNextCard () {
  counter.value++
  getNewLetterCard()
}

function getPrevCard () {
  counter.value--
  getNewLetterCard()
}

function getNewLetterCard () {
  if (counter.value < 0 || counter.value === alphabetList.value.length) {
    counter.value = 0
    alphabetList.value = getAlphabet()
  }

  const letter = alphabetList.value[counter.value]

  letterCard.value = {
    letter,
    color: vowels.includes(letter) ? 'red-lighten-2' : 'blue-lighten-2',
    src: `${imgUrl}${letterToNumber(letter)}.webp`,
    key: `${counter.value}-${letter}`,
    isVowel: vowels.includes(letter),
    audio: new Audio(`${audioUrl}${letter}.aac`),
    isPlaying: false,
    isDisplayImg: settings.value.display_img,
  }

  if (settings.value.voice) {
    letterCard.value.audio.play()
  }
}

function getAlphabet () {
  return settings.value.shuffle ? shuffleArray(alphabet) : alphabet
}

function togglePlay () {
  const { audio, isPlaying } = letterCard.value

  if (!isPlaying.value) {
    audio.play()
    letterCard.value.isPlaying = true
    audio.addEventListener('ended', () => {
      letterCard.value.isPlaying = false;
    }, { once: true })
  }
  else {
    audio.pause()
    audio.currentTime = 0
    letterCard.value.isPlaying = false
  }
}

function letterToNumber(letter = '') {
  return alphabet.findIndex(l => l === letter.toLowerCase()) + 1
}
</script>
