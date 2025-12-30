import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { getServerPaths, loadSecureEnv } from '@repo/shared/server';
const { PROJECT_ROOT } = getServerPaths(__dirname);

loadSecureEnv(PROJECT_ROOT);

export default defineConfig(({ mode }) => {
  const API_PORT = process.env.PORT || 3000;
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
