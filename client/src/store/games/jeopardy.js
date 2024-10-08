import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

const id = 'gameJeopardy'

export const useGameJeopardyStore = defineStore(id, () => {
  const players = useStorage(`${id}.players`, [])
  const questionsUnavailable = useStorage(`${id}.questionsUnavailable`, [])

  const addPlayer = (value = {}) => {
    players.value.push(value)
  }

  const addPointsToPlayer = ({ id } = {}, points = 0) => {
    const index = players.value.findIndex(o => o.id === id)
    const list = [...players.value]
    list[index].points += points
    players.value = list
  }

  const removePlayer = ({ id } = {}) => {
    if (id >= 0) {
      const index = players.value.findIndex(o => o.id === id)
      players.value.splice(index, 1)
    }
  }

  const addQuestionsUnavailable = (value = null) => {
    if (value) {
      questionsUnavailable.value.push(value)
    }
  }

  const clearQuestionsUnavailable = () => {
    questionsUnavailable.value = []
  }

  return {
    players, addPlayer, removePlayer, addPointsToPlayer,
    questionsUnavailable, addQuestionsUnavailable, clearQuestionsUnavailable,
  }
})
