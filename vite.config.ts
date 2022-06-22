import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'modules',
    outDir: 'app'
  },
  plugins: [vue()]
})
