"use client"

import { motion } from "framer-motion"
import { ShoppingBag, ChevronRight, PackageOpen } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  formatCurrency,
  formatDate,
  type MockOrder,
  type OrderStatus,
} from "@/lib/account-mock"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  paid: {
    label: "Paid",
    className: "bg-[#06D6A0]/10 text-[#06D6A0]",
  },
  waiting_payment: {
    label: "Waiting Payment",
    className: "bg-[#FF6B00]/10 text-[#FF6B00]",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-[#E63946]/10 text-[#E63946]",
  },
}

function OrderRow({ order, index }: { order: MockOrder; index: number }) {
  const status = statusConfig[order.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.06, duration: 0.45, ease }}
      className="flex flex-col gap-2 px-3 py-3 transition-colors hover:bg-muted/40 sm:px-4 sm:py-3.5 lg:flex-row lg:items-center lg:gap-4"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <ShoppingBag className="h-4 w-4 text-muted-foreground/60" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{order.product_name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {order.id} &middot; {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-start sm:gap-4 lg:shrink-0">
        <div>
          <p className="text-sm font-semibold tabular-nums lg:text-right">
            {formatCurrency(order.total_amount)}
          </p>
          <p className="text-xs text-muted-foreground">
            {order.item_count} {order.item_count === 1 ? "item" : "items"}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[10px] font-semibold",
            status.className,
          )}
        >
          {status.label}
        </span>
      </div>
    </motion.div>
  )
}

export function LatestOrders({ orders }: { orders: MockOrder[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1">
        <motion.h2
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease }}
          className="text-sm font-semibold tracking-tight"
        >
          Latest Orders
        </motion.h2>

        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.45, ease }}
          >
            <Link
              href="/account/orders"
              className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        )}
      </div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.45, ease }}
          className="flex flex-col items-center justify-center rounded-xl bg-card py-14 ring-1 ring-foreground/10 sm:py-16"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
            <PackageOpen className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No orders yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Your completed orders will appear here.
          </p>
        </motion.div>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          {orders.map((order, i) => (
            <OrderRow key={order.id} order={order} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
