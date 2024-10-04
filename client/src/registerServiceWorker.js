import { register } from 'register-service-worker'

if (import.meta.env.VITE_APP_NODE_ENV !== 'dev') {
  register(`${import.meta.env.BASE_URL}sw.js`, {
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
    updated (registration) {
      alert('New content is available, please refresh to load the latest version.')

      if (registration.waiting) {
        if (navigator.onLine) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload()
        }
        else {
          alert('New content is available but you are offline. Please refresh the page when you are online.');
        }
      }
    },
    offline () {
      console.info('ServiceWorker: App is running in offline mode.')
    },
    error (error) {
      console.error('ServiceWorker: Error during service worker registration:', error)
    }
  })
}
