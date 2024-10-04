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
import { computed, ref } from 'vue'
import { inject } from 'vue'
import { useGameJeopardyStore } from '@/store/games/jeopardy.js'
import { genToken } from '@/utils/common.js'

const socket = new WebSocket(inject('wsUrl'))
const gameJeopardyStore = useGameJeopardyStore()
const path = '/games/jeopardy'
const maxPlayers = 5
const formPlayerModel = { id: 0, token: null, name: null, points: 0, color: null }
const colors = ['red', 'green', 'blue', 'purple', 'orange', 'pink', 'cyan', 'indigo', 'amber-deep']
const displayDialogAddPlayer = ref(false)
const config = ref(null)
const formPlayer = ref({ ...formPlayerModel })
const players = computed(() => gameJeopardyStore.players)
const canAddPlayer = computed(() => players.value.length < maxPlayers)

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
})

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({
    admin: true,
    game: 'jeopardy',
  }))
})

socket.addEventListener('message', (event) => {
  console.log('Сообщение от сервера: ', event.data, event)
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
