<template lang="pug">
section.game-block
  v-card-text.text-center
    v-btn(
      :text="$t('start')"
      :disabled="!connected"
      color="info"
      size="x-large"
      variant="outlined"
      @click="displayDialogCategories = true"
    )

  v-dialog(
    v-model="displayDialogCategories"
    fullscreen
    persistent
  )
    GameCategories(
      :categories="randomCategories"
      @select-question="selectQuestion"
      @close="displayDialogCategories = false"
    )

  v-dialog(
    v-model="displayDialogQuestion"
    fullscreen
    persistent
  )
    GameQuestion(
      :player="currentPlayer"
      :question="currentQuestion"
      :display-answer="displayAnswer"
      @update-points="updatePointsToPlayer"
      @close="displayDialogQuestion = false"
    )
</template>

<script setup>
import GameCategories from './Categories.vue'
import GameQuestion from './Question.vue'
import { onMounted, ref, watch } from 'vue'
import { useGameJeopardyStore } from '@/store/games/jeopardy'
import useArray from '@/composables/useArray'

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  socket: {
    type: Object,
    default: () => ({}),
  },
  connected: {
    type: Boolean,
    default: false,
  },
})

const { shuffleArray } = useArray()
const gameJeopardyStore = useGameJeopardyStore()
const displayDialogCategories = ref(false)
const displayDialogQuestion = ref(false)
const displayAnswer = ref(false)
const currentQuestion = ref(null)
const currentPlayer = ref(null)
const randomCategories = shuffleArray(props.connected || []).slice(0, 5)

watch(displayDialogQuestion, (val) => {
  if (val) {
    emitQuest()
  }
  else {
    displayAnswer.value = false
    setCurrentPlayer()
  }
})

props.socket.on('player_quested', ({ player }) => {
  setCurrentPlayer(player)
})

function selectQuestion (question) {
  currentQuestion.value = { ...question }
  gameJeopardyStore.addQuestionsUnavailable(question.id)
  displayDialogQuestion.value = true
}

function updatePointsToPlayer ({ success }) {
  let { points } = currentQuestion.value

  if (!success) {
    points *= -1
  }

  gameJeopardyStore.addPointsToPlayer(currentPlayer.value, points)

  if (success) {
    displayDialogQuestion.value = false
  }
  else {
    setCurrentPlayer()
    emitQuest()
  }
}

function emitQuest () {
  props.socket.emit('new_quest', { game: 'jeopardy', quest: currentQuestion.value })
}

function setCurrentPlayer (value = null) {
  currentPlayer.value = value
}
</script>

<style lang="sass" scoped>
</style>
