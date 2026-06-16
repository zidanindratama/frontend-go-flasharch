"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { createCartCheckout, getCheckout } from "@/lib/api/checkout"
import { createCheckoutSession } from "@/lib/api/payment"

export function useCartCheckout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cartId: string) =>
      createCartCheckout(
        { cart_id: cartId },
        crypto.randomUUID(),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(error.message || "Failed to start checkout")
    },
  })
}

export function useCheckoutPolling(checkoutId: string | null, enabled: boolean) {
  const router = useRouter()
  const pollCountRef = useRef(0)
  const maxPolls = 60
  const intervalMs = 2000

  const checkoutQuery = useQuery({
    queryKey: ["checkout", checkoutId],
    queryFn: async () => {
      const response = await getCheckout(checkoutId!)
      return response.data.data
    },
    enabled: enabled && !!checkoutId,
    refetchInterval: enabled && !!checkoutId ? intervalMs : false,
  })

  const checkout = checkoutQuery.data
  const status = checkout?.status

  useEffect(() => {
    if (!enabled || !checkoutId) return

    pollCountRef.current += 1
    if (pollCountRef.current >= maxPolls) {
      const toastAsync = async () => {
        const { toast: t } = await import("sonner")
        t.error("Checkout timed out. Please try again.")
      }
      toastAsync()
      router.push("/account/cart")
    }
  }, [checkoutId, enabled, router, checkoutQuery.dataUpdatedAt])

  useEffect(() => {
    if (status === "failed" || status === "expired") {
      const msg = status === "failed" ? "Checkout failed" : "Checkout expired"
      const toastAsync = async () => {
        const { toast: t } = await import("sonner")
        t.error(msg)
      }
      toastAsync()
      router.push("/account/cart")
    }
  }, [status, router])

  return { checkout, status, isLoading: checkoutQuery.isLoading }
}

export function usePaymentCheckout() {
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await createCheckoutSession(paymentId)
      return response.data.data
    },
    onSuccess: (payment) => {
      if (payment.checkout_url) {
        window.location.href = payment.checkout_url
      }
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(error.message || "Failed to create payment session")
    },
  })
}

export function useCheckoutFlow(cartId: string | null) {
  const router = useRouter()
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [phase, setPhase] = useState<
    "idle" | "checkout" | "polling" | "payment" | "redirecting" | "error"
  >("idle")
  const processedRef = useRef(false)

  const cartCheckoutMutation = useCartCheckout()
  const { checkout, status } = useCheckoutPolling(
    checkoutId,
    phase === "polling",
  )
  const paymentCheckoutMutation = usePaymentCheckout()

  const startCheckout = useCallback(async () => {
    if (!cartId) return
    setPhase("checkout")
    processedRef.current = false

    try {
      const response = await cartCheckoutMutation.mutateAsync(cartId)
      setCheckoutId(response.data.data.checkout_id)
      setPhase("polling")
    } catch {
      setPhase("error")
    }
  }, [cartId, cartCheckoutMutation])

  useEffect(() => {
    if (
      phase === "polling" &&
      status === "waiting_payment" &&
      checkout?.order &&
      !processedRef.current
    ) {
      processedRef.current = true
      setPhase("payment")

      const fetchPaymentAndRedirect = async () => {
        try {
          const orderResponse = await import("@/lib/api/checkout").then(
            (m) => m.getCheckout(checkoutId!),
          )
          const order = orderResponse.data.data.order
          if (!order) {
            throw new Error("Order not found")
          }

          const buyerOrdersResponse = await import("@/lib/api/account").then(
            (m) => m.getBuyerOrders({ per_page: 100 }),
          )
          const orderRow = buyerOrdersResponse.data.data.items.find(
            (o) => o.id === order.id,
          )
          if (!orderRow?.payment) {
            throw new Error("Payment not found")
          }

          setPaymentId(orderRow.payment.id)
          setPhase("redirecting")

          const paymentResponse = await createCheckoutSession(orderRow.payment.id)
          const payment = paymentResponse.data.data

          if (payment.checkout_url) {
            window.location.href = payment.checkout_url
          }
        } catch {
          const { toast } = await import("sonner")
          toast.error("Failed to process payment. Please check your orders.")
          setPhase("error")
          router.push("/account/orders")
        }
      }

      fetchPaymentAndRedirect()
    }
  }, [phase, status, checkout, checkoutId, router])

  const effectivePhase = phase === "polling" && status === "failed" ? "error" : phase

  return {
    phase: effectivePhase,
    checkoutId,
    paymentId,
    checkout,
    startCheckout,
    isStarting: cartCheckoutMutation.isPending,
    isRedirecting: paymentCheckoutMutation.isPending,
  }
}
