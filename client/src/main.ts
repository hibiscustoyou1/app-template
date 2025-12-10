import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // 引入 router

const app = createApp(App)
app.use(router) // 注册 router
app.mount('#app')