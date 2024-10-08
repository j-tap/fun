<template lang="pug">
LayoutGameJeopardy
  v-card-text.text-center
    GameBlock(
      :config="config"
      :socket="socket"
      :connected="state.connected"
    )

  v-card(
    :disabled="!state.connected"
    :title="$t('players')"
    variant="flat"
  )
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
          GamesJeopardyPlayer(
            :value="player"
            :link="getPlayerLink(player)"
            manage
            @remove="gameJeopardyStore.removePlayer(player)"
          )

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
        v-form(@keydown.enter.stop.prevent="addPlayer")
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
import LayoutGameJeopardy from '@/components/layouts/games/Jeopardy.vue'
import GamesJeopardyPlayer from '@/components/games/jeopardy/Player.vue'
import GameBlock from './Game.vue'
import { computed, ref, watch } from 'vue'
import { inject } from 'vue'
import { useGameJeopardyStore } from '@/store/games/jeopardy.js'
import { genToken } from '@/utils/common.js'
import { useSnackbar } from '@/composables/useSnackbar'
import { useSocketIO } from '@/composables/useSocketIO'

const { socket, state } = useSocketIO(inject('wsUrl'))
const { addSnackbar } = useSnackbar()
const gameJeopardyStore = useGameJeopardyStore()
const path = '/games/jeopardy'
const maxPlayers = 5
const formPlayerModel = { id: 0, token: null, name: null, points: 0, color: null }
const colors = ['red', 'blue', 'purple', 'orange', 'pink', 'cyan', 'indigo', 'amber-deep']
const displayDialogAddPlayer = ref(false)
const config = ref(null)
const formPlayer = ref({ ...formPlayerModel })
const players = computed(() => gameJeopardyStore.players)
const canAddPlayer = computed(() => players.value.length < maxPlayers)

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

function addPlayer () {
  if (
    formPlayer.value.name?.length >= 2 &&
    players.value.findIndex(o => o.name === formPlayer.value.name) === -1 &&
    canAddPlayer.value
  ) {
    const form = { ...formPlayer.value }
    const availableColors = colors.filter(color => players.value.findIndex(o => o.color === color) === -1)
    const name = form.name.trim()

    form.online = false
    form.id = players.value.length + 1
    form.token = genToken()
    form.name = name.charAt(0).toUpperCase() + name.slice(1)
    form.color = availableColors[Math.floor(Math.random() * availableColors.length)]
    gameJeopardyStore.addPlayer(form)
    displayDialogAddPlayer.value = false
    formPlayer.value = { ...formPlayerModel }
  }
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
