<template lang="pug">
.players
  v-card(
    :disabled="!connected"
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
            @remove="removePlayer"
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
import GamesJeopardyPlayer from '@/components/games/jeopardy/Player.vue'
import { computed, ref } from 'vue'
import { genToken } from '@/utils/common'
import { useGameJeopardyStore } from '@/store/games/jeopardy'

const props = defineProps({
  players: {
    type: Array,
    default: () => [],
  },
  connected: {
    type: Boolean,
    default: false,
  },
})

const gameJeopardyStore = useGameJeopardyStore()
const maxPlayers = 5
const colors = ['red', 'blue', 'purple', 'orange', 'pink', 'cyan', 'indigo', 'amber-deep']
const formPlayerModel = { id: 0, token: null, name: null, points: 0, color: null }
const displayDialogAddPlayer = ref(false)
const formPlayer = ref({ ...formPlayerModel })
const canAddPlayer = computed(() => props.players.length < maxPlayers)

function addPlayer () {
  const { name } = formPlayer.value

  if (!name || name?.trim().length < 2 || props.players.some(o => o.name === name) || !canAddPlayer.value) {
    return
  }

  const form = generatePlayer(formPlayer.value)

  gameJeopardyStore.addPlayer(form)
  displayDialogAddPlayer.value = false
  formPlayer.value = { ...formPlayerModel }
}

function generatePlayer ({ name }) {
  const availableColors = colors.filter(color => !props.players.some(o => o.color === color))

  return {
    ...formPlayer.value,
    online: false,
    id: props.players.length + 1,
    token: genToken(),
    name: name.trim().replace(/^\w/, c => c.toUpperCase()),
    color: availableColors[Math.floor(Math.random() * availableColors.length)],
  }
}

function removePlayer (player) {
  gameJeopardyStore.removePlayer(player)
}

function getPlayerLink ({ token }) {
  return { name: 'game-jeopardy-player', query: { token } }
}
</script>

<style lang="sass" scoped>
</style>
