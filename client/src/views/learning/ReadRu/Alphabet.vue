<template lang="pug">
CardInfo(
  :src="letterCard.isDisplayImg ? letterCard.src : ''"
  :key="letterCard.key"
  @prev="getPrevCard"
  @next="getNextCard"
  @click="!settings.display_img ? letterCard.isDisplayImg = !letterCard.isDisplayImg : undefined"
)
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
</template>

<script setup>
import CardInfo from '@/components/CardInfo/index.vue'
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
  getCard()
}

function getNextCard () {
  counter.value++
  getCard()
}

function getPrevCard () {
  counter.value--
  getCard()
}

function getCard () {
  if (counter.value >= alphabetList.value.length) {
    counter.value = 0
  }
  else if (counter.value < 0) {
    counter.value = alphabetList.value.length - 1
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
