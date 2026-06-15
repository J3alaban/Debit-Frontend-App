import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11','android >= 5', 'ios >= 10'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'] // Android webview için 
    })
  ],
  build: {
    target: 'es2015',
  }
})
