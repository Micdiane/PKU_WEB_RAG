<template>
  <div class="login-form">
    <n-card title="登录/注册" class="login-card">
      <n-tabs v-model:value="activeTab" type="line" animated>
        <n-tab-pane name="login" tab="登录">
          <n-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
            <n-form-item label="邮箱" path="email">
              <n-input v-model:value="loginForm.email" placeholder="请输入邮箱" />
            </n-form-item>
            <n-form-item label="密码" path="password">
              <n-input
                v-model:value="loginForm.password"
                type="password"
                placeholder="请输入密码"
                @keyup.enter="handleLogin"
              />
            </n-form-item>
            <n-form-item>
              <n-button
                type="primary"
                @click="handleLogin"
                :loading="loading"
                block
              >
                登录
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="register" tab="注册">
          <n-form :model="registerForm" :rules="registerRules" ref="registerFormRef">
            <n-form-item label="邮箱" path="email">
              <n-input v-model:value="registerForm.email" placeholder="请输入邮箱" />
            </n-form-item>
            <n-form-item label="密码" path="password">
              <n-input
                v-model:value="registerForm.password"
                type="password"
                placeholder="请输入密码"
              />
            </n-form-item>
            <n-form-item label="确认密码" path="confirmPassword">
              <n-input
                v-model:value="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                @keyup.enter="handleRegister"
              />
            </n-form-item>
            <n-form-item>
              <n-button
                type="primary"
                @click="handleRegister"
                :loading="loading"
                block
              >
                注册
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { authenticatedFetch } from '../utils/auth'

// 定义表单数据
const activeTab = ref('login')
const loading = ref(false)
const message = useMessage()
const authStore = useAuthStore()
const router = useRouter()

// 登录表单
const loginFormRef = ref<FormInst | null>(null)
const loginForm = reactive({
  email: '',
  password: ''
})

// 注册表单
const registerFormRef = ref<FormInst | null>(null)
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

// 登录表单验证规则
const loginRules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}

// 注册表单验证规则
const registerRules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  },
  confirmPassword: {
    required: true,
    message: '请再次输入密码',
    trigger: 'blur',
    validator: (rule: any, value: string) => {
      if (value !== registerForm.password) {
        return new Error('两次输入的密码不一致')
      }
      return true
    }
  }
}

// 处理登录
const handleLogin = () => {
  loginFormRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      // 调用登录API
      authenticatedFetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('登录失败')
          }
        })
        .then(data => {
          loading.value = false
          message.success('登录成功')
          // 保存token到store
          authStore.setToken(data.token)
          // 跳转到首页
          router.push('/')
        })
        .catch(error => {
          loading.value = false
          message.error(error.message || '登录失败')
        })
    }
  })
}

// 处理注册
const handleRegister = () => {
  registerFormRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      // 调用注册API
      authenticatedFetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password
        })
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('注册失败')
          }
        })
        .then(data => {
          loading.value = false
          message.success('注册成功')
          // 自动切换到登录标签
          activeTab.value = 'login'
        })
        .catch(error => {
          loading.value = false
          message.error(error.message || '注册失败')
        })
    }
  })
}
</script>

<style scoped>
.login-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 400px;
}
</style>