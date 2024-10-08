<template lang="pug">
v-card
  v-card-title.text-h4.text-medium-emphasis.text-center.flex-grow-1.pl-6
    |{{ $t('games.jeopardy.categories_questions') }}
  v-card-text
    table.table-categories
      thead
        tr.text-no-wrap
          th.text-center.text-blue(
            v-for="(title, ind) in titles"
            :key="ind"
          ) {{ title }}
      tbody
        tr(
          v-for="(group, ind) in rows"
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
    .d-flex.w-100.justify-space-between.align-center
      v-btn(
        :text="$t('reset')"
        variant="plain"
        @click="resetQuestions"
      )
      v-btn(
        :text="$t('close')"
        variant="plain"
        @click="close"
      )
      .opacity-0 dummy-btn
</template>

<script setup>
import { computed } from 'vue'
import { useGameJeopardyStore } from '@/store/games/jeopardy.js'

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'close',
  'selectQuestion',
])

const gameJeopardyStore = useGameJeopardyStore()
const titles = computed(() => props.categories.map(o => o.title))
const rows = computed(() => getRows(props.categories))

function resetQuestions () {
  gameJeopardyStore.clearQuestionsUnavailable()
}

function close () {
  emit('close')
}

function selectQuestion (quest) {
  emit('selectQuestion', quest)
}

function getRows (arr = []) {
  return arr.reduce((grouped, category) => {
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
}
</script>

<style lang="sass" scoped>
.table-categories
  margin-left: auto
  margin-right: auto

  td, th
    padding: 1vw
    text-align: center
    width: clamp(50px, 14vw, 14rem)

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
