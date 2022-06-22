import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/leetcode-crawler/app/',
  build: {
    target: 'modules',
    outDir: 'app',
  },
  plugins: [vue()],
})
