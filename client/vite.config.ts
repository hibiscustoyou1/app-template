import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    proxy: {
      // API 接口
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
      }
    }
  }
})
