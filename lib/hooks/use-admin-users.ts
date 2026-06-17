"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  listAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUserName,
  updateAdminUserRole,
  updateAdminUserStatus,
  deleteAdminUser,
  changeAdminUserPassword,
  type AdminUsersListParams,
  type CreateAdminUserInput,
  type AdminUserRoleCode,
  type AdminUserStatus,
} from "@/lib/api/admin-users"
import { getErrorMessage } from "@/lib/api/errors"

export function useAdminUsers(params: AdminUsersListParams) {
  return useQuery({
    queryKey: ["admin.users", params],
    queryFn: async () => {
      const response = await listAdminUsers(params)
      return response.data
    },
  })
}

export function useAdminUserDetail(userId: string) {
  return useQuery({
    queryKey: ["admin.users", userId],
    queryFn: async () => {
      const response = await getAdminUser(userId)
      return response.data.data
    },
    enabled: !!userId,
  })
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateAdminUserInput) => createAdminUser(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("User created")
      await queryClient.invalidateQueries({ queryKey: ["admin.users"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to create user"))
    },
  })
}

export function useUpdateAdminUserName() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, fullName }: { userId: string; fullName: string }) =>
      updateAdminUserName(userId, fullName),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Name updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.users"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update name"))
    },
  })
}

export function useUpdateAdminUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, roleCode }: { userId: string; roleCode: AdminUserRoleCode }) =>
      updateAdminUserRole(userId, roleCode),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Role updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.users"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update role"))
    },
  })
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: AdminUserStatus }) =>
      updateAdminUserStatus(userId, status),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Status updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.users"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update status"))
    },
  })
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => deleteAdminUser(userId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("User deleted")
      await queryClient.invalidateQueries({ queryKey: ["admin.users"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to delete user"))
    },
  })
}

export function useChangeAdminUserPassword() {
  return useMutation({
    mutationFn: ({ userId, newPassword }: { userId: string; newPassword: string }) =>
      changeAdminUserPassword(userId, newPassword),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Password changed")
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to change password"))
    },
  })
}
