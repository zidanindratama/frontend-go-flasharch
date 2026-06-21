import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type AdminSummary = {
  from: string
  to: string
  total_orders: number
  paid_orders: number
  pending_orders: number
  cancelled_orders: number
  expired_checkouts: number
  gross_revenue_amount: number
  average_order_amount: number
  signup_count: number
  active_buyer_count: number
  active_flash_sale_count: number
}

export type AdminSummaryResponse = {
  message: string
  data: AdminSummary
}

export type ProductPerformance = {
  product_id: string
  sku: string
  name: string
  sold_quantity: number
  paid_order_count: number
  gross_revenue_amount: number
  pending_quantity: number
  cancelled_quantity: number
}

export type ProductPerformanceResponse = {
  message: string
  data: {
    items: ProductPerformance[]
    page: number
    per_page: number
    total: number
  }
}

export type ProductPerformanceParams = {
  from?: string
  to?: string
  page?: number
  per_page?: number
  sort?: string
  order?: "asc" | "desc"
}

export const getAdminSummary = (params?: { from?: string; to?: string }) =>
  api.get<AdminSummaryResponse>(endpoints.admin.summary, { params })

export const getProductPerformance = (params?: ProductPerformanceParams) =>
  api.get<ProductPerformanceResponse>(endpoints.admin.reportsProducts, { params })
