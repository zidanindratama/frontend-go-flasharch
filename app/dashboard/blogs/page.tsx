import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { BlogCards } from "@/components/dashboard/blogs/blog-cards"

export default function DashboardBlogsPage() {
  return (
    <Suspense fallback={<BlogCardsFallback />}>
      <BlogCards />
    </Suspense>
  )
}

function BlogCardsFallback() {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <Skeleton className="h-40 rounded-2xl" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  )
}
