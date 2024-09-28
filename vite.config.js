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
        name: 'FUN app',
        short_name: 'Fun',
        description: 'A fun app for kids',
        start_url: '/',
        display: 'standalone',
        background_color: '#000',
        theme_color: '#e07d26',
        icons: [
          {
            src: '/img/icons/mstile-150x150.png',
            sizes: '72x72',
            type: 'image/png',
          },
          // Add more icons for different resolutions as needed
        ],
        workboxPluginMode: 'InjectManifest',
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
