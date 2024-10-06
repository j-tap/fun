<template lang="pug">
LayoutGameJeopardy
  v-card
    v-card-text
      .d-flex.justify-center
        .text-h4 {{ player.name }}
      .d-flex.justify-center.ma-6
        v-btn(
          color="success"
          variant="outlined"
          size="x-large"
          @click="sendReady"
        )
          | Ответить
</template>

<script setup>
import LayoutGameJeopardy from '@/components/layouts/games/Jeopardy.vue'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar.js'

const route = useRoute()
const socket = new WebSocket(inject('wsUrl'))
const { addSnackbar } = useSnackbar()
const { token } = route.query
const player = ref({})
const dataWs = {
  game: 'jeopardy',
  token,
}

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({
    ...dataWs,
    type: 'CONNECTION',
  }))
})

socket.addEventListener('message', ({ data }) => {
  const dataObj = JSON.parse(`${data}`);

  // Проверяем тип сообщения
  if (dataObj.type === 'CONNECTION') {
    player.value = {
      ...player.value,
      ...dataObj.player,
    }
    addSnackbar({ message: 'Соединение установлено', type: 'success' })
  }
  else if (dataObj.type === 'READY') {
    console.log('Ответ на READY:', dataObj);
    addSnackbar({ message: 'Вы отвечаете', type: 'success' })
  }
  else if (dataObj.type === 'ERROR') {
    addSnackbar({ message: dataObj.message, type: 'error' })
  }

  console.log('Сообщение от сервера: ', dataObj);
});


function sendReady () {
  socket.send(JSON.stringify({
    ...dataWs,
    type: 'READY',
    player: player.value,
  }))
}
</script>

<style lang="sass" scoped>

</style>
