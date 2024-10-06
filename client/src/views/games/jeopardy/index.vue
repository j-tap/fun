<template lang="pug">
LayoutGameJeopardy
  v-card-text.text-center
    GamBlock(:config="config")

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
          GamesJeopardyPlayer(
            :value="player"
            :link="getPlayerLink(player)"
            manage
            @remove="gameJeopardyStore.removePlayer(player)"
            @copy=""
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
import LayoutGameJeopardy from '@/components/layouts/games/Jeopardy.vue'
import GamesJeopardyPlayer from '@/components/games/jeopardy/Player.vue'
import GamBlock from './Game.vue'
import { computed, reactive, ref } from 'vue'
import { inject } from 'vue'
import { useGameJeopardyStore } from '@/store/games/jeopardy.js'
import { genToken } from '@/utils/common.js'
import { useSnackbar } from '@/composables/useSnackbar'

const socket = new WebSocket(inject('wsUrl'))
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
const dataWs = {
  admin: true,
  game: 'jeopardy',
  players: players.value,
}

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
})

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({
    ...dataWs,
    type: 'CONNECTION',
  }))
})

socket.addEventListener('message', ({ data }) => {
  const dataObj = JSON.parse(`${data}`)
  players.value.forEach(((o, ind) => {
    const client = dataObj.clients?.find(o => o.token === dataObj.token) || {}
    players.value[ind].online = (client && client.token === o.token)
  }))

  if (dataObj.type === 'CONNECTION') {
    addSnackbar({ message: dataObj.message, type: 'success' })
  }
  else if (dataObj.type === 'CONNECTED_CLIENT') {
    addSnackbar({ message: dataObj.message })
  }
  else if (dataObj.type === 'DISCONNECTED_CLIENT') {
    addSnackbar({ message: dataObj.message })
  }
  else if (dataObj.type === 'READY') {
    addSnackbar({ message: dataObj.message, type: 'success' })
  }
  else if (dataObj.type === 'ERROR') {
    addSnackbar({ message: dataObj.message, type: 'error' })
  }

  console.log('Сообщение от сервера: ', dataObj)
})

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

    socket.send(JSON.stringify({
      ...dataWs,
      type: 'NEW_PLAYER',
      players: players.value,
    }))
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
