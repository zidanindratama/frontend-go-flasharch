"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Package, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/components/dashboard/products/product-utils"
import type { Product } from "@/lib/api/catalog"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface ProductCardProps {
  product: Product
  index?: number
  className?: string
}

export function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const primaryImage = product.thumbnail_url
  const categoryNames = product.categories.map((c) => c.name).join(", ")

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.65, ease: smoothEase, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className={cn("group", className)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-500 group-hover:shadow-xl group-hover:shadow-foreground/5">
          {/* Image area */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {primaryImage ? (
              <motion.img
                src={primaryImage}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Package className="h-12 w-12 text-muted-foreground/30 transition-colors duration-500 group-hover:text-[#FF6600]/30" />
              </div>
            )}

            {/* Hover overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Top-right category badge */}
            <div className="absolute top-3 right-3 z-10">
              <Badge
                variant="secondary"
                className="rounded-full border border-border/50 bg-background/90 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm"
              >
                {categoryNames || "Uncategorized"}
              </Badge>
            </div>

            {/* Top-left arrow */}
            <div className="absolute top-3 left-3 z-10 opacity-0 transition-all duration-500 group-hover:opacity-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6600] text-white shadow-lg">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>

            {/* Quick-add button */}
            <div className="absolute bottom-3 left-3 right-3 z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <Button
                type="button"
                size="sm"
                className="w-full gap-2 rounded-xl bg-[#FF6600] text-xs font-semibold text-white hover:bg-[#e65c00]"
              >
                <Plus className="h-3.5 w-3.5" />
                Open details
              </Button>
            </div>
          </div>

          {/* Info area */}
          <div className="p-5">
            <h3 className="line-clamp-2 min-h-[3rem] text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-[#FF6600]">
              {product.name}
            </h3>

            <div className="mt-3 flex items-center gap-1.5">
              {product.rating_count > 0 ? (
                <>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium tabular-nums text-foreground">
                      {product.rating_average.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.rating_count})
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">No ratings yet</span>
              )}
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-xl font-bold tabular-nums text-foreground">
                {formatPrice(product.base_price_amount)}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.currency}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
