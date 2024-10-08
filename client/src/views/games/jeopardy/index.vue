<template lang="pug">
LayoutGameJeopardy
  v-card-text.text-center
    GamesJeopardyBlock(
      :config="config"
      :socket="socket"
      :connected="state.connected"
    )

  GamesJeopardyPlayers(
    :players="players"
    :connected="state.connected"
  )
</template>

<script setup>
import LayoutGameJeopardy from '@/components/layouts/games/Jeopardy.vue'
import GamesJeopardyPlayers from '@/components/games/jeopardy/Players.vue'
import GamesJeopardyBlock from '@/components/games/jeopardy/Game.vue'
import { computed, ref, watch } from 'vue'
import { inject } from 'vue'
import { useGameJeopardyStore } from '@/store/games/jeopardy.js'
import { useSnackbar } from '@/composables/useSnackbar'
import { useSocketIO } from '@/composables/useSocketIO'

const { socket, state } = useSocketIO(inject('wsUrl'))
const { addSnackbar } = useSnackbar()
const gameJeopardyStore = useGameJeopardyStore()
const path = '/games/jeopardy'
const config = ref(null)
const players = computed(() => gameJeopardyStore.players)

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
})

watch(players, (value) => {
  socket.emit('update_players', { game: 'jeopardy', players: value })
}, { deep: true })

socket.connect()

socket.emit('join_admin', {
  admin: true,
  game: 'jeopardy',
  players: players.value,
})

socket.on('joined', () => {
  addSnackbar({ message: 'Вы присоединились', type: 'success' })
})

socket.on('joined_player', ({ client, tokens }) => {
  addSnackbar({ message: `Игрок ${client.player?.name} присоединился` })
  updatePlayers(tokens)
})

socket.on('error', ({ message }) => {
  addSnackbar({ message, type: 'error' })
})

socket.on('left_player', ({ token, player, tokens }) => {
  const message = player?.name ? `Игрок ${player.name} отключился` : `Игрок ${token} удалён`
  addSnackbar({ message, type: 'warning' })
  updatePlayers(tokens)
})

function updatePlayers (tokens) {
  players.value.forEach((player, ind) => {
    players.value[ind].online = tokens.includes(player.token)
  })
}
</script>
