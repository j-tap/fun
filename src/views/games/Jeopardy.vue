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
        variant="tonal"
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
              v-btn(color="primary" @click="selectQuestion(category, question)")
                Select Question

      v-row
        v-col(cols="12")
          v-card(:title="$t('players')")
            template(v-slot:append)
              v-btn(
                icon="mdi-plus"
                @click="displayDialogAddPlayer = true"
              )
            v-list
              v-list-item-group
                v-list-item(v-for="(player, index) in players" :key="index")
                  v-list-item-content
                    v-list-item-title {{ player.name }}
                    v-list-item-subtitle {{ player.score }} points

  v-dialog(
    v-model="displayDialogInfo"
    transition="dialog-top-transition"
    width="auto"
  )
    v-card(:title="$t('description')")
      v-card-text
        .text-pre-wrap(v-html="$t('games.jeopardy.description')")
      v-card-actions
        v-spacer
        v-btn(
          :text="$t('close')"
          @click="displayDialogInfo = false"
        )

  v-dialog(
    v-model="displayDialogAddPlayer"
    transition="dialog-top-transition"
    width="auto"
  )
    v-card(title="Add new player")
      v-card-text
      v-card-actions
        v-spacer
        v-btn(
          :text="$t('close')"
          @click="displayDialogAddPlayer = false"
        )
</template>

<script setup>
import { ref } from 'vue'

const path = '/games/jeopardy'
const displayDialogInfo = ref(false)
const displayDialogAddPlayer = ref(false)
const config = ref(null)
const categories = ref([])

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
  categories.value = config.value?.items
})

const category = ref(null)

const players = [
  { name: 'Alice', score: 200 },
  { name: 'Bob', score: 150 },
  { name: 'Charlie', score: 300 }
]

function selectCategory (value) {
  category.value = value
}

function selectQuestion (category, question) {
  console.log(`Selected question from ${category.name}: ${question.points} points`)
}
</script>

<style lang="sass" scoped>

</style>
