"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import DOMPurify from "dompurify"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Pencil,
  Star,
  User,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BlogPostStatusBadge } from "@/components/dashboard/blogs/blog-badges"
import { formatDateTime } from "@/components/dashboard/products/product-utils"
import { getAdminBlog, type BlogPost } from "@/lib/api/blogs"

export function BlogDetail() {
  const params = useParams<{ id: string }>()
  const blogId = params.id

  const blogQuery = useQuery({
    queryKey: ["admin.blogs", blogId],
    queryFn: async () => {
      const response = await getAdminBlog(blogId)
      return response.data.data
    },
    enabled: !!blogId,
  })

  if (blogQuery.isLoading) return <BlogDetailSkeleton />

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

  return <BlogDetailView blog={blogQuery.data} />
}

function BlogDetailView({ blog }: { blog: BlogPost }) {
  async function copyId() {
    await navigator.clipboard.writeText(blog.id)
    toast.success("Blog post ID copied")
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-fit gap-2 text-muted-foreground"
        >
          <Link href="/dashboard/blogs">
            <ArrowLeft className="size-4" />
            All blogs
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-xl"
            onClick={copyId}
          >
            <Copy className="size-3.5" />
            Copy ID
          </Button>
          <Button asChild size="sm" className="h-9 rounded-xl">
            <Link href={`/dashboard/blogs/${blog.id}/edit`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <BlogPostStatusBadge status={blog.status} />
            {blog.featured && (
              <Badge
                variant="outline"
                className="rounded-full border-[#FF6600]/25 bg-[#FF6600]/10 text-[#FF6600]"
              >
                <Star className="size-3" />
                Featured
              </Badge>
            )}
            <Badge variant="secondary" className="font-mono">
              {blog.slug}
            </Badge>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
            {blog.title}
          </h1>

          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {blog.excerpt}
          </p>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Blog content
            </p>
            {blog.html ? (
              <div
                className="mt-4 rounded-xl bg-background/60 p-4 ring-1 ring-border text-base leading-8 text-foreground/88 sm:p-5 [&_blockquote]:my-8 [&_blockquote]:rounded-lg [&_blockquote]:border [&_blockquote]:border-[#FF6600]/25 [&_blockquote]:bg-[#FF6600]/8 [&_blockquote]:p-5 [&_blockquote]:font-medium [&_h1]:mb-3 [&_h1]:mt-12 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:text-lg [&_h4]:font-bold [&_h5]:mb-2 [&_h5]:mt-6 [&_h5]:text-base [&_h5]:font-bold [&_h6]:mb-2 [&_h6]:mt-6 [&_h6]:text-sm [&_h6]:font-bold [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_table]:my-8 [&_table]:block [&_table]:w-full [&_table]:min-w-full [&_table]:overflow-x-auto [&_table]:rounded-lg [&_table]:border [&_table]:border-border [&_td]:border-t [&_td]:border-border [&_td]:p-3 [&_th]:bg-muted [&_th]:p-3 [&_th]:text-left [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.html),
                }}
              />
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No content has been written yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-foreground">
              Post details
            </h2>
            <div className="mt-4 divide-y divide-border rounded-xl border border-border">
              <MetaRow
                icon={<User className="size-3.5" />}
                label="Author"
                value={blog.author}
              />
              <MetaRow
                icon={<Clock className="size-3.5" />}
                label="Read time"
                value={`${blog.read_minutes} minutes`}
              />
              <MetaRow
                icon={<Calendar className="size-3.5" />}
                label="Published"
                value={
                  blog.published_at
                    ? formatDateTime(blog.published_at)
                    : "Not published"
                }
              />
              <MetaRow
                icon={<Star className="size-3.5" />}
                label="Category"
                value={blog.category?.name ?? "Uncategorized"}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-foreground">
              Post timeline
            </h2>
            <div className="mt-4 divide-y divide-border rounded-xl border border-border">
              <TimelineRow
                label="Created"
                value={formatDateTime(blog.created_at)}
              />
              <TimelineRow
                label="Updated"
                value={formatDateTime(blog.updated_at)}
              />
              <TimelineRow label="Post ID" value={shortId(blog.id)} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 px-3 py-3">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span className="[&_svg]:size-3.5">{icon}</span>
        {label}
      </span>
      <span className="min-w-0 truncate text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

function TimelineRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 px-3 py-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

function shortId(value: string) {
  return `${value.slice(0, 8)}...${value.slice(-6)}`
}

function BlogDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-40 rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-[540px] rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
