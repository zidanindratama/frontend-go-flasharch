"use client"

import { cn } from "@/lib/utils"

type OrderRow = {
  id: string
  order_code: string
  status: string
  total_amount: number
  currency: string
  buyer: { email: string; full_name: string }
  created_at: string
}

type OrdersTableProps = {
  orders: OrderRow[]
}

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  cancelled: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  expired: "bg-muted text-muted-foreground",
  shipped: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  completed: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount / 100)
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border bg-background text-sm text-muted-foreground">
        No orders yet
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-2.5 sm:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-border bg-background p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-all font-medium leading-5 text-foreground">
                  {order.order_code}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {order.buyer.full_name || order.buyer.email}
                </p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {timeAgo(order.created_at)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="font-semibold tabular-nums text-foreground">
                {formatCurrency(order.total_amount)}
              </span>
              <span
                className={cn(
                  "inline-flex min-w-0 max-w-[58%] items-center truncate rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                  statusStyles[order.status] || statusStyles.expired,
                )}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">Order</th>
            <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">Buyer</th>
            <th className="pb-3 pr-4 text-right font-medium text-muted-foreground">Amount</th>
            <th className="pb-3 pr-4 text-center font-medium text-muted-foreground">Status</th>
            <th className="pb-3 text-right font-medium text-muted-foreground">Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
            >
              <td className="py-3 pr-4 font-medium text-foreground">
                <span className="line-clamp-2 break-all">{order.order_code}</span>
              </td>
              <td className="py-3 pr-4 text-muted-foreground truncate max-w-[180px]">
                {order.buyer.full_name || order.buyer.email}
              </td>
              <td className="py-3 pr-4 text-right font-medium tabular-nums text-foreground">
                {formatCurrency(order.total_amount)}
              </td>
              <td className="py-3 pr-4 text-center">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                    statusStyles[order.status] || statusStyles.expired,
                  )}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-3 text-right text-muted-foreground tabular-nums">
                {timeAgo(order.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}
