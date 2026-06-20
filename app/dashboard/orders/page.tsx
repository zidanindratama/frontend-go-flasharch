import { Suspense } from "react"
import { OrdersTable } from "@/components/dashboard/orders/orders-table"

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        </div>
      }
    >
      <OrdersTable />
    </Suspense>
  )
}
