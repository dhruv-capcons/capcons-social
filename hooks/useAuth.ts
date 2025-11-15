'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'
import {
  User,
  LoginData,
  RegisterData,
  VerificationData,
  AuthResponse,
  ResetPasswordData,
  ApiError
} from '@/types/auth'

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient()
  const { setUser, setLoading } = useAuthStore()

  return useMutation<AuthResponse, ApiError, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      setLoading(true)
      const { data } = await api.post<AuthResponse>('/login', credentials)
      return data
    },
    onSuccess: (data: AuthResponse) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.setQueryData(['user'], data.user)
    },
    onError: () => {
      useAuthStore.getState().clearAuth()
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

// Register mutation
export function useRegister() {
  const { setLoading } = useAuthStore()

  return useMutation<AuthResponse, ApiError, RegisterData>({
    mutationFn: async (userData: RegisterData) => {
      setLoading(true)
      const { data } = await api.post<AuthResponse>('/register', userData, {
        headers: userData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
      })
      return data
    },
    onSuccess: () => {
      // Optional: Auto-login after registration
      // useAuthStore.getState().setUser(data.user)
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

// Get current user
export function useUser() {
  const { user, setUser } = useAuthStore()

  const query = useQuery<User | null, ApiError>({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      try {
        const { data } = await api.get<{ user: User }>('/me')
        return data.user
      } catch {
        return null
      }
    },
    enabled: !user, // Only fetch if we don't have user in Zustand
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  // Update Zustand store when query data changes
  if (query.data && query.data !== user) {
    setUser(query.data)
  }

  return query
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()

  return useMutation<void, ApiError, void>({
    mutationFn: async (): Promise<void> => {
      await api.post('/logout')
    },
    onSuccess: () => {
      clearAuth()
      queryClient.clear() // Clear all queries
    },
    onError: () => {
      // Even if API call fails, clear local auth
      clearAuth()
      queryClient.clear()
    },
  })
}

// Forgot password
export function useForgotPassword() {
  return useMutation<{ message: string }, ApiError, { email: string }>({
    mutationFn: async ({ email }: { email: string }) => {
      const { data } = await api.post<{ message: string }>('/forgot-password', { email })
      return data
    },
  })
}

// Reset password
export function useResetPassword() {
  return useMutation<{ message: string }, ApiError, ResetPasswordData>({
    mutationFn: async ({ token, password }: ResetPasswordData) => {
      const { data } = await api.post<{ message: string }>('/reset-password', { 
        token, 
        password 
      })
      return data
    },
  })
}

// Verify email
export function useVerify() {
  return useMutation<AuthResponse, ApiError, VerificationData>({
    mutationFn: async (verifyData : VerificationData) => {
      const { data } = await api.post<AuthResponse>('/verify', verifyData)
      return data
    },
    onSuccess: (data: AuthResponse) => {
      useAuthStore.getState().setUser(data.user)
    },
  })
}

// Resend verification email
export function useResendVerification() {
  return useMutation<{ message: string }, ApiError, { email: string }>({
    mutationFn: async ({ email }: { email: string }) => {
      const { data } = await api.post<{ message: string }>('/api/auth/resend-verification', { email })
      return data
    },
  })
}