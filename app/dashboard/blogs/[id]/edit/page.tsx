"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { BlogPostForm } from "@/components/dashboard/blogs/blog-form"
import { getAdminBlog } from "@/lib/api/blogs"

export default function EditBlogPage() {
  const params = useParams<{ id: string }>()
  const blogId = params.id

  const blogQuery = useQuery({
    queryKey: ["admin-blog", blogId],
    queryFn: async () => {
      const response = await getAdminBlog(blogId)
      return response.data.data
    },
    enabled: !!blogId,
  })

  if (blogQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (blogQuery.isError || !blogQuery.data) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
          <p className="font-semibold text-foreground">Blog post unavailable</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Check admin session and selected blog ID.
          </p>
        </div>
      </div>
    )
  }

  return <BlogPostForm mode="edit" blog={blogQuery.data} />
}
