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
  total_amount: number
  currency: string
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
  total_amount: number
  currency: string
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
}

export const createCartCheckout = (data: CartCheckoutInput, idempotencyKey: string) =>
  api.post<CheckoutAcceptedResponse>(endpoints.checkouts.cart, data, {
    headers: { "Idempotency-Key": idempotencyKey },
  })

export const getCheckout = (checkoutId: string) =>
  api.get<CheckoutResponse>(endpoints.checkouts.get(checkoutId))
