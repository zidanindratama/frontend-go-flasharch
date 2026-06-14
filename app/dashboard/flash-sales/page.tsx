import { Suspense } from "react"
import { FlashSalesTable } from "@/components/dashboard/flash-sales/flash-sales-table"

export default function FlashSalesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        </div>
      }
    >
      <FlashSalesTable />
    </Suspense>
  )
}
