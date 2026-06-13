import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { InventoryTabs } from "@/components/dashboard/products/inventory-tabs"

export default function DashboardInventoryPage() {
  return (
    <Suspense fallback={<InventoryFallback />}>
      <InventoryTabs />
    </Suspense>
  )
}

function InventoryFallback() {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-10 w-48 rounded-lg" />
      <div className="grid gap-3 sm:grid-cols-4">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  )
}
