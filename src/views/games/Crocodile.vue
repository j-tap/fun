<template lang="pug">
v-container(fluid)
  v-card(
    v-if="config"
    :title="$t('games.crocodile.title')"
    variant="elevated"
  )
    template(v-slot:prepend)
      v-icon(color="green" icon="custom:crocodile")
    template(v-slot:append)
      v-btn(
        color="info"
        variant="tonal"
        icon="mdi-information-slab-box"
        @click="displayDialogInfo = true"
      )
    v-card-text.mt-6
      v-row(justify="center")
        v-col(cols="12" sm="6" md="5" lg="4")
          .d-flex.justify-center
            v-btn(
              v-microanim
              :text="$t('new_task')"
              color="primary"
              @click="getItem"
            )

          .d-flex.justify-center
            CardsStack.my-12(ref="elCardsStack")
              .d-flex.flex-column.w-100
                .text-h4.text-center.mb-2 {{ currentItem?.titles[locale] }}
                v-img(
                  :src="currentItem?.src"
                  :alt="currentItem?.name"
                  aspect-ratio="1"
                  full-width
                )
      Dev
        ul
          li.d-flex(v-for="item in items" :key="item.name")
            img(:src="item.src" :alt="item.name" style="width:48px")
            .ml-1 {{ item.name }}: {{ JSON.stringify(item.titles) }}

  v-dialog(
    v-model="displayDialogInfo"
    transition="dialog-top-transition"
    width="auto"
  )
    v-card(:title="$t('description')")
      v-card-text
        .text-pre-wrap(v-html="$t('games.crocodile.description')")
      v-card-actions
        v-spacer
        v-btn(
          :text="$t('close')"
          @click="displayDialogInfo = false"
        )
</template>

<script setup>
import CardsStack from '@/components/CardsStack/index.vue'
import Dev from '@/components/Dev.vue'
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
const displayDialogInfo = ref(false)
const isAwait = ref(false)
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
  isAwait.value = true

  if (counter >= items.value.length) {
    initItems(config.value?.items)
    counter = 0
  }

  await elCardsStack.value.openCard()

  currentItem.value = items.value[counter]
  counter++
  isAwait.value = false
}
</script>

<style src="@/assets/sass/views/games/crocodile.sass" lang="sass" scoped/>
