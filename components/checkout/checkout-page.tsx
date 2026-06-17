"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Lock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/lib/hooks/use-cart"
import { useCheckoutFlow } from "@/lib/hooks/use-checkout"
import { formatPrice } from "@/components/dashboard/products/product-utils"
import type { UserAddress } from "@/lib/api/account"
import type { ShippingOption } from "@/lib/hooks/use-shipping"
import { AddressSelector } from "./address-selector"
import { ShippingOptions } from "./shipping-options"

const ease = [0.16, 1, 0.3, 1] as const

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number
  label: string
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-500 ${
          completed
            ? "bg-[#FF6600] text-white"
            : active
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {completed ? (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>
      <span
        className={`text-xs font-medium tracking-wide transition-colors duration-300 ${
          active ? "text-foreground" : completed ? "text-foreground/70" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export function CheckoutPage() {
  const router = useRouter()
  const { cart, isLoading: cartLoading } = useCart()
  const { phase, startCheckout, isStarting } = useCheckoutFlow(cart?.id ?? null)

  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)

  const totalQuantity = useMemo(() => {
    if (!cart) return 0
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const totalWeight = useMemo(() => {
    if (!cart) return 0
    return cart.items.reduce(
      (sum, item) => sum + (item.product.weight || 0) * item.quantity,
      0,
    )
  }, [cart])

  const subtotal = useMemo(() => {
    if (!cart) return 0
    return cart.items.reduce(
      (sum, item) => sum + item.unit_price_amount * item.quantity,
      0,
    )
  }, [cart])

  const total = subtotal + (selectedShipping?.price ?? 0)

  const outOfStockItems = useMemo(() => {
    if (!cart) return []
    return cart.items.filter((item) => item.product.available_stock <= 0)
  }, [cart])

  const insufficientStockItems = useMemo(() => {
    if (!cart) return []
    return cart.items.filter(
      (item) => item.product.available_stock > 0 && item.product.available_stock < item.quantity,
    )
  }, [cart])

  const hasStockIssues = outOfStockItems.length > 0 || insufficientStockItems.length > 0

  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      router.push("/account/cart")
    }
  }, [cart, cartLoading, router])

  useEffect(() => {
    if (phase === "error") {
      router.push("/account/orders")
    }
  }, [phase, router])

  const handlePay = () => {
    startCheckout(selectedAddress?.id, selectedShipping?.price)
  }

  if (cartLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <Skeleton className="mb-8 h-6 w-32" />
        <div className="grid gap-8 md:gap-12 lg:grid-cols-[1fr_400px]">
          <div className="space-y-10">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) return null

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10 lg:py-12">
      <Link
        href="/account/cart"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:mb-8 lg:mb-10"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to cart
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <h1 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">Checkout</h1>
            <p className="mb-6 text-sm text-muted-foreground sm:mb-8 lg:mb-10">
              Complete your order in a few steps.
            </p>
          </motion.div>

          <div className="mb-8 flex items-center gap-4 sm:gap-6 lg:mb-10">
            <StepIndicator number={1} label="Address" active={!selectedAddress} completed={!!selectedAddress} />
            <div className="h-px flex-1 bg-border" />
            <StepIndicator number={2} label="Shipping" active={!!selectedAddress && !selectedShipping} completed={!!selectedShipping} />
          </div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
          >
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                01
              </span>
              <h2 className="text-sm font-semibold">Shipping address</h2>
            </div>
            <AddressSelector
              selectedAddressId={selectedAddress?.id ?? null}
              onSelect={(addr) => {
                setSelectedAddress(addr)
                setSelectedShipping(null)
              }}
            />
          </motion.section>

          <AnimatePresence>
            {selectedAddress && (
              <motion.section
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.5, ease }}
                className="mt-8 overflow-hidden sm:mt-10 lg:mt-10"
              >
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    02
                  </span>
                  <h2 className="text-sm font-semibold">Shipping method</h2>
                </div>
                <ShippingOptions
                  destinationVillageCode={selectedAddress.village_code}
                  totalWeight={totalWeight}
                  selectedOption={selectedShipping}
                  onSelect={setSelectedShipping}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="lg:sticky lg:top-8 lg:self-start"
        >
          <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border sm:p-5 md:p-6 lg:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Order summary</h3>
              <span className="inline-flex items-center rounded-full bg-[#FF6600]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF6600]">
                {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="mb-5 max-h-[360px] space-y-3 overflow-y-auto pr-1">
              {cart.items.map((item) => {
                const itemWeight = (item.product.weight || 0) * item.quantity
                const stock = item.product.available_stock
                const isOutOfStock = stock <= 0
                const isLowStock = stock > 0 && stock < item.quantity
                return (
                  <div
                    key={item.id}
                    className={`flex gap-3 rounded-xl p-3 transition-colors ${
                      isOutOfStock
                        ? "bg-destructive/5 opacity-60"
                        : isLowStock
                          ? "bg-yellow-500/5 dark:bg-yellow-500/10"
                          : "bg-muted/50"
                    }`}
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-background shadow-sm sm:h-16 sm:w-16">
                      {item.product.thumbnail_url ? (
                        <img
                          src={item.product.thumbnail_url}
                          alt={item.product.name}
                          className={`h-full w-full object-cover ${isOutOfStock ? " grayscale" : ""}`}
                        />
                      ) : (
                        <Package className="absolute inset-0 m-auto h-5 w-5 text-muted-foreground/30" />
                      )}
                      {item.quantity > 1 && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-[#FF6600] px-1 text-[9px] font-bold text-white shadow-sm">
                          {item.quantity}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`line-clamp-2 text-xs font-medium leading-tight sm:text-sm ${isOutOfStock ? "text-muted-foreground line-through" : ""}`}>
                        {item.product.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        {item.product.weight > 0 && (
                          <>
                            <span className="text-muted-foreground/30">·</span>
                            <span>{itemWeight} kg</span>
                          </>
                        )}
                      </div>
                      <div className="mt-1.5">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                            Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold text-yellow-600 dark:text-yellow-400">
                            Only {stock} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            In stock ({stock})
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-semibold tabular-nums">
                        {formatPrice(item.unit_price_amount * item.quantity)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Weight</span>
                <span className="tabular-nums">{totalWeight} kg</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Shipping</span>
                <span className="tabular-nums">
                  {selectedShipping?.price != null ? formatPrice(selectedShipping.price) : "—"}
                </span>
              </div>
              <div className="my-2 h-px bg-border" />
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Total
                </span>
                <span className="text-xl font-bold tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>

            {hasStockIssues && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-yellow-500/10 p-3 text-xs text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  {outOfStockItems.length > 0 && (
                    <>
                      {outOfStockItems.length} item{outOfStockItems.length > 1 ? "s" : ""} out of stock.
                    </>
                  )}
                  {insufficientStockItems.length > 0 && (
                    <>
                      {outOfStockItems.length > 0 && " "}
                      {insufficientStockItems.length} item{insufficientStockItems.length > 1 ? "s" : ""} have insufficient stock.
                    </>
                  )}{" "}
                  Please remove them from your cart first.
                </span>
              </div>
            )}

            <Button
              onClick={handlePay}
              disabled={isStarting || !selectedShipping || hasStockIssues}
              className="mt-5 h-12 w-full rounded-xl bg-[#FF6600] text-sm font-semibold text-white shadow-lg shadow-[#FF6600]/20 transition-all hover:bg-[#E55C00] hover:shadow-xl hover:shadow-[#FF6600]/25 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none sm:mt-6"
            >
              {isStarting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" />
                  Pay {formatPrice(total)}
                </span>
              )}
            </Button>

            <p className="mt-3 text-center text-[10px] text-muted-foreground/60">
              Secure payment powered by Stripe
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
