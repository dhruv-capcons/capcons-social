"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useOnboardStore } from "@/store/onboardStore";
import api from "@/lib/axios";
import {
  User,
  LoginData,
  RegisterData,
  ResendData,
  VerificationData,
  ForgetPassData,
  ResetPasswordData,
  AuthResponse,
  ApiError,
} from "@/types/auth";

interface UserDetails {
  _id: string;
  name: string;
  pfp_url: string;
  cover_url: string;
  story: string;
  dob: string;
  description: string;
  category: string;
  designation: string;
  business_url: string;
  youtube: string;
  instagram: string;
  xlink: string;
  education: {
    degree_name: string;
    university: string;
    start_year: number;
    end_year: number;
  };
  experience: {
    company: string;
    company_role: string;
    start_year: number;
    end_year: number;
    is_current: boolean;
  };
  interests: string[];
  gender: string;
  pronouns: string;
  color_card_id: string;
  friend_count: number;
  circle_count: number;
  invitation_count: number;
  userslug: string;
  onboarding_step: number;
}

interface UserDetailsResponse {
  data: UserDetails;
  message: string;
  userId: string;
}

// Fetch user details
export function useUserDetails() {
  const { setUserData } = useUserStore();
  const { setOnboardingStep, setInterests, setProfileImage, setColorCard } = useOnboardStore();

  // Check if access token exists
  const hasAccessToken = typeof window !== 'undefined' 
    ? document.cookie.split('; ').find(row => row.startsWith('access_token='))
    : false;

  return useQuery<UserDetailsResponse>({
    queryKey: ['user-details'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/userdetails`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data: UserDetailsResponse = await response.json();
      const userDetails = data.data;

      // Update user store
      setUserData({
        name: userDetails.name,
        user_name: userDetails.userslug,
        email: '', // Not provided in response
        phone: '', // Not provided in response
        dob: userDetails.dob,
        description: userDetails.description,
        pfp_url: userDetails.pfp_url,
        color_card_id: userDetails.color_card_id,
        interests: userDetails.interests,
        onboarding_step: userDetails.onboarding_step,
      });

      // Update onboarding store
      if (userDetails.pfp_url) {
        setProfileImage(userDetails.pfp_url);
      }
      if (userDetails.interests && userDetails.interests.length > 0) {
        setInterests(userDetails.interests);
      }
      if (userDetails.color_card_id) {
        setColorCard(userDetails.color_card_id);
      }

      // Set onboarding step
      let step = 1;
      if (userDetails.pfp_url) step = 2;
      if (userDetails.interests && userDetails.interests.length > 0) step = 3;
      if (userDetails.color_card_id) step = 4;
      setOnboardingStep(step);

      return data;
    },
    enabled: !!hasAccessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser, setLoading } = useAuthStore();

  return useMutation<AuthResponse, ApiError, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      setLoading(true);
      const { data } = await api.post<AuthResponse>("/auth/login", credentials, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Store tokens in HTTP-only cookies via our API route
      if (data?.data?.access_token && data?.data?.refresh_token) {
        const rememberMe =
          credentials instanceof FormData
            ? credentials.get("remember_user") === "yes"
            : credentials.remember_user === "yes";

        await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: data.data.access_token,
            refresh_token: data.data.refresh_token,
            remember_me: rememberMe,
          }),
        });
      }

      return data;
    },
    onSuccess: (data: AuthResponse) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.setQueryData(["user"], data.user);
    },
    onError: () => {
      useAuthStore.getState().clearAuth();
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// Register mutation
export function useRegister() {
  const { setLoading } = useAuthStore();

  return useMutation<
    {
      is_new_user: boolean;
      message: string;
      request_id: string;
      user_id: string;
    },
    ApiError,
    RegisterData
  >({
    mutationFn: async (userData: RegisterData) => {
      setLoading(true);
      const { data } = await api.post<{
        is_new_user: boolean;
        message: string;
        request_id: string;
        user_id: string;
      }>("/auth/register", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      // Optional: Auto-login after registration
      // useAuthStore.getState().setUser(data.user)
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// Get current user
export function useUser() {
  const { user, setUser } = useAuthStore();

  const query = useQuery<User | null, ApiError>({
    queryKey: ["user"],
    queryFn: async (): Promise<User | null> => {
      try {
        // First verify the session via our cookie-based API
        const sessionRes = await fetch("/api/auth/verify");
        const session = await sessionRes.json();

        if (!session.authenticated) {
          return null;
        }

        // If authenticated, fetch full user data from backend
        const { data } = await api.get<{ user: User }>("/me");
        return data.user;
      } catch {
        return null;
      }
    },
    enabled: !user, // Only fetch if we don't have user in Zustand
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Update Zustand store when query data changes
  if (query.data && query.data !== user) {
    setUser(query.data);
  }

  return query;
}

// Forgot password
export function useForgotPassword() {
  return useMutation<
    { message: string; request_id: string },
    ApiError,
    ForgetPassData
  >({
    mutationFn: async (forgetPassData: ForgetPassData) => {
      const { data } = await api.post<{ message: string; request_id: string }>(
        "/auth/forget-password",
        forgetPassData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
  });
}

// Reset password
export function useResetPassword() {
  return useMutation<{ message: string }, ApiError, ResetPasswordData>({
    mutationFn: async (resetData: ResetPasswordData) => {
      const { data } = await api.post<{ message: string }>(
        "/auth/forget-password/reset",
        resetData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
  });
}

// Verify email
export function useVerify() {
  return useMutation<AuthResponse, ApiError, FormData>({
    mutationFn: async (verifyData: VerificationData) => {
      const { data } = await api.post<AuthResponse>("/auth/verify", verifyData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: (data: AuthResponse) => {
      useAuthStore.getState().setUser(data.user);
    },
  });
}

// Resend verification email
export function useResendOTP() {
  return useMutation<{ message: string }, ApiError, ResendData>({
    mutationFn: async (resendData: ResendData) => {
      const { data } = await api.post<{ message: string }>(
        "/auth/resend-otp",
        resendData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
  });
}

export function useGetUser() {
  return useQuery<User | null, ApiError>({
    queryKey: ["user-details"],
    queryFn: async (): Promise<User | null> => {
      try {
        // Try to fetch user details with credentials (uses cookies)
        const { data } = await api.get<{
          data: User | PromiseLike<User | null> | null; user: User 
}>("/auth/user-details", {
          withCredentials: true,
        });
        return data.data;
      } catch {
        // If request fails (likely due to expired token), try refreshing
        try {
          const refreshResponse = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (refreshResponse.ok) {
            // Token refreshed successfully, retry the original request
            const { data } = await api.get<{ user: User }>("/auth/user-details", {
              withCredentials: true,
            });
            return data.user;
          } else {
            // Refresh failed, user needs to login again
            return null;
          }
        } catch {
          // Refresh failed, user needs to login again
          return null;
        }
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation<void, ApiError, void>({
    mutationFn: async (): Promise<void> => {
      try {
        await api.get("/auth/logout", {
          withCredentials: true,
        });
      } catch {
        console.error(
          "Backend logout failed, proceeding to clear client session."
        );
      } finally {
        // Call our API route to clear cookies
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // Clear all queries
    },
    onError: () => {
      // Even if API call fails, clear local auth
      clearAuth();
      queryClient.clear();
    },
  });
}
