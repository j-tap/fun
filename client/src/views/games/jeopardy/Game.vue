<template lang="pug">
section.game-block
  v-card-text.text-center
    v-btn(
      :text="$t('start')"
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
    v-card
      v-card-title.text-h4.text-medium-emphasis.text-center.flex-grow-1.pl-6
        |{{ $t('games.jeopardy.categories_questions') }}
      v-card-text
        table.table-categories
          thead
            tr
              th.text-center.text-blue(
                v-for="(title, ind) in categoriesTitles"
                :key="ind"
              )
                |{{ title }}
          tbody
            tr(
              v-for="(group, ind) in categoriesRows"
              :key="ind"
            )
              td.text-center(
                v-for="question in group"
                :key="question.id"
              )
                v-btn(
                  :text="`${question.points}`"
                  :disabled="question.unavailable"
                  color="info"
                  variant="outlined"
                  @click="selectQuestion(question)"
                )
      template(v-slot:actions)
        v-btn(
          :text="$t('reset')"
          @click="resetQuestions"
        )
        v-spacer
        v-btn(
          :text="$t('close')"
          variant="text"
          @click="displayDialogCategories = false"
        )

  v-dialog(
    v-model="displayDialogQuestion"
    fullscreen
    persistent
  )
    v-card
      v-card-title
        .text-h4.text-medium-emphasis.text-center
          |{{ currentQuestion.categoryTitle }} {{ currentQuestion.points }}
      v-card-text.text-center.mt-6.mb-12
        .text-h6.mb-6 {{ currentQuestion.title }}
        v-row
          v-col(cols="12" md="6" offset-md="3" )
            v-alert(
              v-if="displayAnswer"
              :text="currentQuestion.answer"
              :icon="false"
              type="success"
              density="compact"
            )
            v-btn(
              v-else
              :text="$t('games.jeopardy.answer')"
              color="info"
              @click="displayAnswer = true"
            )

        GamesJeopardyPlayer.d-inline-block.mt-8(:value="currentPlayer")

      template(v-slot:actions)
        v-btn(
          icon="mdi-thumb-down"
          color="error"
          size="x-large"
          @click.stop="updatePointsToPlayer(false)"
        )
        v-spacer
        v-btn(
          icon="mdi-thumb-up"
          color="success"
          size="x-large"
          @click.stop="updatePointsToPlayer(true)"
        )
</template>

<script setup>
import GamesJeopardyPlayer from '@/components/games/jeopardy/Player.vue'
import { computed, ref, watch } from 'vue'
import { useGameJeopardyStore } from '@/store/games/jeopardy.js'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
})

const gameJeopardyStore = useGameJeopardyStore()
const displayDialogCategories = ref(false)
const displayDialogQuestion = ref(false)
const displayAnswer = ref(false)
const categories = computed(() => props.config.items)
const categoriesTitles = computed(() => categories.value.map(o => o.title))
const categoriesRows = computed(() => {
  return categories.value.reduce((grouped, category) => {
    category.questions.forEach(question => {
      const index = (question.points / 100) - 1

      grouped[index] = grouped[index] || []
      grouped[index].push({
        ...question,
        categoryId: category.id,
        categoryTitle: category.title,
        unavailable: gameJeopardyStore.questionsUnavailable.includes(question.id)
      })
    })
    return grouped
  }, [])
})
const players = computed(() => gameJeopardyStore.players)
const currentQuestion = ref(null)
const currentPlayer = ref(null)

watch(displayDialogQuestion, (val) => {
  if (!val) {
    displayAnswer.value = false
  }
})

function selectQuestion (question) {
  currentQuestion.value = { ...question }
  gameJeopardyStore.addQuestionsUnavailable(question.id)
  // TEMP FOR TEST
  currentPlayer.value = players.value[Math.floor(Math.random() * players.value.length)]

  displayDialogQuestion.value = true
}

function updatePointsToPlayer (plus = false) {
  let { points } = currentQuestion.value
  if (!plus) {
    points *= -1
  }
  gameJeopardyStore.addPointsToPlayer(currentPlayer.value, points)
  displayDialogQuestion.value = false
}

function resetQuestions () {
  gameJeopardyStore.clearQuestionsUnavailable()
}

function getPlayerLink ({ token }) {
  return { name: 'game-jeopardy-player', query: { token } }
}
</script>

<style lang="sass" scoped>
.table-categories
  margin-left: auto
  margin-right: auto

  td, th
    padding: 1vw
    text-align: center
    width: clamp(50px, 10vw, 10rem)

    .v-btn
      width: 100%
      min-height: 100%
      padding: 0

  th
    font-weight: 600
    letter-spacing: -.5px
    font-size: clamp(12px, 1.5vw, 1.5rem)

  td
    height: clamp(35px, 7vw, 7rem)

</style>
