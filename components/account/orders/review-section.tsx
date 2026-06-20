"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { MessageSquare, Package } from "lucide-react"
import { listProducts, listProductReviews, type Product } from "@/lib/api/catalog"
import { useAuthStore } from "@/stores/auth"
import { ReviewForm } from "./review-form"
import type { OrderItem } from "@/lib/api/account"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

function useProductSlug(productId: string | null, productName: string) {
  return useQuery({
    queryKey: ["order.product-slug", productId, productName],
    queryFn: async () => {
      if (!productId) return null
      const response = await listProducts({ search: productName, per_page: 5 })
      const product = response.data.data.items.find((p) => p.id === productId)
      return product?.slug ?? null
    },
    enabled: !!productId,
    staleTime: Infinity,
  })
}

function useMyReviewForProduct(
  productSlug: string | null,
  userId: string | undefined,
) {
  return useQuery({
    queryKey: ["account.order.review", productSlug, userId],
    queryFn: async () => {
      if (!productSlug) return null
      const response = await listProductReviews(productSlug, { per_page: 100 })
      const reviews = response.data.data.items
      return reviews.find((r) => r.user_id === userId) ?? null
    },
    enabled: !!userId && !!productSlug,
  })
}

function ReviewItem({
  item,
  userId,
}: {
  item: OrderItem
  userId: string | undefined
}) {
  const slugQuery = useProductSlug(item.product_id, item.product_name)
  const productSlug = slugQuery.data
  const myReview = useMyReviewForProduct(productSlug, userId)

  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
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
          {item.sku}
        </p>
        {slugQuery.isLoading || myReview.isLoading ? (
          <div className="mt-2 h-16 animate-pulse rounded-lg bg-muted" />
        ) : productSlug ? (
          <div className="mt-2">
            <ReviewForm
              productSlug={productSlug}
              productName={item.product_name}
              thumbnailUrl={item.thumbnail_url}
              existingReview={myReview.data ?? undefined}
            />
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Review unavailable for this item.
          </p>
        )}
      </div>
    </div>
  )
}

export function ReviewSection({ items }: { items: OrderItem[] }) {
  const userId = useAuthStore((s) => s.user?.id)

  if (!userId) return null

  const itemsWithProduct = items.filter((item) => item.product_id)

  if (itemsWithProduct.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.5, ease: smoothEase }}
      className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
    >
      <div className="mb-3 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-semibold">Write a Review</p>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Share your experience with each product in this order.
      </p>
      <div className="divide-y divide-border">
        {itemsWithProduct.map((item) => (
          <ReviewItem key={item.id} item={item} userId={userId} />
        ))}
      </div>
    </motion.div>
  )
}
