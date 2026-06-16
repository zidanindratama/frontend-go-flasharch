"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Heart,
  Loader2,
  Package,
  ShoppingBag,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getBuyerWishlist,
  removeFromWishlist,
  type WishlistItem,
} from "@/lib/api/account"
import { useAuthStore } from "@/stores/auth"
import { cn } from "@/lib/utils"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function WishlistCard({
  item,
  onRemove,
  isRemoving,
}: {
  item: WishlistItem
  onRemove: (productId: string) => void
  isRemoving: boolean
}) {
  const [confirmRemove, setConfirmRemove] = useState(false)

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (confirmRemove) {
        onRemove(item.product.id)
        setConfirmRemove(false)
      } else {
        setConfirmRemove(true)
        setTimeout(() => setConfirmRemove(false), 3000)
      }
    },
    [confirmRemove, onRemove, item.product.id],
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, scale: 0.96, transition: { duration: 0.25, ease: smoothEase } }}
      transition={{ duration: 0.4, ease: smoothEase }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Link
        href={`/products/${item.product.slug}`}
        className="flex gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow duration-300 hover:shadow-lg hover:shadow-foreground/5 hover:ring-foreground/15"
      >
        {/* Product image */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-24 sm:w-24">
          {item.product.thumbnail_url ? (
            <img
              src={item.product.thumbnail_url}
              alt={item.product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-[#FF6600]">
              {item.product.name}
            </h3>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {item.product.sku}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-sm font-bold tabular-nums text-foreground">
              {formatCurrency(item.product.base_price_amount)}
            </span>
            <span className="text-xs font-medium text-[#FF6600] transition-opacity group-hover:underline">
              View product
            </span>
          </div>
        </div>

        {/* Heart remove button */}
        <div className="flex shrink-0 items-start">
          <motion.button
            type="button"
            whileTap={{ scale: 0.7 }}
            onClick={handleRemove}
            disabled={isRemoving}
            aria-label={confirmRemove ? "Confirm remove" : "Remove from wishlist"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              confirmRemove
                ? "bg-destructive/10 hover:bg-destructive/20"
                : "hover:bg-[#FF6600]/10",
            )}
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : confirmRemove ? (
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.2, ease: smoothEase }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </motion.div>
            ) : (
              <Heart className="h-4 w-4 fill-[#FF6600] text-[#FF6600] transition-transform" />
            )}
          </motion.button>
        </div>
      </Link>
    </motion.div>
  )
}

function WishlistSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <Skeleton className="h-20 w-20 shrink-0 rounded-lg sm:h-24 sm:w-24" />
          <div className="flex flex-1 flex-col justify-between py-1">
            <div>
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="mt-1.5 h-3 w-1/3 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
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
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="h-7 w-7 text-[#FF6600]/60" />
        </motion.div>
      </motion.div>
      <h2 className="text-base font-semibold tracking-tight">
        No wishlist items yet
      </h2>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Browse products and tap the heart icon to save items you love.
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

export function AccountWishlist() {
  const token = useAuthStore((s) => s.access_token)
  const queryClient = useQueryClient()

  const { data: items = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["buyer-wishlist"],
    queryFn: async () => {
      const response = await getBuyerWishlist()
      return response.data.data.items
    },
    enabled: !!token,
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["buyer-wishlist"] })
      const previous = queryClient.getQueryData<WishlistItem[]>(["buyer-wishlist"])
      queryClient.setQueryData<WishlistItem[]>(["buyer-wishlist"], (old) => {
        if (!old) return old
        return old.filter((item) => item.product.id !== productId)
      })
      const { toast } = await import("sonner")
      toast.success("Removed from wishlist")
      return { previous }
    },
    onError: async (_err, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["buyer-wishlist"], context.previous)
      }
      const { toast } = await import("sonner")
      toast.error("Failed to remove item")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["buyer-wishlist"] })
    },
  })

  const itemCount = items.length

  const handleRemove = useCallback(
    (productId: string) => {
      removeMutation.mutate(productId)
    },
    [removeMutation],
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: smoothEase }}
        className="flex items-center gap-3"
      >
        <h1 className="text-lg font-bold tracking-tight lg:text-xl">
          My Wishlist
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
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <WishlistSkeleton />
      ) : itemCount > 0 ? (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  layout: { duration: 0.3, ease: smoothEase },
                  opacity: { duration: 0.3 },
                  y: { duration: 0.35, delay: index * 0.04, ease: smoothEase },
                }}
              >
                <WishlistCard
                  item={item}
                  onRemove={handleRemove}
                  isRemoving={removeMutation.isPending && removeMutation.variables === item.product.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
