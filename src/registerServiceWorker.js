/* eslint-disable no-console */

import { register } from 'register-service-worker'
import Swal from 'sweetalert2'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      Swal.fire({
        title: 'App is Offline',
        text: 'You can use this app even without an internet connection.',
        icon: 'success',
      })
    },
    registered () {
      Swal.fire('Service worker has been registered.')
    },
    cached () {
      Swal.fire('Content has been cached for offline use.')
    },
    updatefound () {
      Swal.fire('New content is downloading.')
    },
    updated () {
      Swal.fire({
        title: 'New Content Available',
        text: 'Please refresh to load the latest version.',
        icon: 'info',
      })
    },
    offline () {
      Swal.fire({
        title: 'No Internet Connection',
        text: 'App is running in offline mode.',
        icon: 'warning',
      })
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
