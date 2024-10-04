<template lang="pug">
v-container(fluid)
  v-card(
    :title="$t('learning.read-rus.title')"
    variant="elevated"
  )
    template(v-slot:prepend)
      v-icon(color="orange" icon="mdi-alphabetical")
    template(v-slot:append)
      v-btn(
        color="info"
        variant="text"
        icon="mdi-cog-outline"
        @click="displayDialogSettings = true"
      )

    v-card-text
      v-tabs(
        v-model="tab"
        align-tabs="end"
        slider-color="orange"
      )
        v-tab(
          :value="1"
          :text="$t('learning.read-rus.alphabet')"
          prepend-icon="mdi-alphabetical"
        )
        v-tab(
          :value="2"
          :text="$t('learning.read-rus.reading_by_syllables')"
          prepend-icon="mdi-book-open-variant"
        )

      v-tabs-window.mt-12(v-model="tab")
        v-tabs-window-item(:value="1")
          AlphabetRus

        v-tabs-window-item(:value="2")
          ReadSyllables.mb-12

  v-dialog(
    v-model="displayDialogSettings"
    transition="dialog-top-transition"
    width="400"
  )
    v-card(:title="$t('settings')")
      v-card-text
        v-form(v-show="tab === 1")
          v-switch(
            v-model="settings.shuffle"
            :label="$t('learning.read-rus.settings.shuffle')"
            color="orange"
          )
          v-switch(
            v-model="settings.voice"
            :label="$t('learning.read-rus.settings.to_voice')"
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
import AlphabetRus from './Alphabet.vue'
import ReadSyllables from './ReadSyllables.vue'
import { computed, onMounted, ref, watch } from 'vue'
import useArray from '@/composables/useArray.js'
import { useLearningReadRusStore } from '@/store/learning/readRus.js'

const learningReadRusStore = useLearningReadRusStore()
const displayDialogSettings = ref(false)
const tab = ref(1)
const settings = computed(() => learningReadRusStore.settings)

watch(settings, () => {
  learningReadRusStore.updateSettings(settings.value)
}, { deep: true })
</script>
