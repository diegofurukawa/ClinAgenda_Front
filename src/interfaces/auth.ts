export interface IUserAuth {
  userId: number
  username: string
  email: string
  name?: string
  avatar?: string
  roles: string[]
  tokenExpires: string
}

export interface LoginResponse {
  userId: number
  username: string
  email: string
  token: string
  roles: string[]
  tokenExpires: string
  success?: boolean
  message?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

