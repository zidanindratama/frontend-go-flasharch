"use client"

import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useQueries } from "@tanstack/react-query"
import {
  Loader2,
  Minus,
  Package,
  Plus,
  Save,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useSaveForLater,
} from "@/lib/hooks/use-cart"
import { getProduct } from "@/lib/api/catalog"
import { formatPrice } from "@/components/dashboard/products/product-utils"
import type { CartItem as CartItemType } from "@/lib/api/cart"
import { cn } from "@/lib/utils"
import { SavedCartItem } from "./saved-cart-item"
import { useSavedItems, useDeleteSavedItem, useMoveToCart } from "@/lib/hooks/use-cart"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

function CartItemRow({
  item,
  thumbnailUrl,
  onUpdate,
  onRemove,
  onSaveForLater,
  isUpdating,
  isRemoving,
}: {
  item: CartItemType
  thumbnailUrl?: string | null
  onUpdate: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  onSaveForLater: (itemId: string) => void
  isUpdating: boolean
  isRemoving: boolean
}) {
  const [confirmRemove, setConfirmRemove] = useState(false)

  const handleRemove = useCallback(() => {
    if (confirmRemove) {
      onRemove(item.id)
      setConfirmRemove(false)
    } else {
      setConfirmRemove(true)
      setTimeout(() => setConfirmRemove(false), 3000)
    }
  }, [confirmRemove, onRemove, item.id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, transition: { duration: 0.3, ease: smoothEase } }}
      transition={{ duration: 0.4, ease: smoothEase }}
      className="group"
    >
      <div className="flex gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow duration-300 hover:shadow-lg hover:shadow-foreground/5 hover:ring-foreground/15">
        <Link
          href={`/products/${item.product.slug}`}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-24 sm:w-24"
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={item.product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground/30" />
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="min-w-0">
            <Link
              href={`/products/${item.product.slug}`}
              className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-[#FF6600]"
            >
              {item.product.name}
            </Link>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {item.product.sku}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold tabular-nums text-foreground">
              {formatPrice(item.unit_price_amount)}
            </span>

            <div className="flex items-center gap-1">
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => onUpdate(item.id, Math.max(1, item.quantity - 1))}
                disabled={isUpdating || item.quantity <= 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
              >
                <Minus className="h-3 w-3" />
              </motion.button>

              <motion.span
                key={item.quantity}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: smoothEase }}
                className="w-8 text-center text-sm font-semibold tabular-nums"
              >
                {item.quantity}
              </motion.span>

              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => onUpdate(item.id, item.quantity + 1)}
                disabled={isUpdating}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
              >
                <Plus className="h-3 w-3" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-sm font-bold tabular-nums text-foreground">
            {formatPrice(item.unit_price_amount * item.quantity)}
          </span>

          <div className="flex items-center gap-0.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onSaveForLater(item.id)}
                    disabled={isUpdating}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[#FF6600]/10 hover:text-[#FF6600]"
                  >
                    <Save className="h-3.5 w-3.5" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>Save for later</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.85 }}
                    onClick={handleRemove}
                    disabled={isRemoving}
                    title={confirmRemove ? "Confirm remove" : "Remove from cart"}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                      confirmRemove
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                    )}
                  >
                    {isRemoving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : confirmRemove ? (
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2, ease: smoothEase }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </motion.div>
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>{confirmRemove ? "Click again to confirm" : "Remove from cart"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CartSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <Skeleton className="h-20 w-20 shrink-0 rounded-lg sm:h-24 sm:w-24" />
          <div className="flex flex-1 flex-col justify-between py-1">
            <div>
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="mt-1.5 h-3 w-1/3 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-7 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: smoothEase }}
      className="flex flex-col items-center justify-center rounded-xl bg-card px-4 py-20 text-center ring-1 ring-foreground/10"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: smoothEase }}
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6600]/8"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShoppingCart className="h-7 w-7 text-[#FF6600]/60" />
        </motion.div>
      </motion.div>
      <h2 className="text-base font-semibold tracking-tight">
        Your cart is empty
      </h2>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Start adding products to your cart and they will appear here.
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

export function CartPage() {
  const { cart, itemCount, subtotal, isLoading } = useCart()
  const { savedItems, isLoading: savedLoading } = useSavedItems()
  const updateMutation = useUpdateCartItem()
  const removeMutation = useRemoveCartItem()
  const clearMutation = useClearCart()
  const saveForLaterMutation = useSaveForLater()
  const deleteSavedMutation = useDeleteSavedItem()
  const moveToCartMutation = useMoveToCart()

  const productSlugs = useMemo(
    () => (cart?.items ?? []).map((item) => item.product.slug),
    [cart?.items],
  )

  const productQueries = useQueries({
    queries: productSlugs.map((slug) => ({
      queryKey: ["product-thumb", slug],
      queryFn: async () => {
        const res = await getProduct(slug)
        return res.data.data
      },
      staleTime: 5 * 60_000,
    })),
  })

  const thumbnailMap = useMemo(() => {
    const map: Record<string, string | null> = {}
    productQueries.forEach((q, i) => {
      if (q.data) {
        map[productSlugs[i]] = q.data.thumbnail_url ?? null
      }
    })
    return map
  }, [productQueries, productSlugs])

  const [confirmClear, setConfirmClear] = useState(false)

  const handleUpdate = useCallback(
    (itemId: string, quantity: number) => {
      updateMutation.mutate({ itemId, quantity })
    },
    [updateMutation],
  )

  const handleRemove = useCallback(
    (itemId: string) => {
      removeMutation.mutate(itemId)
    },
    [removeMutation],
  )

  const handleSaveForLater = useCallback(
    (itemId: string) => {
      saveForLaterMutation.mutate(itemId)
    },
    [saveForLaterMutation],
  )

  const handleClearCart = useCallback(() => {
    if (confirmClear) {
      clearMutation.mutate()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }, [confirmClear, clearMutation])

  const handleDeleteSaved = useCallback(
    (savedItemId: string) => {
      deleteSavedMutation.mutate(savedItemId)
    },
    [deleteSavedMutation],
  )

  const handleMoveToCart = useCallback(
    (savedItemId: string) => {
      moveToCartMutation.mutate(savedItemId)
    },
    [moveToCartMutation],
  )

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: smoothEase }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight lg:text-xl">
            My Cart
          </h1>
          {!isLoading && itemCount > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3, ease: smoothEase }}
              className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[#FF6600]/10 px-2 text-xs font-semibold tabular-nums text-[#FF6600]"
            >
              {itemCount}
            </motion.span>
          )}
        </div>

        {!isLoading && cart && cart.items.length > 0 && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={handleClearCart}
            disabled={clearMutation.isPending}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              confirmClear
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {confirmClear ? "Confirm clear" : "Clear cart"}
          </motion.button>
        )}
      </motion.div>

      {isLoading ? (
        <CartSkeleton />
      ) : cart && cart.items.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                thumbnailUrl={thumbnailMap[item.product.slug]}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
                onSaveForLater={handleSaveForLater}
                isUpdating={
                  updateMutation.isPending && updateMutation.variables?.itemId === item.id
                }
                isRemoving={removeMutation.isPending && removeMutation.variables === item.id}
              />
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: smoothEase }}
            className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold tabular-nums text-foreground">
                {formatPrice(subtotal)}
              </span>
            </div>
          </motion.div>
        </div>
      ) : (
        <EmptyCart />
      )}

      {!savedLoading && savedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: smoothEase }}
        >
          <Separator className="my-6" />
          <div className="flex items-center gap-2 mb-4">
            <Save className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-tight">
              Saved for Later
            </h2>
            <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
              {savedItems.length}
            </span>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {savedItems.map((item) => (
                <SavedCartItem
                  key={item.id}
                  item={item}
                  onMoveToCart={handleMoveToCart}
                  onDelete={handleDeleteSaved}
                  isMoving={moveToCartMutation.isPending && moveToCartMutation.variables === item.id}
                  isDeleting={deleteSavedMutation.isPending && deleteSavedMutation.variables === item.id}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
}
