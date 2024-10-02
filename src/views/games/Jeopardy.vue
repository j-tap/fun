<template lang="pug">
v-container(fluid)
  v-card(
    v-if="config"
    :title="$t('games.jeopardy.title')"
    variant="elevated"
  )
    template(v-slot:prepend)
      v-icon(color="blue" icon="mdi-school-outline")
    template(v-slot:append)
      v-btn(
        color="info"
        variant="text"
        icon="mdi-information-slab-box"
        @click="displayDialogInfo = true"
      )
    v-card-text
      // Сетка категорий
      v-row
        v-col(cols="2" v-for="category in categories" :key="category.id")
          v-card(class="text-center" outlined @click="selectCategory(category)")
            v-card-title.text-center {{ category.title }}

      // Сетка вопросов
      v-row
        v-col(cols="2" v-for="(question, index) in category?.questions" :key="index")
          v-card(class="text-center" outlined)
            v-card-title {{ question.points }} points
            v-card-actions
              v-btn(color="primary" @click="selectQuestion(category, question)") Select Question

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
          v-col(v-for="(player, index) in players" :key="index" cols="12" sm="6" md="4" lg="3" xl="2")
            v-hover
              template(v-slot:default="{ isHovering, props }")
                v-card(
                  v-bind="props"
                  :title="player.name"
                  color="info"
                  variant="outlined"
                )
                  template(v-slot:prepend)
                    v-icon(:color="player.color" size="x-large" ) mdi-account
                  template(v-slot:subtitle)
                    span {{ $t('points') }}:
                    b {{ player.points }}
                  template(v-slot:append)
                    v-fade-transition
                      v-btn(
                        v-show="isHovering"
                        icon="mdi-delete-forever-outline"
                        color="error"
                        variant="text"
                        @click="gameJeopardyStore.removePlayer(index)"
                      )

  v-dialog(
    v-model="displayDialogInfo"
    transition="dialog-top-transition"
    width="auto"
  )
    v-card
      v-card-title.d-flex.justify-space-between.align-center
        .text-h5.text-medium-emphasis.ps-2 {{ $t('description') }}
        v-btn(
          icon="mdi-close"
          variant="text"
          @click="displayDialogInfo = false"
        )
      v-card-text
        .text-pre-wrap(v-html="$t('games.jeopardy.description')")

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
import { computed, ref } from 'vue'
import { useGameJeopardyStore } from '@/store/games/jeopardy'

const gameJeopardyStore = useGameJeopardyStore()
const path = '/games/jeopardy'
const maxPlayers = 5
const formPlayerModel = { name: null, points: 0, color: null }
const colors = ['red', 'green', 'blue', 'purple', 'orange', 'pink', 'cyan', 'indigo', 'amber-deep']
const displayDialogInfo = ref(false)
const displayDialogAddPlayer = ref(false)
const config = ref(null)
const categories = ref([])
const formPlayer = ref({ ...formPlayerModel })
const players = computed(() => gameJeopardyStore.players)
const canAddPlayer = computed(() => players.value.length < maxPlayers)
const category = ref(null)

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
  categories.value = config.value?.items
})


function selectCategory (value) {
  category.value = value
}

function selectQuestion (category, question) {
  console.log(`Selected question from ${category.name}: ${question.points} points`)
}

function addPlayer () {
  if (
    formPlayer.value.name?.length >= 2 &&
    players.value.findIndex(o => o.name === formPlayer.value.name) === -1 &&
    canAddPlayer.value
  ) {
    const form = { ...formPlayer.value }
    const availableColors = colors.filter(color => players.value.findIndex(o => o.color === color) === -1)

    form.name = form.name.trim()
    form.name = form.name.charAt(0).toUpperCase() + form.name.slice(1)
    form.color = availableColors[Math.floor(Math.random() * availableColors.length)]
    gameJeopardyStore.addPlayer(form)
    displayDialogAddPlayer.value = false
    formPlayer.value = { ...formPlayerModel }
  }
}
</script>

<style lang="sass" scoped>

</style>
