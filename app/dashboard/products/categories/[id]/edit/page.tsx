"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryForm } from "@/components/dashboard/products/category-form"
import { getAdminCategory } from "@/lib/api/catalog"

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>()
  const categoryId = params.id

  const categoryQuery = useQuery({
    queryKey: ["admin-category", categoryId],
    queryFn: async () => {
      const response = await getAdminCategory(categoryId)
      return response.data.data
    },
    enabled: !!categoryId,
  })

  if (categoryQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (categoryQuery.isError || !categoryQuery.data) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
          <p className="font-semibold text-foreground">Category unavailable</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Check admin session and selected category ID.
          </p>
        </div>
      </div>
    )
  }

  return <CategoryForm mode="edit" category={categoryQuery.data} />
}
