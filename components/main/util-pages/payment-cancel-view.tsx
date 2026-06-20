"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, ShoppingCart, ArrowRight } from "lucide-react"
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
        className="text-muted-foreground"
      />
    </svg>
  )
}

function CancelX() {
  return (
    <svg className="h-10 w-10" viewBox="0 0 44 44" fill="none">
      <motion.circle
        cx="22"
        cy="22"
        r="18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-muted-foreground/30"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: smoothEase }}
      />
      <motion.path
        d="M16 16L28 28M28 16L16 28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-muted-foreground"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay: 0.6, ease: smoothEase }}
      />
    </svg>
  )
}

function VerifiedCheck() {
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

export function PaymentCancelView() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")

  const { data, isLoading } = useQuery({
    queryKey: ["payment.cancel-verify", orderId],
    queryFn: async () => {
      if (!orderId) return null
      const response = await getOrderDetail(orderId)
      return response.data.data
    },
    enabled: !!orderId,
  })

  const orderStatus = data?.status
  const isPaid = orderStatus === "paid"

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-24 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(136,136,136,0.04),transparent_50%)]" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: springBounce }}
          className="mb-8"
        >
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl border transition-colors duration-500 ${
              isPaid
                ? "border-[#FF6600]/20 bg-[#FF6600]/5"
                : "border-border bg-card"
            }`}
          >
            {isLoading ? (
              <SpinnerRing />
            ) : isPaid ? (
              <VerifiedCheck />
            ) : (
              <CancelX />
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
              ? "Checking Status"
              : isPaid
                ? "Payment Verified"
                : "Payment Cancelled"}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
          className="mt-4 text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl"
        >
          {isLoading
            ? "Checking your payment..."
            : isPaid
              ? "Already taken care of!"
              : "No worries!"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: smoothEase }}
          className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {isLoading
            ? "We are verifying your payment status."
            : isPaid
              ? "Your payment was already processed successfully. No worries — check your orders for details."
              : "You cancelled the payment. Your cart is saved and ready when you are."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: smoothEase }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href={isPaid ? "/account/orders" : "/account/cart"}
            className="group inline-flex items-center gap-2 rounded-full bg-[#FF6600] px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#e65c00] hover:shadow-lg hover:shadow-[#FF6600]/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            {isPaid ? "View Orders" : "Back to Cart"}
          </Link>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-medium transition-all duration-200 hover:bg-muted hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingCart className="h-4 w-4" />
            Browse Products
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
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
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted-foreground opacity-40" />
              <span className="relative inline-flex h-full w-full rounded-full bg-muted-foreground" />
            </span>
            trace_id: payment_cancel
          </span>
        </motion.div>
      </div>
    </div>
  )
}
