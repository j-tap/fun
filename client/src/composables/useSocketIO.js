import { onBeforeUnmount, reactive } from 'vue'
import { io } from 'socket.io-client'
import { useSnackbar } from '@/composables/useSnackbar'

export const optionsDefault = {
  autoConnect: false,
  path: '/socket.io/',
}

export function useSocketIO (url, options = optionsDefault) {
  const { addSnackbar } = useSnackbar()
  const state = reactive({
    connected: true,
  })

  const socket = io(url, options)

  socket.on('connect', () => {
    state.connected = true
  })

  socket.on('disconnect', () => {
    addSnackbar({ message: 'Вы отключены', type: 'error' })
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
