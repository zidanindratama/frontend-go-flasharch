"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  listAdminFlashSales,
  getAdminFlashSale,
  createFlashSale,
  updateFlashSale,
  updateFlashSaleStatus,
  deleteFlashSale,
  preloadFlashSale,
  checkFlashSaleReadiness,
  releaseExpiredReservations,
  getFlashSaleReport,
  listAdminFlashSaleItems,
  createFlashSaleItem,
  updateFlashSaleItem,
  deleteFlashSaleItem,
  type FlashSaleListParams,
  type FlashSaleItemListParams,
  type FlashSaleCreateInput,
  type FlashSaleUpdateInput,
  type FlashSaleStatusInput,
  type FlashSaleItemCreateInput,
  type FlashSaleItemUpdateInput,
  type FlashSaleStatus,
} from "@/lib/api/flash-sale"
import { getErrorMessage } from "@/lib/api/errors"

export function useAdminFlashSales(params: FlashSaleListParams) {
  return useQuery({
    queryKey: ["admin.flashSales", params],
    queryFn: async () => {
      const response = await listAdminFlashSales(params)
      return response.data
    },
  })
}

export function useAdminFlashSale(saleId: string, params?: { include_items?: boolean }) {
  return useQuery({
    queryKey: ["admin.flashSales", saleId],
    queryFn: async () => {
      const response = await getAdminFlashSale(saleId, params)
      return response.data.data
    },
    enabled: !!saleId,
  })
}

export function useAdminFlashSaleItems(saleId: string, params: FlashSaleItemListParams) {
  return useQuery({
    queryKey: ["admin.flashSales", saleId, "items", params],
    queryFn: async () => {
      const response = await listAdminFlashSaleItems(saleId, params)
      return response.data
    },
    enabled: !!saleId,
  })
}

export function useFlashSaleReadiness(saleId: string) {
  return useQuery({
    queryKey: ["admin.flashSales", saleId, "readiness"],
    queryFn: async () => {
      const response = await checkFlashSaleReadiness(saleId)
      return response.data.data
    },
    enabled: !!saleId,
  })
}

export function useFlashSaleReport(saleId: string) {
  return useQuery({
    queryKey: ["admin.flashSales", saleId, "report"],
    queryFn: async () => {
      const response = await getFlashSaleReport(saleId)
      return response.data.data
    },
    enabled: !!saleId,
  })
}

export function useCreateFlashSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: FlashSaleCreateInput) => createFlashSale(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Flash sale created")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to create flash sale"))
    },
  })
}

export function useUpdateFlashSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ saleId, data }: { saleId: string; data: FlashSaleUpdateInput }) =>
      updateFlashSale(saleId, data),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Flash sale updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update flash sale"))
    },
  })
}

export function useUpdateFlashSaleStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ saleId, status }: { saleId: string; status: FlashSaleStatus }) =>
      updateFlashSaleStatus(saleId, { status }),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Status updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update status"))
    },
  })
}

export function useDeleteFlashSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (saleId: string) => deleteFlashSale(saleId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Flash sale deleted")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to delete flash sale"))
    },
  })
}

export function usePreloadFlashSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (saleId: string) => preloadFlashSale(saleId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Redis stock preloaded")
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to preload Redis"))
    },
  })
}

export function useReleaseExpiredReservations() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (saleId: string) => releaseExpiredReservations(saleId),
    onSuccess: async (data) => {
      const { toast } = await import("sonner")
      const released = data.data.data.released
      toast.success(released > 0 ? `${released} reservations released` : "No expired reservations")
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to release reservations"))
    },
  })
}

export function useCreateFlashSaleItem(saleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: FlashSaleItemCreateInput) => createFlashSaleItem(saleId, input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Item added to flash sale")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to add item"))
    },
  })
}

export function useUpdateFlashSaleItem(saleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: FlashSaleItemUpdateInput }) =>
      updateFlashSaleItem(saleId, itemId, data),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Item updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update item"))
    },
  })
}

export function useDeleteFlashSaleItem(saleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => deleteFlashSaleItem(saleId, itemId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Item removed")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId] }),
        queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId, "items"] }),
        queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId, "report"] }),
        queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId, "readiness"] }),
      ])
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to remove item"))
    },
  })
}
