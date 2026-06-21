"use client"

import { useQuery } from "@tanstack/react-query"
import {
  getAdminSummary,
  getProductPerformance,
  type ProductPerformanceParams,
} from "@/lib/api/admin-reports"
import { useAuthStore } from "@/stores/auth"

export function useAdminSummary(dateRange?: { from?: string; to?: string }) {
  const token = useAuthStore((s) => s.access_token)

  return useQuery({
    queryKey: ["admin.summary", dateRange?.from, dateRange?.to],
    queryFn: async () => {
      const response = await getAdminSummary({
        from: dateRange?.from,
        to: dateRange?.to,
      })
      return response.data.data
    },
    enabled: !!token,
  })
}

export function useProductPerformance(params?: ProductPerformanceParams) {
  const token = useAuthStore((s) => s.access_token)

  return useQuery({
    queryKey: [
      "admin.productPerformance",
      params?.from,
      params?.to,
      params?.page,
      params?.per_page,
      params?.sort,
      params?.order,
    ],
    queryFn: async () => {
      const response = await getProductPerformance(params)
      return response.data.data
    },
    enabled: !!token,
  })
}
