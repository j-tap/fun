import { ref } from 'vue'

const snackbars = ref([])

export function useSnackbar() {
  function addSnackbar({ message, type = 'info', timeout = 3000 }) {
    const id = Date.now()
    snackbars.value.push({ text: message, color: type, timeout, id, show: true })

    setTimeout(() => {
      removeSnackbar(id)
    }, timeout)
  }

  function removeSnackbar(id) {
    snackbars.value = snackbars.value.filter(snackbar => snackbar.id !== id)
  }

  return {
    snackbars,
    addSnackbar,
    removeSnackbar,
  }
}
