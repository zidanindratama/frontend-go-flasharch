import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type PublicFlashSaleItemListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
}

export type FlashSaleStatus = "draft" | "scheduled" | "running" | "ended" | "cancelled"
export type FlashSaleItemStatus = "active" | "hidden" | "sold_out"

export type FlashSaleItem = {
  id: string
  flash_sale_id: string
  product_id: string
  product: {
    id: string
    sku: string
    slug: string
    name: string
    weight: number
  }
  sale_price_amount: number
  currency: string
  sale_stock_quantity: number
  reserved_quantity: number
  sold_quantity: number
  remaining_quantity: number
  status: FlashSaleItemStatus
  created_at: string
  updated_at: string
}

export type FlashSale = {
  id: string
  slug: string
  name: string
  description: string
  starts_at: string
  ends_at: string
  status: FlashSaleStatus
  redis_preloaded_at: string | null
  items: FlashSaleItem[]
  created_by_user_id: string | null
  updated_by_user_id: string | null
  created_at: string
  updated_at: string
}

export type FlashSaleListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
  status?: FlashSaleStatus
}

export type FlashSaleItemListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
  status?: FlashSaleItemStatus
}

export type FlashSaleCreateInput = {
  name: string
  slug: string
  description: string
  starts_at: string
  ends_at: string
}

export type FlashSaleUpdateInput = {
  name?: string
  description?: string
  starts_at?: string
  ends_at?: string
}

export type FlashSaleStatusInput = {
  status: FlashSaleStatus
}

export type FlashSaleItemCreateInput = {
  product_id: string
  sale_price_amount: number
  currency: string
  sale_stock_quantity: number
}

export type FlashSaleItemUpdateInput = {
  sale_price_amount: number
  sale_stock_quantity: number
}

export type FlashSaleReadiness = {
  sale_id: string
  ready: boolean
  missing_keys: string[]
}

export type FlashSalePreloadResult = {
  sale_id: string
  items_preloaded: number
  preloaded_at: string
}

export type FlashSaleReleaseResult = {
  sale_id: string
  released: number
}

export type FlashSaleReportItem = {
  item_id: string
  product_id: string
  sku: string
  product_name: string
  sale_stock_quantity: number
  reserved_quantity: number
  sold_quantity: number
  remaining_quantity: number
}

export type FlashSaleReport = {
  sale_id: string
  slug: string
  name: string
  status: FlashSaleStatus
  starts_at: string
  ends_at: string
  items: FlashSaleReportItem[]
  checkout_counts: Record<string, number>
  paid_orders: number
  pending_payments: number
  revenue_amount: number
  total_checkouts: number
  confirmed_checkouts: number
  conversion_rate: number
  generated_at: string
}

export function getActiveFlashSale() {
  return api.get<{ message: string; data: FlashSale }>(`${endpoints.flashSales}/active`)
}

export function getPublicFlashSaleItems(slug: string, params: PublicFlashSaleItemListParams) {
  return api.get<{
    message: string
    data: {
      items: FlashSaleItem[]
      page: number
      per_page: number
      total: number
    }
  }>(`${endpoints.flashSales}/${slug}/items`, { params })
}

export function listAdminFlashSales(params: FlashSaleListParams) {
  return api.get<{ message: string; data: { items: FlashSale[]; page: number; per_page: number; total: number } }>(
    endpoints.admin.flashSales,
    { params },
  )
}

export function getAdminFlashSale(saleId: string, params?: { include_items?: boolean }) {
  return api.get<{ message: string; data: FlashSale }>(`${endpoints.admin.flashSales}/${saleId}`, { params })
}

export function listAdminFlashSaleItems(saleId: string, params: FlashSaleItemListParams) {
  return api.get<{ message: string; data: { items: FlashSaleItem[]; page: number; per_page: number; total: number } }>(
    `${endpoints.admin.flashSales}/${saleId}/items`,
    { params },
  )
}

export function createFlashSale(input: FlashSaleCreateInput) {
  return api.post(endpoints.admin.flashSales, input)
}

export function updateFlashSale(saleId: string, input: FlashSaleUpdateInput) {
  return api.patch(`${endpoints.admin.flashSales}/${saleId}`, input)
}

export function updateFlashSaleStatus(saleId: string, input: FlashSaleStatusInput) {
  return api.patch(`${endpoints.admin.flashSales}/${saleId}/status`, input)
}

export function preloadFlashSale(saleId: string) {
  return api.post<{ message: string; data: FlashSalePreloadResult }>(`${endpoints.admin.flashSales}/${saleId}/preload`)
}

export function checkFlashSaleReadiness(saleId: string) {
  return api.get<{ message: string; data: FlashSaleReadiness }>(`${endpoints.admin.flashSales}/${saleId}/readiness`)
}

export function releaseExpiredReservations(saleId: string) {
  return api.post<{ message: string; data: FlashSaleReleaseResult }>(
    `${endpoints.admin.flashSales}/${saleId}/reservations/release-expired`,
  )
}

export function getFlashSaleReport(saleId: string) {
  return api.get<{ message: string; data: FlashSaleReport }>(
    `${endpoints.admin.flashSales}/${saleId}/report`,
  )
}

export function createFlashSaleItem(saleId: string, input: FlashSaleItemCreateInput) {
  return api.post(`${endpoints.admin.flashSales}/${saleId}/items`, input)
}

export function updateFlashSaleItem(saleId: string, itemId: string, input: FlashSaleItemUpdateInput) {
  return api.patch(`${endpoints.admin.flashSales}/${saleId}/items/${itemId}`, input)
}

export function deleteFlashSaleItem(saleId: string, itemId: string) {
  return api.delete(`${endpoints.admin.flashSales}/${saleId}/items/${itemId}`)
}

export function deleteFlashSale(saleId: string) {
  return api.delete(`${endpoints.admin.flashSales}/${saleId}`)
}
