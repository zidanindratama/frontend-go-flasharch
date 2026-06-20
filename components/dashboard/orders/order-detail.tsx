"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Send,
  Truck,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OrderStatusBadge } from "@/components/common/order-status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  getAdminOrder,
  shipOrder,
  deliverOrder,
  type AdminOrderDetail as AdminOrderDetailType,
} from "@/lib/api/checkout"
import { getErrorMessage } from "@/lib/api/errors"
import { cn } from "@/lib/utils"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function Timeline({ steps }: { steps: AdminOrderDetailType["timeline"] }) {
  return (
    <div className="grid gap-y-4">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const isCompleted = step.state === "completed"
        const isCurrent = step.state === "current"
        const isPending = step.state === "pending"

        return (
          <div key={step.status} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  isCompleted && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                  isCurrent && "bg-[#FF6600]/15 text-[#FF6600]",
                  isPending && "bg-muted text-muted-foreground/40",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-px h-4",
                    isCompleted ? "bg-emerald-500/30" : "bg-border",
                  )}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCurrent && "text-[#FF6600]",
                  isCompleted && "text-foreground",
                  isPending && "text-muted-foreground/50",
                )}
              >
                {step.label}
              </p>
              {step.occurred_at && (
                <p className="mt-0.5 text-xs text-muted-foreground/50">
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

function ShipForm({
  orderId,
  carrier,
  onSuccess,
}: {
  orderId: string
  carrier: string
  onSuccess: () => void
}) {
  const [carrierValue, setCarrierValue] = useState(carrier)
  const [trackingNumber, setTrackingNumber] = useState("")

  const shipMutation = useMutation({
    mutationFn: () => shipOrder(orderId, { carrier: carrierValue, tracking_number: trackingNumber }),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Order shipped successfully")
      onSuccess()
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to ship order"))
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    shipMutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Carrier
        </label>
        <Input
          placeholder="e.g. JNE, J&T, SiCepat"
          value={carrierValue}
          onChange={(e) => setCarrierValue(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Tracking Number
        </label>
        <Input
          placeholder="e.g. JN0012345678"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={shipMutation.isPending || !carrierValue || !trackingNumber}
        className="gap-2 rounded-lg bg-[#FF6600] text-white hover:bg-[#FF6600]/90"
      >
        {shipMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Ship Order
      </Button>
    </form>
  )
}

export function OrderDetail() {
  const params = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [deliverConfirmOpen, setDeliverConfirmOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin.order", params.id],
    queryFn: async () => {
      const response = await getAdminOrder(params.id)
      return response.data
    },
  })

  const deliverMutation = useMutation({
    mutationFn: () => deliverOrder(params.id),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Order marked as delivered")
      setDeliverConfirmOpen(false)
      await queryClient.invalidateQueries({ queryKey: ["admin.order", params.id] })
      await queryClient.invalidateQueries({ queryKey: ["admin.orders"] })
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to deliver order"))
      setDeliverConfirmOpen(false)
    },
  })

  function handleInvalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin.order", params.id] })
    queryClient.invalidateQueries({ queryKey: ["admin.orders"] })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All orders
        </Link>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-4 py-20 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Order not found
          </p>
        </div>
      </div>
    )
  }

  const order = data.data
  const canShip = order.status === "paid"
  const canDeliver = order.status === "shipped"

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All orders
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                {order.order_code}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {order.buyer.full_name || order.buyer.email}
              </span>
              <span>
                {new Date(order.created_at).toLocaleString("en", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {formatCurrency(order.total_amount)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left: Items + Timeline */}
        <div className="space-y-4">
          {/* Items */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">Items</p>
              <span className="ml-auto text-xs text-muted-foreground">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
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

          {/* Timeline */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">Timeline</p>
            </div>
            <Timeline steps={order.timeline} />
          </div>
        </div>

        {/* Right: Payment + Shipment + Actions */}
        <div className="space-y-4">
          {/* Payment */}
          {order.payment && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Payment</p>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Gateway</span>
                  <span className="capitalize font-medium text-foreground">
                    {order.payment.gateway}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <OrderStatusBadge status={order.payment.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatCurrency(order.subtotal_amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatCurrency(order.shipping_cost)}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatCurrency(order.payment.amount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {order.address && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Shipping Address</p>
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
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Shipment</p>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Carrier</span>
                  <span className="font-medium text-foreground">
                    {order.shipment.carrier}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tracking</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {order.shipment.tracking_number}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <OrderStatusBadge status={order.shipment.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipped at</span>
                  <span className="tabular-nums text-foreground">
                    {new Date(order.shipment.shipped_at).toLocaleString("en", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {order.shipment.delivered_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delivered at</span>
                    <span className="tabular-nums text-foreground">
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

          {/* Actions */}
          {(canShip || canDeliver) && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">
                  {canShip ? "Ship Order" : "Mark as Delivered"}
                </p>
              </div>
              {canShip && (
                <ShipForm
                  orderId={order.id}
                  carrier={order.carrier}
                  onSuccess={handleInvalidate}
                />
              )}
              {canDeliver && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Confirm that this order has been delivered to the customer.
                  </p>
                  <Button
                    onClick={() => setDeliverConfirmOpen(true)}
                    disabled={deliverMutation.isPending}
                    className="gap-2 rounded-lg border border-border bg-card text-foreground hover:bg-accent"
                  >
                    {deliverMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Mark as Delivered
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deliverConfirmOpen} onOpenChange={setDeliverConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm delivery</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this order as delivered? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deliverMutation.mutate()}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              {deliverMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
