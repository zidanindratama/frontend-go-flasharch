"use client"

import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { CreditCard, PackageOpen } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getBuyerOrders,
  type BuyerOrderRow,
} from "@/lib/api/account"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount / 100)
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
      {order.payment ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <CreditCard className="h-3.5 w-3.5" />
          <span className="capitalize">{order.payment.gateway}</span>
          <span>-</span>
          <span className="capitalize">{order.payment.status.replaceAll("_", " ")}</span>
        </div>
      ) : null}
    </motion.div>
  )
}

export function AccountOrders() {
  const token = useAuthStore((s) => s.access_token)
  const { data, isLoading } = useQuery({
    queryKey: ["buyer-orders", 1, 10],
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
        <EmptyState
          icon={PackageOpen}
          title="No orders yet"
          copy="Your checkout and payment history will appear here."
        />
      )}
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof PackageOpen
  title: string
  copy: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-card px-4 py-20 text-center ring-1 ring-foreground/10">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
        <Icon className="h-6 w-6 text-muted-foreground/60" />
      </div>
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{copy}</p>
    </div>
  )
}
