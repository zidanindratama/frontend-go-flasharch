import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type Payment = {
  id: string
  payment_code: string
  order_id: string
  checkout_id: string
  user_id: string
  gateway: string
  gateway_session_id: string | null
  gateway_payment_intent_id: string | null
  status: string
  amount: number
  currency: string
  checkout_url: string | null
  expires_at: string | null
  paid_at: string | null
  failed_at: string | null
  created_at: string
  updated_at: string
}

export type PaymentResponse = {
  message: string
  data: Payment
}

export const getPayment = (paymentId: string) =>
  api.get<PaymentResponse>(endpoints.payments.get(paymentId))

export const createCheckoutSession = (paymentId: string) =>
  api.post<PaymentResponse>(endpoints.payments.checkoutSession(paymentId))
