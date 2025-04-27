<template lang="pug">
v-card.question.text-center
  v-card-title
    .text-h4.text-medium-emphasis.pt-4
      |{{ question.categoryTitle }} {{ question.points }}

  v-card-text.mt-6.mb-12
    v-img.cursor-pointer(
      v-show="isDisplayImage"
      :src="question.image"
      max-height="65vh"
      @click="isDisplayImage = false"
    )
    div(v-show="!isDisplayImage")
      .mb-6
        .question__text.mx-auto.text-h6 {{ question.title }}
        v-img.cursor-pointer.mt-4(
          v-if="question.image"
          :src="question.image"
          max-width="400"
          max-height="260"
          class="mx-auto"
          @click="isDisplayImage = true"
        )
      v-row
        v-col(cols="12" md="6" offset-md="3" )
          v-alert(
            v-if="isDisplayAnswer"
            :text="question.answer"
            :icon="false"
            variant="tonal"
            type="success"
          )
          v-btn(
            v-else
            :disabled="!isTryAnswered"
            :text="$t('games.jeopardy.answer')"
            color="info"
            variant="outlined"
            @click="isDisplayAnswer = true"
          )

      template(v-if="player")
        GamesJeopardyPlayer.d-inline-block.mt-12(:value="player")
        TimerCircle.my-6(
          :seconds="10"
          @stop="timerAnswerStop"
        )
      TimerCircle.my-6(
        v-else
        :seconds="15"
        @stop="timerAwaitStop"
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
import TimerCircle from '@/components/TimerCircle.vue'
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
const isDisplayImage = ref(false)
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

function timerAnswerStop () {
  // действия если игрок не успел ответить
}

function timerAwaitStop () {
  isTryAnswered.value = true
}
</script>

<style lang="sass" scoped>
.question
  &__text
    max-width: 700px
</style>
