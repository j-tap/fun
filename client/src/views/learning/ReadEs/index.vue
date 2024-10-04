<template lang="pug">
LayoutBasePage(
  :title="$t('learning.read-es.title')"
  icon="mdi-alphabetical"
  color="orange"
)
  Tabs(v-model="tab" :items="tabs")
    template(v-slot:colors)
      v-card.mx-auto(
        :color="currentColor.hex"
        max-width="340"
      )
        v-img.align-end(
          aspect-ratio="1"
          cover
        )
          v-card-actions.align-end
            .text-h3 {{ currentColor.title }}
            v-spacer
            .caption {{ currentColor.titleLocal }}

      .text-center.my-4
        v-btn(
          :text="$t('next')"
          color="orange"
          size="large"
          @click="getColor"
        )
</template>

<script setup>
import LayoutBasePage from '@/components/layouts/BasePage.vue'
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
const currentColor = ref({})
const indexColor = ref(0)

fetch(`${path}/config.json`).then(async response => {
  config.value = await response.json()
  getColor()
})

function getColor () {
  if (indexColor.value >= Object.keys(colors.value).length) {
    indexColor.value = 0
  }

  const item = colors.value[indexColor.value]

  currentColor.value = {
    title: item.titles.es,
    titleLocal: item.titles[locale.value],
    hex: item.hex,
    name: item.name,
  }

  indexColor.value++
}
</script>
