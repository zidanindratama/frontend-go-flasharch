"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Warehouse } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { StockAdjustForm } from "@/components/dashboard/products/stock-adjust-form"
import { getInventoryProductStock } from "@/lib/api/inventory"

export default function StockAdjustPage() {
  const params = useParams<{ product_id: string }>()
  const productId = params.product_id

  const stockQuery = useQuery({
    queryKey: ["admin-product-stock", productId],
    queryFn: async () => {
      const response = await getInventoryProductStock(productId)
      return response.data.data
    },
  })

  if (stockQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (!stockQuery.data) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <Warehouse className="size-6" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Stock data not found
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          The stock information for this product could not be loaded. The product
          may not have an inventory record yet.
        </p>
      </div>
    )
  }

  return <StockAdjustForm stock={stockQuery.data} />
}
