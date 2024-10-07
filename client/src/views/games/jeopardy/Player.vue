<template lang="pug">
LayoutGameJeopardy
  v-card
    v-card-text
      v-row.justify-center
        v-col(cols="12" sm="6" md="4" lg="3" xl="2")
          GamesJeopardyPlayer(:value="player")

      .d-flex.justify-center.ma-6
        v-btn(
          v-if="player?.token"
          color="success"
          variant="outlined"
          size="x-large"
          @click="sendReady"
        )
          | Ответить
</template>

<script setup>
import LayoutGameJeopardy from '@/components/layouts/games/Jeopardy.vue'
import GamesJeopardyPlayer from '@/components/games/jeopardy/Player.vue'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { useSocketIO } from '@/composables/useSocketIO'

const route = useRoute()
const { socket } = useSocketIO(inject('wsUrl'))
const { addSnackbar } = useSnackbar()
const { token } = route.query
const player = ref({})

socket.connect()

socket.emit('join_player', {
  game: 'jeopardy',
  token,
})

socket.on('joined', (data) => {
  player.value = { ...data.player, online: true }
  addSnackbar({ message: 'Вы присоединились', type: 'success' })
})

socket.on('can_ready', () => {
  addSnackbar({ message: 'Вы можете отвечать', type: 'success' })
})

socket.on('updated_player', (playerData) => {
  player.value = playerData
})

socket.on('error', ({ message }) => {
  addSnackbar({ message, type: 'error' })
})

// socket.addEventListener('message', ({ data }) => {
//   const dataObj = JSON.parse(`${data}`);
//
//   // Проверяем тип сообщения
//   if (dataObj.type === 'CONNECTION') {
//     player.value = {
//       ...player.value,
//       ...dataObj.player,
//     }
//     addSnackbar({ message: 'Соединение установлено', type: 'success' })
//   }
//   else if (dataObj.type === 'READY') {
//     console.log('Ответ на READY:', dataObj);
//     addSnackbar({ message: 'Вы отвечаете', type: 'success' })
//   }
//   else if (dataObj.type === 'ERROR') {
//     addSnackbar({ message: dataObj.message, type: 'error' })
//   }
//
//   console.log('Сообщение от сервера: ', dataObj);
// });


function sendReady () {
  socket.emit('player_ready', {
    game: 'jeopardy',
    player: player.value,
    token,
  })
}
</script>

<style lang="sass" scoped>

</style>
