"use client"

import { Package, Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/components/dashboard/products/product-utils"
import type { Cart } from "@/lib/api/cart"

interface OrderSummaryProps {
  cart: Cart | undefined
  selectedShippingCost: number | null
  isStarting: boolean
  onPay: () => void
}

export function OrderSummary({
  cart,
  selectedShippingCost,
  isStarting,
  onPay,
}: OrderSummaryProps) {
  if (!cart || cart.items.length === 0) {
    return null
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.unit_price_amount * item.quantity,
    0,
  )

  const totalWeight = cart.items.reduce(
    (sum, item) => sum + (item.product.weight || 0) * item.quantity,
    0,
  )

  const total = subtotal + (selectedShippingCost ?? 0)

  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <h3 className="mb-3 text-sm font-semibold">Order Summary</h3>

      <div className="max-h-48 space-y-2 overflow-y-auto">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.product.thumbnail_url ? (
                <img
                  src={item.product.thumbnail_url}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="absolute inset-0 m-auto h-5 w-5 text-muted-foreground/30" />
              )}
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#FF6600] px-1 text-[9px] font-bold text-white">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-medium">{item.product.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {item.product.weight * item.quantity} kg
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold tabular-nums">
              {formatPrice(item.unit_price_amount * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-3" />

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Weight</span>
          <span className="font-medium tabular-nums">{totalWeight} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping Cost</span>
          <span className="font-medium tabular-nums">
            {selectedShippingCost !== null ? formatPrice(selectedShippingCost) : "--"}
          </span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Total</span>
          <span className="font-bold tabular-nums text-[#FF6600]">{formatPrice(total)}</span>
        </div>
      </div>

      <Button
        onClick={onPay}
        disabled={isStarting || selectedShippingCost === null}
        className="mt-4 h-11 w-full rounded-full text-sm font-semibold"
      >
        {isStarting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Pay Now
          </>
        )}
      </Button>
    </div>
  )
}
