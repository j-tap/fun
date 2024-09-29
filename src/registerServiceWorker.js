import { register } from 'register-service-worker'

if (import.meta.env.VITE_APP_NODE_ENV !== 'dev') {
  register('/sw.js', {
    ready () {
      console.info('ServiceWorker: You can use this app even without an internet connection.')
    },
    registered () {
      console.info('ServiceWorker: Service worker has been registered.')
    },
    cached () {
      console.info('ServiceWorker: Content has been cached for offline use.')
    },
    updatefound () {
      console.info('ServiceWorker: New content is downloading.')
    },
    updated () {
      alert('New content is available, please refresh to load the latest version.')
    },
    offline () {
      console.info('ServiceWorker: App is running in offline mode.')
    },
    error (error) {
      console.error('ServiceWorker: Error during service worker registration:', error)
    }
  })
}
