import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/LoginForm.vue')
  }
]

// 创建路由器实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取认证状态
  const authStore = useAuthStore()
  authStore.initializeAuth()

  // 如果访问的路由需要认证但用户未登录，则重定向到登录页
  if (to.name !== 'Login' && !authStore.getIsAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router