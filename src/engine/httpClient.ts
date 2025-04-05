// src/engine/httpClient.ts
import axios, { type Method } from 'axios'
import type { AxiosRequestConfig } from 'axios'
import router from '@/router'

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

window.axios = axiosInstance

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
