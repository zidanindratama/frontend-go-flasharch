"use client"

import { motion } from "framer-motion"
import { Star, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductReview } from "@/lib/api/catalog"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < Math.round(rating)
              ? "fill-[#FF6600] text-[#FF6600]"
              : "text-muted-foreground",
          )}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review, index }: { review: ProductReview; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.5, ease: smoothEase, delay: index * 0.08 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Buyer</p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.title && (
        <h4 className="mb-1 text-sm font-semibold text-foreground">
          {review.title}
        </h4>
      )}
      {review.body && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {review.body}
        </p>
      )}
    </motion.div>
  )
}

export function ProductReviews({
  reviews,
  total,
  ratingAverage,
  ratingCount,
}: {
  reviews: ProductReview[]
  total: number
  ratingAverage: number
  ratingCount: number
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Reviews
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground">
              {ratingAverage.toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(ratingAverage)
                      ? "fill-[#FF6600] text-[#FF6600]"
                      : "text-muted-foreground",
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No reviews yet. Be the first to review this product.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      )}

      {total > reviews.length && (
        <p className="text-center text-sm text-muted-foreground">
          +{total - reviews.length} more reviews
        </p>
      )}
    </div>
  )
}
