import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ゴリスケっち',
        short_name: 'ゴリスケ',
        theme_color: '#0d0d1a',
        background_color: '#0d0d1a',
        display: 'standalone',
        icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    }),
  ],
  base: '/gorisuke-tchi/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
