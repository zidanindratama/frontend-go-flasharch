"use client"

import { motion } from "framer-motion"
import { PackageOpen, SearchX } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/main/products/product-card"
import type { Product } from "@/lib/api/catalog"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface ProductGridProps {
  products: Product[]
  isLoading: boolean
  hasFilters: boolean
  perPage: number
}

export function ProductGrid({ products, isLoading, hasFilters, perPage }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: perPage }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
          {hasFilters ? (
            <SearchX className="h-7 w-7 text-muted-foreground/50" />
          ) : (
            <PackageOpen className="h-7 w-7 text-muted-foreground/50" />
          )}
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          {hasFilters ? "No products match your filters" : "No products yet"}
        </h3>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          {hasFilters
            ? "Try a different keyword, category, or price range."
            : "New products will appear here when they are ready to sell."}
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
