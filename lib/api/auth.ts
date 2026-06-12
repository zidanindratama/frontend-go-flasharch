import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type AuthResponse = {
  message: string
  data: { access_token: string; refresh_token: string }
}

export type MessageResponse = { message: string }

export type SignInInput = { email: string; password: string }
export type SignUpInput = { email: string; password: string; full_name: string }
export type VerifyEmailInput = { token: string }
export type ForgotPasswordInput = { email: string }
export type ResetPasswordInput = {
  email: string
  otp: string
  new_password: string
}
export type ChangePasswordInput = {
  current_password: string
  new_password: string
}
export type ResendVerificationInput = { email: string }
export type SignOutInput = { refresh_token: string }

export const signIn = (data: SignInInput) =>
  api.post<AuthResponse>(endpoints.auth.signIn, data)

export const signUp = (data: SignUpInput) =>
  api.post<MessageResponse>(endpoints.auth.signUp, data)

export const signOut = (data: SignOutInput) =>
  api.post<MessageResponse>(endpoints.auth.signOut, data)

export const verifyEmail = (data: VerifyEmailInput) =>
  api.post<MessageResponse>(endpoints.auth.verifyEmail, data)

export const resendVerification = (data: ResendVerificationInput) =>
  api.post<MessageResponse>(endpoints.auth.resendVerification, data)

export const forgotPassword = (data: ForgotPasswordInput) =>
  api.post<MessageResponse>(endpoints.auth.forgotPassword, data)

export const resetPassword = (data: ResetPasswordInput) =>
  api.post<MessageResponse>(endpoints.auth.resetPassword, data)

export const changePassword = (data: ChangePasswordInput) =>
  api.post<MessageResponse>(endpoints.auth.changePassword, data)
