import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    isAuthenticated: false
  }),

  getters: {
    getToken: (state) => state.token,
    getIsAuthenticated: (state) => state.isAuthenticated
  },

  actions: {
    setToken(token: string) {
      this.token = token
      this.isAuthenticated = true
      // Store token in localStorage for persistence
      localStorage.setItem('token', token)
    },

    clearToken() {
      this.token = null
      this.isAuthenticated = false
      // Remove token from localStorage
      localStorage.removeItem('token')
    },

    initializeAuth() {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.isAuthenticated = true
      }
    }
  }
})