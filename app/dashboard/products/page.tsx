import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductsTable } from "@/components/dashboard/products/products-table"

export default function DashboardProductsPage() {
  return (
    <Suspense fallback={<ProductsTableFallback />}>
      <ProductsTable />
    </Suspense>
  )
}

function ProductsTableFallback() {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <Skeleton className="h-40 rounded-2xl" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  )
}
