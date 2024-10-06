<template lang="pug">
LayoutBasePage(
  :title="$t('learning.read-es.title')"
  icon="mdi-alphabetical"
  color="orange"
)
  Tabs(v-model="tab" :items="tabs")
    template(v-slot:colors)
      CardInfo(
        :color="cardCurrent.hex"
        @prev="getPrevCard"
        @next="getNextCard"
      )
        div
          .text-h3 {{ cardCurrent.title }}
          div ({{ cardCurrent.transcription }})
        v-spacer
        .caption {{ cardCurrent.titleLocal }}
</template>

<script setup>
import LayoutBasePage from '@/components/layouts/BasePage.vue'
import CardInfo from '@/components/CardInfo/index.vue'
import Tabs from '@/components/Tabs/index.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const path = '/learning/read-es'
const { t, locale } = useI18n()
const tabs = computed(() => [
  {
    value: 'colors',
    text: t('learning.colors'),
    icon: 'mdi-palette',
  },
])
const tab = ref('colors')
const config = ref(null)
const colors = computed(() => config.value?.colors || [])
const cardCurrent = ref({})
const counter = ref(0)

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
  getCard()
})

function getNextCard () {
  counter.value++
  getCard()
}

function getPrevCard () {
  counter.value--
  getCard()
}

function getCard () {
  const keys = Object.keys(colors.value)

  if (counter.value >= keys.length) {
    counter.value = 0
  }
  else if (counter.value < 0) {
    counter.value = keys.length - 1
  }

  const item = colors.value[counter.value]

  cardCurrent.value = {
    title: item.titles.es,
    titleLocal: item.titles[locale.value],
    transcription: item.transcription,
    hex: item.hex,
    name: item.name,
  }
}
</script>
