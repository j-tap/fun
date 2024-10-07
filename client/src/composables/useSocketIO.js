import { onBeforeUnmount, reactive, ref } from 'vue'
import { io } from 'socket.io-client'

export const optionsDefault = {
  autoConnect: false,
}

export function useSocketIO (url, options = optionsDefault) {
  const state = reactive({
    connected: true,
  })

  const socket = io(url, options)

  socket.on('connect', () => {
    state.connected = true
  })

  socket.on('disconnect', () => {
    state.connected = false
  })

  onBeforeUnmount(() => {
    if (typeof socket.disconnect === 'function') {
      socket.disconnect()
    }
  })

  return {
    socket,
    state,
  }
}
