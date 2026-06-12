"use client"

import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth"
import {
  signIn as apiSignIn,
  signUp as apiSignUp,
  signOut as apiSignOut,
  verifyEmail as apiVerifyEmail,
  resendVerification as apiResendVerification,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
  changePassword as apiChangePassword,
  type SignInInput,
  type SignUpInput,
  type VerifyEmailInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type ChangePasswordInput,
  type ResendVerificationInput,
} from "@/lib/api/auth"
import { getMe, updateMe, uploadAvatar, type User } from "@/lib/api/user"

type ApiError = { response?: { data?: { message?: string } } }

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message
  }
  return fallback
}

export function useSignIn() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: SignInInput) => apiSignIn(data),
    onSuccess: async (response) => {
      const { access_token, refresh_token } = response.data.data
      useAuthStore.getState().setAuth({ access_token, refresh_token })

      const userRes = await getMe()
      useAuthStore.getState().setUser(userRes.data.data)

      if (userRes.data.data.role.code === "admin") {
        router.push("/dashboard")
      } else {
        router.push("/account")
      }

      toast.success("Sign in successful")
    },
    onError: (error: ApiError) => {
      const msg = getErrorMessage(error, "Sign in failed")
      if (msg.includes("email must be verified")) {
        toast.error("Email not verified. Please verify your email first.", {
          description: "Check your inbox for the verification link.",
        })
      } else {
        toast.error(msg)
      }
    },
  })
}

export function useSignUp() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: SignUpInput) => apiSignUp(data),
    onSuccess: () => {
      toast.success("Account created. Please verify your email.")
      router.push("/verify-email")
    },
    onError: (error: ApiError) => {
      const msg = getErrorMessage(error, "Sign up failed")
      if (msg.includes("already exists")) {
        toast.error("An account with this email already exists.")
      } else {
        toast.error(msg)
      }
    },
  })
}

export function useSignOut() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      const refresh_token = useAuthStore.getState().refresh_token
      return apiSignOut({ refresh_token: refresh_token ?? "" })
    },
    onSettled: () => {
      toast.success("Signed out successfully")
      useAuthStore.getState().clearAuth()
      queryClient.clear()
      router.push("/sign-in")
    },
  })
}

export function useUser() {
  const accessToken = useAuthStore((s) => s.access_token)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await getMe()
      useAuthStore.getState().setUser(res.data.data)
      return res.data.data
    },
    enabled: isAuthenticated && !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useVerifyEmail() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: VerifyEmailInput) => apiVerifyEmail(data),
    onSuccess: () => {
      toast.success("Email verified successfully")
      router.push("/sign-in")
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, "Failed to verify email"))
    },
  })
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (data: ResendVerificationInput) => apiResendVerification(data),
    onSuccess: () => {
      toast.success("Verification email sent")
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, "Failed to send verification email"))
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordInput) => apiForgotPassword(data),
    onSuccess: () => {
      toast.success("Password reset OTP sent to your email")
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, "Failed to send reset OTP"))
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordInput) => apiResetPassword(data),
    onSuccess: () => {
      toast.success("Password reset successful")
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, "Failed to reset password"))
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => apiChangePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully")
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, "Failed to change password"))
    },
  })
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: { full_name: string }) => updateMe(data),
    onSuccess: (response) => {
      useAuthStore.getState().setUser(response.data.data as unknown as User)
      toast.success("Profile updated")
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, "Failed to update profile"))
    },
  })
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: (formData: FormData) => uploadAvatar(formData),
    onSuccess: (response) => {
      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          avatar_url: response.data.data.url,
        })
      }
      toast.success("Avatar uploaded")
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, "Failed to upload avatar"))
    },
  })
}
