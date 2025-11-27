<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 定义响应式数据
const message = ref('')
const isLoading = ref(true)
const error = ref(null)

// 获取数据的函数
const fetchData = async () => {
  try {
    isLoading.value = true
    // 发起 GET 请求
    const response = await axios.get('/api/hello')
    // 假设返回结构为 { "message": "..." }
    message.value = response.data.message
  } catch (err) {
    console.error(err)
    error.value = '无法连接到服务器，请稍后再试。'
  } finally {
    // 模拟一个小延迟，防止加载动画一闪而过（可选）
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}

// 组件挂载时调用
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-6">
    
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      
      <div class="p-8 md:p-10 text-center">
        <h1 class="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-4">
          API Response
        </h1>

        <div class="min-h-[60px] flex items-center justify-center">
          
          <div v-if="isLoading" class="flex flex-col items-center animate-pulse">
            <div class="h-4 w-32 bg-slate-200 rounded mb-2"></div>
            <span class="text-sm text-slate-400">Loading...</span>
          </div>

          <div v-else-if="error" class="text-red-500">
            <p class="text-lg font-medium">Ops!</p>
            <p class="text-sm opacity-80">{{ error }}</p>
            <button 
              @click="fetchData" 
              class="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors">
              重试
            </button>
          </div>

          <div v-else class="animate-fade-in-up">
            <p class="text-3xl md:text-4xl font-light text-slate-900 leading-tight">
              “{{ message }}”
            </p>
          </div>
          
        </div>
      </div>

      <div class="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    </div>
  </div>
</template>

<style>
/* 简单的淡入上浮动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
</style>