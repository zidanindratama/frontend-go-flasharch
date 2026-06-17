"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getBuyerAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type CreateAddressInput,
} from "@/lib/api/account"
import { getErrorMessage } from "@/lib/api/errors"
import { useAuthStore } from "@/stores/auth"

export function useAddresses() {
  const token = useAuthStore((s) => s.access_token)

  return useQuery({
    queryKey: ["account.addresses"],
    queryFn: async () => {
      const response = await getBuyerAddresses()
      return response.data.data.items
    },
    enabled: !!token,
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAddressInput) => createAddress(data),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Address created")
      await queryClient.invalidateQueries({ queryKey: ["account.addresses"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to create address"))
    },
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAddressInput> }) =>
      updateAddress(id, data),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Address updated")
      await queryClient.invalidateQueries({ queryKey: ["account.addresses"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update address"))
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Address deleted")
      await queryClient.invalidateQueries({ queryKey: ["account.addresses"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to delete address"))
    },
  })
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Default address updated")
      await queryClient.invalidateQueries({ queryKey: ["account.addresses"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to set default address"))
    },
  })
}
