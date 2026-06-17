"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Search, SlidersHorizontal, ArrowUpDown, Newspaper, Plus, Star, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { BlogPostStatusBadge } from "@/components/dashboard/blogs/blog-badges"
import { BlogActions } from "@/components/dashboard/blogs/blog-actions"
import { formatDateTime } from "@/components/dashboard/products/product-utils"
import { listAdminBlogs, type BlogPost, type BlogPostStatus } from "@/lib/api/blogs"
import { cn } from "@/lib/utils"

export function BlogCards() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "")

  const page = positiveInt(searchParams.get("page"), 1)
  const perPage = positiveInt(searchParams.get("per_page"), 12)
  const sort = searchParams.get("sort") ?? "created_at"
  const order: "asc" | "desc" =
    searchParams.get("order") === "asc" ? "asc" : "desc"
  const status = parseStatus(searchParams.get("status"))

  const setQuery = useCallback(
    (next: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(next).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams],
  )

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if ((searchParams.get("search") ?? "") !== searchValue) {
        setQuery({ search: searchValue, page: "1" })
      }
    }, 320)
    return () => window.clearTimeout(handle)
  }, [searchParams, searchValue, setQuery])

  const params = useMemo(
    () => ({
      page,
      per_page: perPage,
      search: searchParams.get("search") ?? undefined,
      sort,
      order,
      status,
    }),
    [page, perPage, searchParams, sort, order, status],
  )

  const blogsQuery = useQuery({
    queryKey: ["admin.blogs", params],
    queryFn: async () => {
      const response = await listAdminBlogs(params)
      return response.data
    },
  })

  const payload = blogsQuery.data?.data
  const blogs = payload?.items ?? []
  const total = payload?.total ?? 0
  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <section className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/10 px-3 py-1 text-xs font-semibold text-[#FF6600]">
            <Newspaper className="size-3.5" />
            Content management
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Blogs
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage blog posts, articles, and content for the storefront.
          </p>
        </div>
        <Button asChild size="lg" className="h-10 rounded-xl">
          <Link href="/dashboard/blogs/new">
            <Plus className="size-4" />
            Add blog post
          </Link>
        </Button>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <SignalTile label="Total posts" value={total.toLocaleString("id-ID")} />
        <SignalTile
          label="Visible page"
          value={blogs.length.toLocaleString("id-ID")}
        />
        <SignalTile
          label="Filtered status"
          value={status ? status : "all"}
          className="capitalize"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="size-4 text-[#FF6600]" />
            Filters
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {total > 0 && (
              <span>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {((page - 1) * perPage) + 1}-{Math.min(page * perPage, total)}
                </span>{" "}
                of <span className="font-medium text-foreground">{total.toLocaleString("id-ID")}</span> posts
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by title or author..."
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Select
            value={status ?? "all"}
            onValueChange={(v) =>
              setQuery({ status: v === "all" ? "" : v, page: "1" })
            }
          >
            <SelectTrigger className="h-10 w-full rounded-xl">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={`${sort}:${order}`}
            onValueChange={(v) => {
              const [nextSort, nextOrder] = v.split(":")
              setQuery({ sort: nextSort, order: nextOrder, page: "1" })
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-xl">
              <ArrowUpDown className="mr-2 size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at:desc">Newest first</SelectItem>
              <SelectItem value="created_at:asc">Oldest first</SelectItem>
              <SelectItem value="title:asc">Title A-Z</SelectItem>
              <SelectItem value="title:desc">Title Z-A</SelectItem>
              <SelectItem value="status:asc">Status</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={String(perPage)}
            onValueChange={(v) =>
              setQuery({ per_page: v, page: "1" })
            }
          >
            <SelectTrigger className="h-10 w-full rounded-xl">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9">9 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
              <SelectItem value="48">48 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {blogsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : blogsQuery.isError ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="max-w-sm rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
            <p className="font-semibold text-foreground">Blogs unavailable</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Check admin session and backend health.
            </p>
          </div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="max-w-sm rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
            <p className="font-semibold text-foreground">No blogs found</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create your first blog post or adjust filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-xl"
            disabled={page <= 1}
            onClick={() => setQuery({ page: String(page - 1) })}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-xl"
            disabled={page >= totalPages}
            onClick={() => setQuery({ page: String(page + 1) })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <BlogPostStatusBadge status={blog.status} />
          {blog.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6600]/10 px-2 py-0.5 text-[11px] font-semibold text-[#FF6600]">
              <Star className="size-3" />
              Featured
            </span>
          )}
        </div>

        <Link
          href={`/dashboard/blogs/${blog.id}`}
          className="mt-4 min-w-0"
        >
          <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-[#FF6600] transition-colors">
            {blog.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
          {blog.excerpt}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="truncate font-medium">{blog.author}</span>
            <span className="shrink-0">·</span>
            <span className="shrink-0">{blog.read_minutes} min read</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3 shrink-0" />
            <span>{formatDateTime(blog.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <span className="truncate text-xs text-muted-foreground">
          {blog.category?.name ?? "Uncategorized"}
        </span>
        <BlogActions blog={blog} />
      </div>
    </div>
  )
}

function SignalTile({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 truncate text-2xl font-semibold tracking-tight text-foreground",
          className,
        )}
      >
        {value}
      </p>
    </div>
  )
}

function positiveInt(value: string | null, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseStatus(value: string | null): BlogPostStatus | undefined {
  return value === "draft" || value === "published" || value === "archived"
    ? value
    : undefined
}
