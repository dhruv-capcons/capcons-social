export interface User {
  id?: string
  credential: string
  password: string
  circle_id?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  credential: string
  password: string
  remember_user?: string
  circle_id?: string
  country_code?: string
  createdAt?: string
  updatedAt?: string
}

export type LoginData = LoginCredentials | FormData

export interface RegisterDataObject {
  credential: string
  circle_id: string
  password: string
  country_code?: string
}

export type RegisterData = RegisterDataObject | FormData

export interface AuthResponse {
  user: User
  token?: string
  message?: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword?: string
}

export interface VerificationDataObject {
  credential: string
  code: string
  request_id?: string
  password_reset?: 'no' | 'yes'
  method?: 'email' | 'phone'
}

export type VerificationData = VerificationDataObject | FormData

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}