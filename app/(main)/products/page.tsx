import { Suspense } from "react"
import type { Metadata } from "next"
import { ProductsHero } from "@/components/main/products/products-hero"
import { ProductsCatalog } from "@/components/main/products/products-catalog"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Products",
  description:
    "Browse the Go FlashArch product catalog. Filter by category, price range, search by name or SKU, and sort to find what you need.",
  path: "/products",
  keywords: ["products", "catalog", "flash sale", "e-commerce"],
})

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <Suspense fallback={null}>
        <ProductsCatalog />
      </Suspense>
    </>
  )
}
