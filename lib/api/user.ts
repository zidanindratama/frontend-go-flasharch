import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type User = {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: { id: string; code: string; name: string }
  email_verified: boolean
  status: string
  last_sign_in_at: string | null
  created_at: string
  updated_at: string
}

export type UserProfileResponse = { message: string; data: User }

export type UpdateProfileResponse = {
  message: string
  data: { full_name: string }
}

export type UploadAvatarResponse = {
  message: string
  data: {
    file_id: string
    file_name: string
    content_type: string
    size_bytes: number
    url: string
  }
}

export const getMe = () =>
  api.get<UserProfileResponse>(endpoints.user.me)

export const updateMe = (data: { full_name: string }) =>
  api.patch<UpdateProfileResponse>(endpoints.user.me, data)

export const uploadAvatar = (formData: FormData) =>
  api.post<UploadAvatarResponse>(endpoints.user.uploadAvatar, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
