import { defineStore } from 'pinia'

interface User {
  name: string
  email: string
  avatar?: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    token: null as string | null
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null
  },
  actions: {
    login(user: User, token?: string) {
      this.user = user
      this.isAuthenticated = true
      this.token = token || 'demo-token-' + Date.now()
      
      // Save to localStorage
      localStorage.setItem('auth_token', this.token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
      this.token = null
      
      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')
    },
    checkAuth() {
      // Check if user is authenticated from localStorage
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)
          this.user = user
          this.isAuthenticated = true
          this.token = token
          return true
        } catch (error) {
          console.error('Error parsing user data:', error)
          this.logout()
          return false
        }
      }
      return false
    }
  }
})
