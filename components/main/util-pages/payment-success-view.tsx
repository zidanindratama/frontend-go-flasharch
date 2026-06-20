"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { ShoppingBag, ArrowRight, Clock } from "lucide-react"
import { getOrderDetail } from "@/lib/api/account"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]
const springBounce: [number, number, number, number] = [0.34, 1.56, 0.64, 1]

function SpinnerRing() {
  return (
    <svg className="h-10 w-10 animate-spin" viewBox="0 0 44 44" fill="none">
      <circle
        cx="22"
        cy="22"
        r="18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-muted-foreground/20"
      />
      <path
        d="M40 22a18 18 0 0 0-18-18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-[#FF6600]"
      />
    </svg>
  )
}

function SuccessCheckmark() {
  return (
    <svg className="h-10 w-10" viewBox="0 0 44 44" fill="none">
      <motion.circle
        cx="22"
        cy="22"
        r="18"
        stroke="#FF6600"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
      />
      <motion.path
        d="M14 22.5L20 28.5L30 16.5"
        stroke="#FF6600"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.7, ease: smoothEase }}
      />
    </svg>
  )
}

export function PaymentSuccessView() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")

  const { data, isLoading } = useQuery({
    queryKey: ["payment.verify", orderId],
    queryFn: async () => {
      if (!orderId) return null
      const response = await getOrderDetail(orderId)
      return response.data.data
    },
    enabled: !!orderId,
    refetchInterval: (query) => {
      if (query.state.data?.status === "paid") return false
      return 3000
    },
    staleTime: 0,
  })

  const orderStatus = data?.status
  const isPaid = orderStatus === "paid"
  const isPending = orderStatus === "pending_payment"

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-24 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,102,0,0.06),transparent_50%)]" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: springBounce }}
          className="relative mb-8"
        >
          {isPaid && (
            <motion.div
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[#FF6600]/10"
              style={{ width: 80, height: 80, left: 0, top: 0 }}
            />
          )}
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl border transition-colors duration-500 ${
              isPaid
                ? "border-[#FF6600]/20 bg-[#FF6600]/5"
                : "border-border bg-card"
            }`}
          >
            {isLoading || isPending ? (
              <SpinnerRing />
            ) : (
              <SuccessCheckmark />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: smoothEase }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {isLoading
              ? "Verifying Payment"
              : isPaid
                ? "Payment Verified"
                : isPending
                  ? "Payment In Progress"
                  : "Payment Verified"}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
          className="mt-4 text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl"
        >
          {isLoading
            ? "Verifying your payment..."
            : isPaid
              ? "You are all set!"
              : isPending
                ? "Processing your payment..."
                : "You are all set!"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: smoothEase }}
          className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {isLoading
            ? "We are confirming your payment status with our system."
            : isPaid
              ? "Your payment has been confirmed. A confirmation email is on its way."
              : isPending
                ? "Your payment is being processed. This usually takes a few moments."
                : "Your payment has been confirmed. Check your orders for details."}
        </motion.p>

        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-6 flex items-center gap-2.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-40" />
              <span className="relative inline-flex h-full w-full rounded-full bg-amber-500" />
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Auto-refreshing every 3s
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: smoothEase }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/account/orders"
            className="group inline-flex items-center gap-2 rounded-full bg-[#FF6600] px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#e65c00] hover:shadow-lg hover:shadow-[#FF6600]/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="h-4 w-4" />
            View Orders
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-medium transition-all duration-200 hover:bg-muted hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue Shopping
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-14 font-mono text-xs text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6600] opacity-40" />
              <span className="relative inline-flex h-full w-full rounded-full bg-[#FF6600]" />
            </span>
            trace_id: payment_verify
          </span>
        </motion.div>
      </div>
    </div>
  )
}
