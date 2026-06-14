import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { BlogCategoryTable } from "@/components/dashboard/blogs/blog-category-table"

export default function DashboardBlogCategoriesPage() {
  return (
    <Suspense fallback={<BlogCategoryTableFallback />}>
      <BlogCategoryTable />
    </Suspense>
  )
}

function BlogCategoryTableFallback() {
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
