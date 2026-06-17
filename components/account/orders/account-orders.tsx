"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation } from "@tanstack/react-query"
import { CreditCard, Loader2, PackageOpen, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getBuyerOrders,
  type BuyerOrderRow,
} from "@/lib/api/account"
import { createCheckoutSession } from "@/lib/api/payment"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function statusStyle(status: string) {
  if (["paid", "completed", "confirmed"].includes(status)) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  }
  if (["pending", "pending_payment", "waiting_payment"].includes(status)) {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  }
  if (["cancelled", "failed", "expired"].includes(status)) {
    return "bg-red-500/10 text-red-600 dark:text-red-400"
  }
  return "bg-muted text-muted-foreground"
}

function OrderCard({ order }: { order: BuyerOrderRow }) {
  const [isPaying, setIsPaying] = useState(false)
  const isUnpaid = ["pending", "pending_payment", "waiting_payment"].includes(order.status)
  const hasPaymentUrl = order.payment?.checkout_url

  const payMutation = useMutation({
    mutationFn: (paymentId: string) => createCheckoutSession(paymentId),
    onSuccess: async (response) => {
      const url = response.data.data.checkout_url
      if (url) {
        window.location.href = url
      }
    },
    onError: () => {
      setIsPaying(false)
    },
  })

  function handlePayNow() {
    if (!order.payment?.id) return
    setIsPaying(true)
    payMutation.mutate(order.payment.id)
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease }}
      className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-all text-sm font-semibold text-foreground">
            {order.order_code}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {order.item_count} item{order.item_count === 1 ? "" : "s"} -{" "}
            {new Date(order.created_at).toLocaleString("en", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
          <p className="text-base font-bold tabular-nums text-foreground">
            {formatCurrency(order.total_amount)}
          </p>
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize sm:mt-1",
              statusStyle(order.status),
            )}
          >
            {order.status.replaceAll("_", " ")}
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {order.payment ? (
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" />
            <span className="capitalize">{order.payment.gateway}</span>
            <span>-</span>
            <span className="capitalize">{order.payment.status.replaceAll("_", " ")}</span>
          </div>
        ) : null}
        {isUnpaid && hasPaymentUrl && (
          <Button
            size="sm"
            className="gap-1.5 rounded-lg bg-[#FF6600] text-white hover:bg-[#FF6600]/90"
            disabled={isPaying}
            onClick={handlePayNow}
          >
            {isPaying ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CreditCard className="h-3.5 w-3.5" />
            )}
            Bayar Sekarang
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export function AccountOrders() {
  const token = useAuthStore((s) => s.access_token)
  const { data, isLoading } = useQuery({
    queryKey: ["account.orders", { page: 1, perPage: 10, sort: "created_at", order: "desc" }],
    queryFn: async () => {
      const response = await getBuyerOrders({
        page: 1,
        per_page: 10,
        sort: "created_at",
        order: "desc",
      })
      return response.data
    },
    enabled: !!token,
  })

  const orders = data?.data.items ?? []

  return (
    <div className="space-y-4">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.45, ease }}
        className="text-lg font-bold tracking-tight lg:text-xl"
      >
        My Orders
      </motion.h1>

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : orders.length ? (
        <div className="grid gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col items-center justify-center rounded-xl bg-card px-4 py-20 text-center ring-1 ring-foreground/10"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease }}
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6600]/8"
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <PackageOpen className="h-7 w-7 text-[#FF6600]/60" />
        </motion.div>
      </motion.div>
      <h2 className="text-base font-semibold tracking-tight">No orders yet</h2>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Your checkout and payment history will appear here.
      </p>
      <Button asChild className="mt-6 gap-2 rounded-full">
        <Link href="/products">
          <ShoppingBag className="h-4 w-4" />
          Browse products
        </Link>
      </Button>
    </motion.div>
  )
}
