'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'
import {
  User,
  LoginData,
  RegisterData,
  ResendData,
  VerificationData,
  ForgetPassData,
  ResetPasswordData,
  AuthResponse,
  ApiError
} from '@/types/auth'

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient()
  const { setUser, setLoading } = useAuthStore()

  return useMutation<AuthResponse, ApiError, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      setLoading(true)
      const { data } = await api.post<AuthResponse>('/login', credentials, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
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

  return useMutation<{is_new_user: boolean, message: string, request_id: string, user_id: string}, ApiError, RegisterData>({
    mutationFn: async (userData: RegisterData) => {
      setLoading(true)
      const { data } = await api.post<{is_new_user: boolean, message: string, request_id: string, user_id: string}>('/register', userData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
  return useMutation<{ message: string, request_id: string }, ApiError, ForgetPassData>({
    mutationFn: async (forgetPassData : ForgetPassData) => {
      const { data } = await api.post<{ message: string, request_id: string }>('/forget-password', forgetPassData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    },
  })
}

// Reset password
export function useResetPassword() {
  return useMutation<{ message: string }, ApiError, ResetPasswordData>({
    mutationFn: async ( resetData: ResetPasswordData) => {
      const { data } = await api.post<{ message: string }>('/forget-password/reset', resetData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    },
  })
}

// Verify email
export function useVerify() {
  return useMutation<AuthResponse, ApiError, FormData>({
    mutationFn: async (verifyData: VerificationData) => {
      const { data } = await api.post<AuthResponse>('/verify', verifyData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    },
    onSuccess: (data: AuthResponse) => {
      useAuthStore.getState().setUser(data.user)
    },
  })
}


// Resend verification email
export function useResendOTP() {
  return useMutation<{ message: string }, ApiError, ResendData>({
    mutationFn: async (resendData: ResendData) => {
      const { data } = await api.post<{ message: string }>('/resend-otp',resendData ,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    },
  })
}