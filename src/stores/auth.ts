// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/engine/httpClient'

interface User {
  userId: number
  username: string
  email: string
  name?: string
  avatar?: string
  roles: string[]
  tokenExpires: string
}

interface LoginResponse {
  userId: number
  username: string
  email: string
  token: string
  roles: string[]
  tokenExpires: string
  success?: boolean
  message?: string
}

interface LoginCredentials {
  username: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const tokenExpires = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && isTokenValid())
  const userInitials = computed(() => {
    if (!user.value?.name && !user.value?.username) return '?'

    const nameToUse = user.value.name || user.value.username || ''
    return nameToUse
      .split(' ')
      .map((name) => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })

  const hasRole = (role: string) => {
    return user.value?.roles?.includes(role) || false
  }

  const isAdmin = computed(() => hasRole('admin'))

  // Check if token is still valid based on expiration date
  function isTokenValid(): boolean {
    if (!tokenExpires.value) return false

    const expiryDate = new Date(tokenExpires.value)
    const now = new Date()

    return expiryDate > now
  }

  // Actions
  function setUser(newUser: User | null) {
    user.value = newUser
    if (newUser) {
      localStorage.setItem('clinagenda_user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('clinagenda_user')
    }
  }

  function setToken(newToken: string | null, expires: string | null = null) {
    token.value = newToken
    tokenExpires.value = expires

    if (newToken) {
      localStorage.setItem('clinagenda_token', newToken)
      if (expires) {
        localStorage.setItem('clinagenda_token_expires', expires)
      }

      // Configure token for all future requests
      if (window.axios) {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      }
    } else {
      localStorage.removeItem('clinagenda_token')
      localStorage.removeItem('clinagenda_token_expires')

      // Remove token from future requests
      if (window.axios) {
        delete window.axios.defaults.headers.common['Authorization']
      }
    }
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      console.info('1. Sending login request')

      const response = await request<LoginCredentials, LoginResponse>({
        method: 'POST',
        endpoint: 'auth/login',
        body: credentials
      })

      if (response.isError) {
        console.error('Login failed:', response.message || 'Unknown error')
        return false
      }

      console.info('2. Login successful')

      // Create user object from response
      const userData: User = {
        userId: response.data.userId,
        username: response.data.username,
        email: response.data.email,
        roles: response.data.roles,
        tokenExpires: response.data.tokenExpires
      }

      setUser(userData)
      setToken(response.data.token, response.data.tokenExpires)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function validateToken() {
    if (!token.value) return false

    // Check if token is expired based on the stored expiry date
    if (!isTokenValid()) {
      // Token has expired, log the user out
      console.info('Token expired, logging out')
      logout()
      return false
    }

    try {
      const response = await request<{ token: string }, { valid: boolean }>({
        method: 'GET',
        endpoint: 'auth/validate-token',
        body: { token: token.value }
      })

      return !response.isError && response.data.valid
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await request<null, any>({
          method: 'POST',
          endpoint: 'auth/logout',
          body: null
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('clinagenda_remember')
    }
  }

  // Initialize from localStorage
  function init() {
    const storedUser = localStorage.getItem('clinagenda_user')
    const storedToken = localStorage.getItem('clinagenda_token')
    const storedExpires = localStorage.getItem('clinagenda_token_expires')

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('Failed to parse stored user', e)
        localStorage.removeItem('clinagenda_user')
      }
    }

    if (storedToken) {
      tokenExpires.value = storedExpires
      token.value = storedToken

      // Configure the token for all future requests
      if (window.axios) {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      }
    }
  }

  // Call init immediately
  init()

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userInitials,
    isAdmin,
    hasRole,
    login,
    logout,
    validateToken,
    setUser,
    setToken
  }
})
