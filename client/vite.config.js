import { defineConfig } from 'vite'
import { execSync } from 'child_process'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import vuetify from 'vite-plugin-vuetify'

const commitHash = execSync('git rev-parse --short HEAD').toString().trim()

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      injectRegister: 'auto',
      srcDir: 'src',
      filename: 'sw.js',
      includeAssets: [
        'favicon.ico',
        'assets/*.*',
        'assets/**/*.*',
        'games/*.*',
        'games/**/*.*',
      ],
      manifest: {
        name: 'FUN app',
        description: 'A fun app with games and other',
        short_name: "FUN app",
        theme_color: '#b68f40',
        background_color: '#121212',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest,webp,woff,woff2,ttf,eot}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:woff|woff2|ttf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 360 * 24 * 3600,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
    vuetify({
      styles: { configFile: 'src/assets/sass/vuetifySettings.scss' },
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
})
