"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  CreditCard,
  MapPin,
  Package,
  Truck,
} from "lucide-react"
import { OrderStatusBadge } from "@/components/common/order-status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getOrderDetail, type OrderDetail as OrderDetailType } from "@/lib/api/account"
import { useAuthStore } from "@/stores/auth"
import { cn } from "@/lib/utils"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function Timeline({ steps }: { steps: OrderDetailType["timeline"] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const isCompleted = step.state === "completed"
        const isCurrent = step.state === "current"

        return (
          <div key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  isCompleted && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                  isCurrent && "bg-[#FF6600]/15 text-[#FF6600]",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground/50",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-3.5 w-3.5" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-px flex-1 min-h-6",
                    isCompleted ? "bg-emerald-500/30" : "bg-border",
                  )}
                />
              )}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium",
                  isCurrent && "text-[#FF6600]",
                  isCompleted && "text-foreground",
                  !isCompleted && !isCurrent && "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              {step.occurred_at && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(step.occurred_at).toLocaleString("en", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function OrderDetail() {
  const params = useParams<{ id: string }>()
  const token = useAuthStore((s) => s.access_token)

  const { data, isLoading, error } = useQuery({
    queryKey: ["account.order", params.id],
    queryFn: async () => {
      const response = await getOrderDetail(params.id)
      return response.data
    },
    enabled: !!token && !!params.id,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-60 rounded-xl" />
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="space-y-4">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          My Orders
        </Link>
        <div className="flex flex-col items-center justify-center rounded-xl bg-card px-4 py-20 text-center ring-1 ring-foreground/10">
          <p className="text-sm font-medium text-muted-foreground">
            Order not found
          </p>
        </div>
      </div>
    )
  }

  const order = data.data

  return (
    <div className="space-y-4">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        My Orders
      </Link>

      <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="break-all text-base font-bold tracking-tight text-foreground">
              {order.order_code}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(order.created_at).toLocaleString("en", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <p className="text-base font-bold tabular-nums text-foreground">
              {formatCurrency(order.total_amount)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left: Items + Timeline */}
        <div className="space-y-4">
          <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Items</p>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.product_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="absolute inset-0 m-auto h-5 w-5 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.sku} &middot; Qty {item.quantity}
                    </p>
                    {item.original_price_amount > item.unit_price_amount && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-through">
                        {formatCurrency(item.original_price_amount)}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                    {formatCurrency(item.line_total_amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Timeline</p>
            </div>
            <Timeline steps={order.timeline} />
          </div>
        </div>

        {/* Right: Payment + Address + Shipment */}
        <div className="space-y-4">
          {/* Payment */}
          {order.payment && (
            <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Payment</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gateway</span>
                  <span className="capitalize font-medium">{order.payment.gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <OrderStatusBadge status={order.payment.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(order.subtotal_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(order.shipping_cost)}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(order.payment.amount)}
                  </span>
                </div>
                {order.payment.paid_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid at</span>
                    <span className="tabular-nums">
                      {new Date(order.payment.paid_at).toLocaleString("en", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {order.address && (
            <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Shipping Address</p>
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="font-medium text-foreground">{order.address.recipient_name}</p>
                <p className="text-muted-foreground">{order.address.phone}</p>
                <p className="text-muted-foreground">
                  {order.address.address_line}
                </p>
                <p className="text-muted-foreground">
                  {order.address.district}, {order.address.city}, {order.address.province} {order.address.postal_code}
                </p>
              </div>
            </div>
          )}

          {/* Shipment */}
          {order.shipment && (
            <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <div className="mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Shipment</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrier</span>
                  <span className="font-medium">{order.shipment.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking</span>
                  <span className="font-medium tabular-nums">
                    {order.shipment.tracking_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <OrderStatusBadge status={order.shipment.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipped at</span>
                  <span className="tabular-nums">
                    {new Date(order.shipment.shipped_at).toLocaleString("en", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {order.shipment.delivered_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivered at</span>
                    <span className="tabular-nums">
                      {new Date(order.shipment.delivered_at).toLocaleString("en", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
