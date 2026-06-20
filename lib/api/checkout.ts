import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type CheckoutOrderItem = {
  id: string
  product_id: string
  flash_sale_item_id: string | null
  reservation_id: string
  product_name: string
  sku: string
  quantity: number
  unit_price_amount: number
  original_price_amount: number
  line_total_amount: number
  currency: string
  weight: number
  thumbnail_url: string | null
}

export type CheckoutOrder = {
  id: string
  order_code: string
  checkout_id: string
  status: string
  subtotal_amount: number
  shipping_cost: number
  total_amount: number
  currency: string
  address_id: string | null
  items: CheckoutOrderItem[]
}

export type Checkout = {
  checkout_id: string
  reservation_ids: string[]
  status: string
  status_url: string
  expires_at: string
  checkout_code: string
  source: string
  cart_id: string | null
  flash_sale_id: string | null
  subtotal_amount: number
  shipping_cost: number
  total_amount: number
  currency: string
  address_id: string | null
  failure_code: string | null
  failure_message: string | null
  order: CheckoutOrder | null
  created_at: string
  updated_at: string
}

export type CheckoutResponse = {
  message: string
  data: Checkout
}

export type CheckoutAccepted = {
  checkout_id: string
  reservation_ids: string[]
  status: string
  status_url: string
  expires_at: string
}

export type CheckoutAcceptedResponse = {
  message: string
  data: CheckoutAccepted
}

export type CartCheckoutInput = {
  cart_id: string
  address_id?: string
  shipping_cost?: number
  carrier?: string
}

export type DirectFlashSaleCheckoutInput = {
  flash_sale_item_id: string
  quantity: number
  address_id?: string
  shipping_cost?: number
  carrier?: string
}

export const createCartCheckout = (data: CartCheckoutInput, idempotencyKey: string) =>
  api.post<CheckoutAcceptedResponse>(endpoints.checkouts.cart, data, {
    headers: { "Idempotency-Key": idempotencyKey },
  })

export const createDirectFlashSaleCheckout = (data: DirectFlashSaleCheckoutInput) =>
  api.post<CheckoutAcceptedResponse>(endpoints.checkouts.directFlashSale, data, {
    headers: { "Idempotency-Key": crypto.randomUUID() },
  })

export const getCheckout = (checkoutId: string) =>
  api.get<CheckoutResponse>(endpoints.checkouts.get(checkoutId))

export type AdminOrderRow = {
  id: string
  order_code: string
  status: string
  subtotal_amount: number
  shipping_cost: number
  carrier: string
  total_amount: number
  currency: string
  item_count: number
  buyer: { id: string; email: string; full_name: string }
  checkout: {
    id: string
    checkout_code: string
    status: string
    source: string
    flash_sale_id: string | null
  } | null
  payment: {
    id: string
    payment_code: string
    status: string
    amount: number
    currency: string
    gateway: string
  } | null
  shipment: {
    id: string
    carrier: string
    tracking_number: string
    status: string
    shipped_at: string
    delivered_at: string | null
  } | null
  address: {
    recipient_name: string
    phone: string
    province: string
    city: string
    district: string
    village_code: string
    postal_code: string
    address_line: string
  } | null
  created_at: string
  updated_at: string
}

export type AdminOrderDetail = AdminOrderRow & {
  items: {
    id: string
    product_id: string | null
    flash_sale_item_id: string | null
    reservation_id: string | null
    product_name: string
    sku: string
    quantity: number
    unit_price_amount: number
    line_total_amount: number
    currency: string
    created_at: string
  }[]
  reservations: unknown[]
  timeline: {
    status: string
    label: string
    occurred_at: string | null
    state: "completed" | "current" | "pending" | "failed"
  }[]
}

export type AdminOrderListParams = {
  page?: number
  per_page?: number
  search?: string
  status?: string
  payment_status?: string
  source?: string
  user_id?: string
  flash_sale_id?: string
  product_id?: string
  date_from?: string
  date_to?: string
  sort?: string
  order?: "asc" | "desc"
}

export type AdminOrderListResponse = {
  message: string
  data: {
    items: AdminOrderRow[]
    page: number
    per_page: number
    total: number
  }
}

export type AdminOrderDetailResponse = {
  message: string
  data: AdminOrderDetail
}

export type ShipOrderInput = {
  carrier: string
  tracking_number: string
}

export const listAdminOrders = (params?: AdminOrderListParams) =>
  api.get<AdminOrderListResponse>(endpoints.admin.orders, { params })

export const getAdminOrder = (orderId: string) =>
  api.get<AdminOrderDetailResponse>(
    `${endpoints.admin.orders}/${orderId}`,
  )

export const shipOrder = (orderId: string, input: ShipOrderInput) =>
  api.post<{ message: string; data: AdminOrderRow }>(
    `${endpoints.admin.orders}/${orderId}/ship`,
    input,
  )

export const deliverOrder = (orderId: string) =>
  api.patch<{ message: string; data: AdminOrderRow }>(
    `${endpoints.admin.orders}/${orderId}/deliver`,
  )
