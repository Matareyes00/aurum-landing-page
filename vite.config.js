import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // No inline module-preload polyfill script, so a strict
    // `script-src 'self'` CSP (see public/_headers) has nothing to block.
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        academy: fileURLToPath(new URL('./academy/index.html', import.meta.url)),
      },
    },
  },
})
