import axios from 'axios'

const api = axios.create({
  // Vite 代理会将 /api 转发到后端
  baseURL: '/api', 
  timeout: 10000,
})

export default api