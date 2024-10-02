<template lang="pug">
v-container(fluid)
  v-card(
    v-if="config"
    :title="$t('games.jeopardy.title')"
    variant="elevated"
  )
    template(v-slot:prepend)
      v-icon(color="blue" icon="mdi-school-outline")
    template(v-slot:append)
      v-btn(
        color="info"
        variant="text"
        icon="mdi-information-slab-box"
        @click="displayDialogInfo = true"
      )
    v-card-text.text-center
      v-btn(
        :text="$t('start')"
        color="primary"
        size="large"
        @click="displayDialogCategories = true"
      )

    v-card(:title="$t('players')")
      template(v-slot:append)
        v-btn(
          :disabled="!canAddPlayer"
          icon="mdi-plus"
          variant="text"
          color="info"
          @click="displayDialogAddPlayer = true"
        )
      v-card-text
        v-row
          v-col(
            v-for="(player, index) in players"
            :key="index"
            cols="12" sm="6" md="4" lg="3" xl="2"
          )
            GamesJeopardyPlayer(:value="player" manage)

  v-dialog(
    v-model="displayDialogCategories"
    fullscreen
    persistent
  )
    v-card
      v-card-title.text-h4.text-medium-emphasis.text-center.flex-grow-1.pl-6
        |{{ $t('games.jeopardy.categories_questions') }}
      v-card-text
        table.mx-auto
          thead
            tr
              th.pa-4.text-center(
                v-for="(title, ind) in categoriesTitles"
                :key="ind"
              )
                .text-h6.text-blue {{ title }}
          tbody
            tr(
              v-for="(group, ind) in categoriesRows"
              :key="ind"
            )
              td.pa-4.text-center(
                v-for="question in group"
                :key="question.id"
              )
                v-btn(
                  :text="`${question.points}`"
                  :disabled="question.unavailable"
                  color="info"
                  variant="outlined"
                  size="x-large"
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
      v-card-text.text-center
        .text-h6.mt-6.mb-12 {{ currentQuestion.title }}
        GamesJeopardyPlayer.d-inline-block(:value="currentPlayer")

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

  v-dialog(
    v-model="displayDialogInfo"
    transition="dialog-top-transition"
    width="auto"
  )
    v-card
      v-card-title.d-flex.justify-space-between.align-center
        .text-h5.text-medium-emphasis.ps-2 {{ $t('description') }}
        v-btn(
          icon="mdi-close"
          variant="text"
          @click="displayDialogInfo = false"
        )
      v-card-text
        .text-pre-wrap(v-html="$t('games.jeopardy.description')")

  v-dialog(
    v-if="canAddPlayer"
    v-model="displayDialogAddPlayer"
    transition="dialog-top-transition"
    width="auto"
    min-width="400"
  )
    v-card
      v-card-title.d-flex.justify-space-between.align-center
        .text-h5.text-medium-emphasis.ps-2 {{ $t('add_player') }}
        v-btn(
          icon="mdi-close"
          variant="text"
          @click="displayDialogAddPlayer = false"
        )
      v-card-text
        v-form
          v-text-field(
            v-model="formPlayer.name"
            :label="$t('player_name')"
            variant="outlined"
            hide-details
            required
            autofocus
          )
      v-card-actions
        v-spacer
        v-btn(
          :text="$t('save')"
          color="success"
          @click="addPlayer"
        )
</template>

<script setup>
import GamesJeopardyPlayer from '@/components/games/jeopardy/Player.vue'
import { computed, ref } from 'vue'
import { useGameJeopardyStore } from '@/store/games/jeopardy'

const gameJeopardyStore = useGameJeopardyStore()
const path = '/games/jeopardy'
const maxPlayers = 5
const formPlayerModel = { id: 0, name: null, points: 0, color: null }
const colors = ['red', 'green', 'blue', 'purple', 'orange', 'pink', 'cyan', 'indigo', 'amber-deep']
const displayDialogCategories = ref(false)
const displayDialogQuestion = ref(false)
const displayDialogInfo = ref(false)
const displayDialogAddPlayer = ref(false)
const config = ref(null)
const categories = ref([])
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
const formPlayer = ref({ ...formPlayerModel })
const players = computed(() => gameJeopardyStore.players)
const canAddPlayer = computed(() => players.value.length < maxPlayers)
const currentQuestion = ref(null)
const currentPlayer = ref(null)

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
  categories.value = config.value?.items
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

function addPlayer () {
  if (
    formPlayer.value.name?.length >= 2 &&
    players.value.findIndex(o => o.name === formPlayer.value.name) === -1 &&
    canAddPlayer.value
  ) {
    const form = { ...formPlayer.value }
    const availableColors = colors.filter(color => players.value.findIndex(o => o.color === color) === -1)
    const name = form.name.trim()

    form.id = players.value.length + 1
    form.name = name.charAt(0).toUpperCase() + name.slice(1)
    form.color = availableColors[Math.floor(Math.random() * availableColors.length)]
    gameJeopardyStore.addPlayer(form)
    displayDialogAddPlayer.value = false
    formPlayer.value = { ...formPlayerModel }
  }
}

function resetQuestions () {
  gameJeopardyStore.clearQuestionsUnavailable()
}
</script>

<style lang="sass" scoped>

</style>
