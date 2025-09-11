// auth.ts
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

// 拦截 401 错误的函数
export const handleUnauthorizedError = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const message = useMessage()

  // 清除认证信息
  authStore.clearToken()
  
  // 显示错误消息
  message.error('登录已过期，请重新登录')
  
  // 重定向到登录页面
  router.push('/login')
}

// 包装 fetch 请求以自动处理 401 错误
export const authenticatedFetch = (url: string, options: RequestInit = {}) => {
  // 添加认证头
  const authStore = useAuthStore()
  const headers = new Headers(options.headers)
  
  if (authStore.getToken) {
    headers.set('Authorization', `Bearer ${authStore.getToken}`)
  }
  
  // 更新选项
  const newOptions = {
    ...options,
    headers
  }

  // 发起请求
  return fetch(url, newOptions).then(response => {
    // 如果是 401 错误，处理它
    if (response.status === 401) {
      handleUnauthorizedError()
      throw new Error('Unauthorized')
    }
    
    return response
  })
}