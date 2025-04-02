import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/engine/httpClient'

interface User {
  email: string
  name?: string
  avatar?: string
  username?: string
}

interface LoginResponse {
  token: string
  user: User
  success: boolean
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

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    return user.value.name
      .split(' ')
      .map((name) => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })

  // Actions
  function setUser(newUser: User | null) {
    user.value = newUser
    if (newUser) {
      localStorage.setItem('clinagenda_user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('clinagenda_user')
    }
  }

  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('clinagenda_token', newToken)
      // Configure o token para todas as requisições futuras
      if (window.axios) {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      }
    } else {
      localStorage.removeItem('clinagenda_token')
      // Remove o token das requisições futuras
      if (window.axios) {
        delete window.axios.defaults.headers.common['Authorization']
      }
    }
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      console.info('1. Enviando dados para Login')

      const response = await request<LoginCredentials, LoginResponse>({
        method: 'POST',
        endpoint: 'auth/login', // Make sure 'api/' is included
        body: credentials
      })

      console.info('2. Dados enviados com Suceso')

      //  !response.data.success

      if (response.isError) {
        console.error('Login failed:', response.data.message || 'Unknown error')

        console.info('3. Erro de Login')

        return false
      }

      setUser(response.data.user)
      setToken(response.data.token)
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

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('Failed to parse stored user', e)
        localStorage.removeItem('clinagenda_user')
      }
    }

    if (storedToken) {
      token.value = storedToken
      // Configure o token para todas as requisições futuras
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
    login,
    logout,
    validateToken,
    setUser,
    setToken
  }
})

