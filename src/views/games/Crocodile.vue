<template lang="pug">
v-container(fluid)
  v-card(
    v-if="config"
    :title="config.title"
    variant="elevated"
    prepend-icon="custom:crocodile"
  )
    v-card-text.mt-6
      v-row(justify="center")
        v-col(cols="12" sm="6" md="5" lg="4")
          .d-flex.justify-center
            v-btn(color="success" @click="getRand") {{ $t('new_task') }}
          .text-h4.text-center.mt-4 {{ item?.titles[locale] }}
          v-img.mt-2(
            v-if="item"
            :src="item.src"
            :alt="name"
            rounded
          )
          //pre {{ config }}
    v-card-text
      v-expansion-panels
        v-expansion-panel(
          :title="$t('description')"
          :text="config.description"
        )
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const path = '/games/crocodile'
const config = ref(null)
const lastItems = ref([])
const item = ref(null)
const items = computed(() => config.value.items)
const maxHistory = computed(() => Math.min(5, items.value.length))
let attempts = 0

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
})

function getRand () {
  if (attempts > 10) {
    console.error('No images found, attempts:', attempts)
    return
  }

  const info = items.value[Math.floor(Math.random() * items.value.length)]

  if (lastItems.value.includes(info.name)) {
    attempts++
    return getRand()
  }

  attempts = 0

  item.value = {
    ...info,
    src: `${path}/images/${info.name}.webp`,
  }

  lastItems.value.push(info.name)

  if (lastItems.value.length > maxHistory.value) {
    lastItems.value.shift()
  }
}
</script>

<style src="@/assets/sass/views/games/crocodile.sass" lang="sass" scoped/>
