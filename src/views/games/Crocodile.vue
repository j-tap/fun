<template lang="pug">
v-container(fluid)
  v-card(
    v-if="config"
    :title="$t('games.crocodile.title')"
    variant="elevated"
    prepend-icon="custom:crocodile"
  )
    v-card-text.mt-6
      v-row(justify="center")
        v-col(cols="12" sm="6" md="5" lg="4")
          .d-flex.justify-center
            v-btn(color="primary" @click="getItem") {{ $t('new_task') }}

          .d-flex.justify-center
            CardsStack.mt-12(ref="elCardsStack")
              .d-flex.flex-column.w-100
                .text-h4.text-center {{ currentItem?.titles[locale] }}
                v-img(
                  :src="currentItem?.src"
                  :alt="currentItem?.name"
                  aspect-ratio="1"
                  full-width
                )

    v-card-text
      v-expansion-panels
        v-expansion-panel
          v-expansion-panel-title {{ $t('description') }}
          v-expansion-panel-text
            .text-pre-wrap(v-html="$t('games.crocodile.description')")

      //v-list
        v-list-item(
          v-for="(item, index) in items"
          :key="index"
        )
          //pre {{ item }}
          span {{ item.name }}
          v-img(:src="item.src" width="48px" rounded)
          div {{ JSON.stringify(item.titles) }}
</template>

<script setup>
import CardsStack from '@/components/CardsStack/index.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useArray from '@/composables/useArray'

const { locale } = useI18n()
const { shuffleArray } = useArray()
const path = '/games/crocodile'
const config = ref(null)
const currentItem = ref(null)
const items = ref([])
const elCardsStack = ref(null)
let counter = 0

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
  initItems(config.value?.items)
})

function initItems (arr = []) {
  items.value = shuffleArray(arr).map(item => ({
    ...item,
    test: 1,
    src: `${path}/images/${item.name}.webp`,
  }))
}

async function getItem () {
  if (counter >= items.value.length) {
    initItems(config.value?.items)
    counter = 0
  }

  await elCardsStack.value.openCard()

  currentItem.value = items.value[counter]
  counter++
}
</script>

<style src="@/assets/sass/views/games/crocodile.sass" lang="sass" scoped/>
