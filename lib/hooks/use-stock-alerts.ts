"use client"

import { useCallback, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  listStockAlerts,
  subscribeStockAlert,
  unsubscribeStockAlert,
  type StockAlert,
} from "@/lib/api/stock-alerts"
import { getErrorMessage } from "@/lib/api/errors"
import { useAuthStore } from "@/stores/auth"

export function useStockAlertProductIds() {
  const token = useAuthStore((s) => s.access_token)
  const queryClient = useQueryClient()

  const stockAlertsQuery = useQuery({
    queryKey: ["account.stockAlerts"],
    queryFn: async () => {
      const response = await listStockAlerts()
      return response.data.data.items
    },
    enabled: !!token,
    staleTime: 60_000,
  })

  const subscribedIds = useMemo(() => {
    const items = stockAlertsQuery.data ?? []
    return new Set(items.map((item: StockAlert) => item.product.id))
  }, [stockAlertsQuery.data])

  const subscribedSlugs = useMemo(() => {
    const items = stockAlertsQuery.data ?? []
    return new Set(items.map((item: StockAlert) => item.product.slug))
  }, [stockAlertsQuery.data])

  const subscribeMutation = useMutation({
    mutationFn: (slug: string) => subscribeStockAlert(slug),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account.stockAlerts"] })
      const { toast } = await import("sonner")
      toast.success("Flash sale alert subscribed")
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to subscribe to flash sale alert"))
    },
  })

  const unsubscribeMutation = useMutation({
    mutationFn: (slug: string) => unsubscribeStockAlert(slug),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account.stockAlerts"] })
      const { toast } = await import("sonner")
      toast.success("Flash sale alert removed")
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to remove flash sale alert"))
    },
  })

  const toggleStockAlert = useCallback(
    (slug: string) => {
      if (subscribedSlugs.has(slug)) {
        unsubscribeMutation.mutate(slug)
      } else {
        subscribeMutation.mutate(slug)
      }
    },
    [subscribedSlugs, subscribeMutation, unsubscribeMutation],
  )

  const isPending = subscribeMutation.isPending || unsubscribeMutation.isPending

  return { subscribedIds, subscribedSlugs, toggleStockAlert, isPending }
}
