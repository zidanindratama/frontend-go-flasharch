import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { UsersTable } from "@/components/dashboard/users/users-table"

export default function DashboardUsersPage() {
  return (
    <Suspense fallback={<UsersTableFallback />}>
      <UsersTable />
    </Suspense>
  )
}

function UsersTableFallback() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-36 rounded-2xl" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-[520px] rounded-2xl" />
    </div>
  )
}
