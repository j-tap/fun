import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'My ToDo App',
        short_name: 'ToDo',
        description: 'A ToDo progressive web app',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#41b383',
        icons: [
          {
            src: '/img/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          // Add more icons for different resolutions as needed
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
