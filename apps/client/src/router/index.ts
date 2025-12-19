import { createRouter, createWebHistory } from 'vue-router'

const routes = []

// 使用 Vite 的 glob 导入功能自动加载当前目录下的 .routes.ts 文件
const modules = import.meta.glob('./*.routes.ts', { eager: true })

for (const path in modules) {
  const mod = modules[path] as any
  const route = mod.default
  if (Array.isArray(route)) {
    routes.push(...route)
  } else {
    routes.push(route)
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router