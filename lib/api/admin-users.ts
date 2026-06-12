import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type AdminUserRoleCode = "admin" | "buyer"
export type AdminUserStatus = "active" | "suspended"

export type AdminUser = {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: {
    id: string
    code: AdminUserRoleCode
    name: string
  }
  email_verified: boolean
  status: AdminUserStatus | "deleted" | string
  last_sign_in_at: string | null
  created_at: string
  updated_at: string
}

export type AdminUsersListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
  role?: AdminUserRoleCode
  status?: AdminUserStatus
}

export type AdminUsersListResponse = {
  message: string
  data: {
    items: AdminUser[]
    page: number
    per_page: number
    total: number
  }
}

export type AdminUserResponse = {
  message: string
  data: AdminUser
}

export type CreateAdminUserInput = {
  email: string
  password: string
  full_name: string
  role_code: AdminUserRoleCode
}

export type UpdateAdminUserInput = {
  full_name: string
  role_code: AdminUserRoleCode
  status: AdminUserStatus
}

export const listAdminUsers = (params: AdminUsersListParams) =>
  api.get<AdminUsersListResponse>(endpoints.admin.users, { params })

export const getAdminUser = (userId: string) =>
  api.get<AdminUserResponse>(`${endpoints.admin.users}/${userId}`)

export const createAdminUser = (data: CreateAdminUserInput) =>
  api.post<AdminUserResponse>(endpoints.admin.users, data)

export const updateAdminUserName = (userId: string, fullName: string) =>
  api.patch<AdminUserResponse>(`${endpoints.admin.users}/${userId}`, {
    full_name: fullName,
  })

export const updateAdminUserRole = (
  userId: string,
  roleCode: AdminUserRoleCode,
) =>
  api.patch<AdminUserResponse>(`${endpoints.admin.users}/${userId}/role`, {
    role_code: roleCode,
  })

export const updateAdminUserStatus = (
  userId: string,
  status: AdminUserStatus,
) =>
  api.patch<AdminUserResponse>(`${endpoints.admin.users}/${userId}/status`, {
    status,
  })

export const deleteAdminUser = (userId: string) =>
  api.delete<{ message: string; data: null }>(
    `${endpoints.admin.users}/${userId}`,
  )

export const changeAdminUserPassword = (
  userId: string,
  newPassword: string,
) =>
  api.post<{ message: string; data: null }>(
    `${endpoints.admin.users}/${userId}/change-password`,
    { new_password: newPassword },
  )
