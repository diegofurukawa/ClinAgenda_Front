import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Method
} from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// Create Axios instance with default config
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_HOST || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Request interceptor for API calls
instance.interceptors.request.use(
  (config: AxiosRequestConfig): InternalAxiosRequestConfig => {
    const authStore = useAuthStore()
    const token = authStore.token

    // Ensure headers exist
    const updatedConfig = config as InternalAxiosRequestConfig

    if (token) {
      // Set the Authorization header
      updatedConfig.headers = updatedConfig.headers || {}
      updatedConfig.headers.Authorization = `Bearer ${token}`
    }

    return updatedConfig
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const authStore = useAuthStore()

    if (error.response) {
      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response.status === 401) {
        authStore.logout()
        window.location.href = '/login'
        return Promise.reject(new Error('Sua sessão expirou. Por favor, faça login novamente.'))
      }

      // Handle other error responses
      const errorMessage = error.response.data?.message || 'Ocorreu um erro na requisição.'
      return Promise.reject(new Error(errorMessage))
    }

    return Promise.reject(error)
  }
)

export const httpClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.get<T>(url, config)
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return instance.post<T>(url, data, config)
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return instance.put<T>(url, data, config)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return instance.delete<T>(url, config)
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return instance.patch<T>(url, data, config)
  }
}

const API_URL = import.meta.env.VITE_BASE_HOST

const axiosInstance = axios.create({
  baseURL: API_URL
})

// Exponha a instância do axios para uso global
declare global {
  interface Window {
    axios: typeof axios
  }
}

// Interceptor para incluir o token de autenticação
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clinagenda_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para lidar com erros de resposta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      // Token expirado ou inválido
      if (status === 401) {
        // Limpa dados de autenticação
        localStorage.removeItem('clinagenda_token')
        localStorage.removeItem('clinagenda_user')
        localStorage.removeItem('clinagenda_token_expires')

        // Armazena a URL atual para redirecionamento após login
        if (router.currentRoute.value.name !== 'login') {
          localStorage.setItem(
            'clinagenda_redirect_after_login',
            router.currentRoute.value.fullPath
          )

          // Redireciona para a página de login
          router.push('/login')
        }
      }

      // Erro 403 - Forbidden (Permissão negada)
      else if (status === 403) {
        console.error(
          'Acesso negado:',
          data?.message || 'Você não tem permissão para acessar este recurso'
        )

        // Poderia redirecionar para uma página de acesso negado
        // router.push('/acesso-negado')
      }

      // Erro 500 - Internal Server Error
      else if (status >= 500) {
        console.error('Erro do servidor:', data?.message || 'Ocorreu um erro no servidor')
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta (problemas de rede)
      console.error('Erro de rede:', 'Não foi possível conectar ao servidor')
    }

    return Promise.reject(error)
  }
)

interface RequestOptions<T> {
  method: Method
  endpoint: string
  body?: T
  config?: AxiosRequestConfig
}

type CustomResponse<R> = {
  isError: boolean
  data: R
  statusCode?: number
  message?: string
}

export default async function request<T, R>({
  method,
  endpoint,
  body,
  config = {}
}: RequestOptions<T>): Promise<CustomResponse<R>> {
  try {
    const response = await axiosInstance.request<R>({
      method,
      url: endpoint,
      ...(method === 'GET' ? { params: body } : { data: body }),
      ...config
    })

    return {
      isError: false,
      data: response.data,
      statusCode: response.status
    }
  } catch (error: any) {
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status de erro
      return {
        isError: true,
        data: error.response.data as R,
        statusCode: error.response.status,
        message: error.response.data?.message || error.message
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      return {
        isError: true,
        data: {} as R,
        message: 'Sem resposta do servidor'
      }
    } else {
      // Algo aconteceu na configuração da requisição que causou um erro
      return {
        isError: true,
        data: {} as R,
        message: error.message
      }
    }
  }
}

