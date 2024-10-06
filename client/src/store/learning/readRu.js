import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

const id = 'learningReadRu'
const settingsDefault = {
  shuffle: true,
  to_voice: false,
  display_img: true,
}

export const useLearningReadRuStore = defineStore(id, () => {
  const settings = useStorage(`${id}.settings`, { ...settingsDefault })

  const updateSettings = (value = { ...settingsDefault }) => {
    settings.value = value
  }

  return { settings, updateSettings }
})
