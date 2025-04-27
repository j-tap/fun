<template lang="pug">
CardInfo(
  :src="cardCurrent.isDisplayImg ? cardCurrent.src : ''"
  :key="cardCurrent.key"
  @prev="getPrevCard"
  @next="getNextCard"
  @click="!settings.display_img ? cardCurrent.isDisplayImg = !cardCurrent.isDisplayImg : undefined"
)
  .text-h1.font-weight-bold(:class="`text-${cardCurrent.color}`")
    span.text-uppercase {{ cardCurrent.letter }}
    span.text-lowercase {{ cardCurrent.letter }}
  v-spacer
  v-btn(
    :icon="cardCurrent.isPlaying ? 'mdi-stop' : 'mdi-play'"
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
const cardCurrent = ref({})
const counter = ref(0)
const settings = computed(() => learningReadRuStore.settings)

watch(() => settings.value.shuffle, () => {
  counter.value = 0
  printCard()
})

watch(() => settings.value.display_img, (val) => {
  cardCurrent.value.isDisplayImg = val
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

  cardCurrent.value = {
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
    cardCurrent.value.audio.play()
  }
}

function getAlphabet () {
  return settings.value.shuffle ? shuffleArray(alphabet || []) : alphabet
}

function togglePlay () {
  const { audio, isPlaying } = cardCurrent.value

  if (!isPlaying.value) {
    audio.play()
    cardCurrent.value.isPlaying = true
    audio.addEventListener('ended', () => {
      cardCurrent.value.isPlaying = false;
    }, { once: true })
  }
  else {
    audio.pause()
    audio.currentTime = 0
    cardCurrent.value.isPlaying = false
  }
}

function letterToNumber(letter = '') {
  return alphabet.findIndex(l => l === letter.toLowerCase()) + 1
}
</script>
