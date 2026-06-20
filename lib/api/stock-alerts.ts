import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type StockAlertProduct = {
  id: string
  sku: string
  slug: string
  name: string
  base_price_amount: number
  currency: string
  status: string
  weight: number
  thumbnail_url: string | null
}

export type StockAlert = {
  id: string
  user_id: string
  product: StockAlertProduct
  created_at: string
}

export type StockAlertsResponse = {
  message: string
  data: { items: StockAlert[] }
}

export type StockAlertResponse = {
  message: string
  data: StockAlert
}

export const listStockAlerts = () =>
  api.get<StockAlertsResponse>(endpoints.user.stockAlerts)

export const subscribeStockAlert = (slug: string) =>
  api.post<StockAlertResponse>(endpoints.productStockAlert(slug))

export const unsubscribeStockAlert = (slug: string) =>
  api.delete<{ message: string; data: null }>(endpoints.productStockAlert(slug))
