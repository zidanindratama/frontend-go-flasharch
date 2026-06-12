"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Heart, PackageOpen } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getBuyerWishlist,
  type WishlistItem,
} from "@/lib/api/account"
import { useAuthStore } from "@/stores/auth"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount / 100)
}

function WishlistCard({ item }: { item: WishlistItem }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease }}
      className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
    >
      <div className="flex gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted/60">
          <PackageOpen className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="line-clamp-2 text-sm font-semibold text-foreground">
                {item.product.name}
              </h2>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                {item.product.sku}
              </p>
            </div>
            <Heart className="h-4 w-4 shrink-0 fill-[#FF6600] text-[#FF6600]" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-bold tabular-nums text-foreground">
              {formatCurrency(item.product.base_price_amount)}
            </span>
            <Link
              href={`/products/${item.product.slug}`}
              className="text-xs font-medium text-[#FF6600] hover:underline"
            >
              View product
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function AccountWishlist() {
  const token = useAuthStore((s) => s.access_token)
  const { data, isLoading } = useQuery({
    queryKey: ["buyer-wishlist"],
    queryFn: async () => {
      const response = await getBuyerWishlist()
      return response.data
    },
    enabled: !!token,
  })

  const items = data?.data.items ?? []

  return (
    <div className="space-y-4">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.45, ease }}
        className="text-lg font-bold tracking-tight lg:text-xl"
      >
        My Wishlist
      </motion.h1>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : items.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <WishlistCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl bg-card px-4 py-20 text-center ring-1 ring-foreground/10">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
            <Heart className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <h2 className="text-base font-semibold tracking-tight">
            No wishlist items
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Products saved through the buyer wishlist API will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
