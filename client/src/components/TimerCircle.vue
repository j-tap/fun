<template lang="pug">
v-progress-circular(
  :model-value="value"
  :rotate="360"
  :size="80"
  :width="3"
)
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  seconds: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['stop'])

let interval = null
const step = 10
const startTime = ref(null)
const value = ref(100)
const timeLeft = ref(props.seconds)
const audio = new Audio('/games/jeopardy/sounds/time-over.aac')

onMounted(() => {
  if (props.seconds > 0) {
    startTime.value = Date.now()
    interval = setInterval(updateTime, 100)
  }
})

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval)
  }
})

function updateTime() {
  const elapsed = (Date.now() - startTime.value) / 1000
  timeLeft.value = Math.max(0, (props.seconds - elapsed).toFixed(2))
  value.value = getPercent(timeLeft.value)

  if (timeLeft.value <= .01) {
    clearInterval(interval)
    stop()
  }
}

function getPercent (val) {
  return val > 0 ? val / props.seconds * 100 : 0
}

function stop () {
  audio.play()
  emit('stop')
}
</script>
