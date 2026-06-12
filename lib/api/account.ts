import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type PaymentSummary = {
  id: string
  payment_code: string
  status: string
  amount: number
  currency: string
  gateway: string
  checkout_url: string | null
  expires_at: string | null
  paid_at: string | null
  failed_at: string | null
  created_at?: string
  updated_at?: string
}

export type BuyerOrderRow = {
  id: string
  order_code: string
  checkout_id: string
  status: string
  subtotal_amount: number
  total_amount: number
  currency: string
  item_count: number
  payment: PaymentSummary | null
  created_at: string
  updated_at: string
}

export type BuyerDashboardResponse = {
  message: string
  data: {
    total_orders: number
    total_spent_amount: number
    pending_payment_count: number
    active_reservation_count: number
    latest_orders: BuyerOrderRow[]
  }
}

export type BuyerOrdersResponse = {
  message: string
  data: {
    items: BuyerOrderRow[]
    page: number
    per_page: number
    total: number
  }
}

export type BuyerOrdersParams = {
  page?: number
  per_page?: number
  search?: string
  status?: string
  payment_status?: string
  date_from?: string
  date_to?: string
  sort?: "created_at" | "updated_at" | "total_amount" | "status" | "payment_status"
  order?: "asc" | "desc"
}

export type UserAddress = {
  id: string
  user_id: string
  label: string
  recipient_name: string
  phone: string
  province: string
  city: string
  district: string
  postal_code: string
  address_line: string
  notes: string
  latitude: number | null
  longitude: number | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export type AddressesResponse = {
  message: string
  data: { items: UserAddress[] }
}

export type ProductSummary = {
  id: string
  sku: string
  slug: string
  name: string
  base_price_amount: number
  currency: string
  status: string
  thumbnail_url: string | null
}

export type WishlistItem = {
  id: string
  user_id: string
  product: ProductSummary
  created_at: string
}

export type WishlistResponse = {
  message: string
  data: { items: WishlistItem[] }
}

export const getBuyerDashboard = () =>
  api.get<BuyerDashboardResponse>(endpoints.user.dashboard)

export const getBuyerOrders = (params?: BuyerOrdersParams) =>
  api.get<BuyerOrdersResponse>(endpoints.orders.list, { params })

export const getBuyerAddresses = () =>
  api.get<AddressesResponse>(endpoints.user.addresses)

export const getBuyerWishlist = () =>
  api.get<WishlistResponse>(endpoints.user.wishlist)
