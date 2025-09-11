<template>
  <div class="home">
    <n-layout>
      <n-layout-header bordered>
        <div class="header">
          <h1>文件上传系统</h1>
          <n-button @click="handleLogout">退出登录</n-button>
        </div>
      </n-layout-header>
      <n-layout-content>
        <div class="content">
          <h2>欢迎来到文件上传系统</h2>
          <p>请选择文件进行上传</p>
          <!-- 文件上传组件 -->
          <FileUpload />
        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import FileUpload from '../components/FileUpload.vue'

const authStore = useAuthStore()
const router = useRouter()
const message = useMessage()

const handleLogout = () => {
  authStore.clearToken()
  message.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.home {
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.content {
  padding: 24px;
  text-align: center;
}
</style>