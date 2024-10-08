<template lang="pug">
v-card.question
  v-card-title
    .text-h4.text-medium-emphasis.text-center
      |{{ question.categoryTitle }} {{ question.points }}
  v-card-text.text-center.mt-6.mb-12
    .question__text.mx-auto.text-h6.mb-6 {{ question.title }}
    v-row
      v-col(cols="12" md="6" offset-md="3" )
        v-alert(
          v-if="isDisplayAnswer"
          :text="question.answer"
          :icon="false"
          type="success"
          density="compact"
        )
        v-btn(
          v-else
          :disabled="!isTryAnswered"
          :text="$t('games.jeopardy.answer')"
          color="info"
          variant="outlined"
          size="large"
          @click="isDisplayAnswer = true"
        )

    GamesJeopardyPlayer.d-inline-block.mt-8(
      v-if="player"
      :value="player"
    )

  template(v-slot:actions)
    .d-flex.w-100.justify-space-between.align-center
      v-btn(
        :disabled="!player"
        icon="mdi-thumb-down"
        color="error"
        size="x-large"
        @click.stop="updatePoints(false)"
      )
      v-btn(
        :text="$t('close')"
        variant="plain"
        @click="close"
      )
      v-btn(
        :disabled="!player"
        icon="mdi-thumb-up"
        color="success"
        size="x-large"
        @click.stop="updatePoints(true)"
      )
</template>

<script setup>
import GamesJeopardyPlayer from '@/components/games/jeopardy/Player.vue'
import { ref, watch } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    default: () => ({})
  },
  player: {
    type: Object,
    default: null
  },
  displayAnswer: {
    type: Boolean,
    default: false
  },
})

const emits = defineEmits(['updatePoints', 'close'])
const isTryAnswered = ref(false)
const isDisplayAnswer = ref(props.displayAnswer)

watch(() => props.player, (value) => {
  if (!isTryAnswered.value && value?.token) {
    isTryAnswered.value = true
  }
})

function close () {
  emits('close')
}

function updatePoints (success) {
  emits('updatePoints', { player: props.player, success })
}
</script>

<style lang="sass" scoped>
.question
  &__text
    max-width: 700px
</style>
