import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { PROJECT_ROOT } from "@repo/shared";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, PROJECT_ROOT, '');
  const API_PORT = env.PORT || 3000;
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        // API 接口
        '/api': {
          target: `http://localhost:${ API_PORT }`,
          changeOrigin: true,
        }
      }
    }
  }
})
