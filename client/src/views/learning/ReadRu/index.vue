<template lang="pug">
LayoutBasePage(
  :title="$t('learning.read-ru.title')"
  icon="mdi-alphabetical"
  color="orange"
)
  template(v-slot:append)
    v-btn(
      color="info"
      variant="text"
      icon="mdi-cog-outline"
      @click="displayDialogSettings = true"
    )

  template(v-slot:default)
    Tabs(v-model="tab" :items="tabs")
      template(v-slot:alphabet)
        AlphabetRu
      template(v-slot:syllables)
        SyllablesRu
      template(v-slot:read-syllables)
        ReadSyllables

  template(v-slot:extra)
    v-dialog(
      v-model="displayDialogSettings"
      transition="dialog-top-transition"
      width="400"
    )
      v-card(:title="$t('settings')")
        v-card-text
          v-form(v-show="tab === 'alphabet'")
            v-switch(
              v-model="settings.shuffle"
              :label="$t('settings.shuffle')"
              color="orange"
            )
            v-switch(
              v-model="settings.voice"
              :label="$t('settings.to_voice')"
              color="orange"
            )
            v-switch(
              v-model="settings.display_img"
              :label="$t('settings.display_image')"
              color="orange"
            )
        v-card-actions
          v-spacer
          v-btn(
            :text="$t('ok')"
            @click="displayDialogSettings = false"
          )
</template>

<script setup>
import LayoutBasePage from '@/components/layouts/BasePage.vue'
import Tabs from '@/components/Tabs/index.vue'
import AlphabetRu from './Alphabet.vue'
import SyllablesRu from './Syllables.vue'
import ReadSyllables from './ReadSyllables.vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLearningReadRuStore } from '@/store/learning/readRu.js'

const { t } = useI18n()
const learningReadRuStore = useLearningReadRuStore()
const displayDialogSettings = ref(false)
const tabs = computed(() => [
  {
    value: 'alphabet',
    text: t('learning.alphabet'),
    icon: 'mdi-alphabetical',
  },
  {
    value: 'syllables',
    text: t('learning.syllables'),
    icon: 'mdi-file-word-box-outline',
  },
  {
    value: 'read-syllables',
    text: t('learning.reading_by_syllables'),
    icon: 'mdi-book-open-variant',
  },
])
const tab = ref('alphabet')
const settings = computed(() => learningReadRuStore.settings)

watch(settings, (val) => {
  learningReadRuStore.updateSettings(val)
}, { deep: true })
</script>
