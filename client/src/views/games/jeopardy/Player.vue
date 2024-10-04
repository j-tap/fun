<template lang="pug">
LayoutGameJeopardy
  v-card
    v-card-text TEST
</template>

<script setup>
import LayoutGameJeopardy from '@/components/layouts/games/Jeopardy.vue'
import { inject } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const socket = new WebSocket(inject('wsUrl'))
const { token } = route.query
const dataJson = JSON.stringify({
  game: 'jeopardy',
  token,
})

socket.addEventListener('open', () => {
  console.info('Соединение установлено')
  socket.send(dataJson)
})

socket.addEventListener('message', (event) => {
  console.log('Сообщение от сервера: ', event.data)
})
</script>

<style lang="sass" scoped>

</style>
