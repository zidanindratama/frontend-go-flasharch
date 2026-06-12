"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { UserForm } from "@/components/dashboard/users/user-form"
import { getAdminUser } from "@/lib/api/admin-users"

export function EditUserLoader() {
  const params = useParams<{ id: string }>()
  const userId = params.id
  const userQuery = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: async () => {
      const response = await getAdminUser(userId)
      return response.data.data
    },
    enabled: !!userId,
  })

  if (userQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[240px] rounded-2xl" />
        <Skeleton className="h-[320px] rounded-2xl" />
      </div>
    )
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
          <p className="font-semibold text-foreground">User unavailable</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Check admin session and selected user ID.
          </p>
        </div>
      </div>
    )
  }

  return <UserForm mode="edit" user={userQuery.data} />
}
