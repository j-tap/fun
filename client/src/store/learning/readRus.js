import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

const id = 'learningReadRus'
const settingsDefault = {
  shuffle: true,
  to_voice: false,
}

export const useLearningReadRusStore = defineStore(id, () => {
  const settings = useStorage(`${id}.settings`, { ...settingsDefault })

  const updateSettings = (value = { ...settingsDefault }) => {
    settings.value = value
  }

  return { settings, updateSettings }
})
