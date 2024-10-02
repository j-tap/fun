import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

const id = 'gameJeopardy'

export const useGameJeopardyStore = defineStore(id, () => {
  const players = useStorage(`${id}.players`, [])

  const addPlayer = (value = {}) => {
    console.log('addPlayer', value)
    players.value.push(value)
  }

  const setPlayers = (value = []) => {
    players.value = value
  }

  const removePlayer = (index = -1) => {
    if (index >= 0) {
      players.value.splice(index, 1)
    }
  }

  return { players, addPlayer, setPlayers, removePlayer }
})
