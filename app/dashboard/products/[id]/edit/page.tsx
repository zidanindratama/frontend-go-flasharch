"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductForm } from "@/components/dashboard/products/product-form"
import { getAdminProduct } from "@/lib/api/catalog"

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const productId = params.id

  const productQuery = useQuery({
    queryKey: ["admin-product", productId],
    queryFn: async () => {
      const response = await getAdminProduct(productId)
      return response.data.data
    },
    enabled: !!productId,
  })

  if (productQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
          <p className="font-semibold text-foreground">Product unavailable</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Check admin session and selected product ID.
          </p>
        </div>
      </div>
    )
  }

  return <ProductForm mode="edit" product={productQuery.data} />
}
