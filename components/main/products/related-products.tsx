"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Package, ArrowRight } from "lucide-react"
import { formatPrice } from "@/components/dashboard/products/product-utils"
import type { Product } from "@/lib/api/catalog"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

function RelatedCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.5, ease: smoothEase, delay: index * 0.08 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="mt-3">
          <h4 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-[#FF6600]">
            {product.name}
          </h4>
          <p className="mt-0.5 text-sm font-semibold text-[#FF6600]">
            {formatPrice(product.base_price_amount)}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Related products
        </h3>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#FF6600] transition-colors hover:text-[#e65c00]"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {products.map((product, i) => (
          <RelatedCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  )
}
