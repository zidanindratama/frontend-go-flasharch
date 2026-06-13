"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table"
import { Tag, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, SortHeader, type DataTableFilter } from "@/components/common/data-table"
import { CategoryStatusBadge } from "@/components/dashboard/products/product-badges"
import { CategoryActions } from "@/components/dashboard/products/category-actions"
import { formatDateTime } from "@/components/dashboard/products/product-utils"
import { listAdminCategories, type Category, type CategoryStatus } from "@/lib/api/catalog"
import { cn } from "@/lib/utils"

const sortableColumns = new Set(["created_at", "updated_at", "name", "slug", "status"])

export function CategoriesTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "")

  const page = positiveInt(searchParams.get("page"), 1)
  const perPage = positiveInt(searchParams.get("per_page"), 10)
  const sort = searchParams.get("sort") ?? "created_at"
  const order: "asc" | "desc" =
    searchParams.get("order") === "asc" ? "asc" : "desc"
  const status = parseStatus(searchParams.get("status"))

  const sorting: SortingState = sortableColumns.has(sort)
    ? [{ id: sort, desc: order !== "asc" }]
    : []

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

  const toggleSort = useCallback(
    (column: string) => {
      const nextOrder = sort === column && order === "desc" ? "asc" : "desc"
      setQuery({ sort: column, order: nextOrder, page: "1" })
    },
    [order, setQuery, sort],
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

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories", params],
    queryFn: async () => {
      const response = await listAdminCategories(params)
      return response.data
    },
  })

  const payload = categoriesQuery.data?.data
  const categories = payload?.items ?? []
  const total = payload?.total ?? 0

  const filters: DataTableFilter[] = [
    {
      id: "status",
      label: "Status",
      value: status ?? "",
      placeholder: "All status",
      options: [
        { label: "Active", value: "active" },
        { label: "Archived", value: "archived" },
      ],
      onChange: (value) => setQuery({ status: value, page: "1" }),
    },
  ]

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <SortHeader
            label="Category"
            active={sort === "name"}
            direction={order}
            onClick={() => toggleSort("name")}
          />
        ),
        cell: ({ row }) => <CategoryIdentity category={row.original} />,
      },
      {
        accessorKey: "slug",
        header: () => (
          <SortHeader
            label="Slug"
            active={sort === "slug"}
            direction={order}
            onClick={() => toggleSort("slug")}
          />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.slug}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <SortHeader
            label="Status"
            active={sort === "status"}
            direction={order}
            onClick={() => toggleSort("status")}
          />
        ),
        cell: ({ row }) => (
          <CategoryStatusBadge status={row.original.status} />
        ),
      },
      {
        accessorKey: "created_at",
        header: () => (
          <SortHeader
            label="Created"
            active={sort === "created_at"}
            direction={order}
            onClick={() => toggleSort("created_at")}
          />
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatDateTime(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <CategoryActions category={row.original} />,
      },
    ],
    [sort, order, toggleSort],
  )

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <section className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/10 px-3 py-1 text-xs font-semibold text-[#FF6600]">
            <Tag className="size-3.5" />
            Taxonomy
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Organize products into browsable groups for the storefront.
          </p>
        </div>
        <Button asChild size="lg" className="h-10 rounded-xl">
          <Link href="/dashboard/products/categories/new">
            <Plus className="size-4" />
            Add category
          </Link>
        </Button>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <SignalTile
          label="Total categories"
          value={total.toLocaleString("id-ID")}
        />
        <SignalTile
          label="Visible page"
          value={categories.length.toLocaleString("id-ID")}
        />
        <SignalTile
          label="Filtered status"
          value={status ? status : "all"}
          className="capitalize"
        />
      </div>

      <DataTable
        columns={columns}
        data={categories}
        rowCount={total}
        pagination={{ pageIndex: page - 1, pageSize: perPage }}
        onPaginationChange={(next) =>
          setQuery({
            page: String(next.pageIndex + 1),
            per_page: String(next.pageSize),
          })
        }
        sorting={sorting}
        onSortingChange={(next) => {
          const item = next[0]
          if (!item) return
          setQuery({
            sort: item.id,
            order: item.desc ? "desc" : "asc",
            page: "1",
          })
        }}
        search={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search categories by name or slug..."
        filters={filters}
        isLoading={categoriesQuery.isLoading}
        isError={categoriesQuery.isError}
        emptyTitle="No categories found"
        emptyDescription="Create your first category or adjust filters."
        errorTitle="Categories unavailable"
        errorDescription="Check admin session and backend health."
        mobileRow={mobileRow}
      />
    </div>
  )
}

function CategoryIdentity({ category }: { category: Category }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6600]/10 text-[#FF6600]">
        <Tag className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {category.name}
        </p>
        {category.parent_id && (
          <p className="truncate text-xs text-muted-foreground">
            Has parent category
          </p>
        )}
      </div>
    </div>
  )
}

function mobileRow(row: Row<Category>) {
  const category = row.original

  return (
    <div
      key={category.id}
      className="min-w-0 rounded-xl border border-border bg-background p-3 shadow-sm"
    >
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <CategoryIdentity category={category} />
        </div>
        <div className="shrink-0">
          <CategoryActions category={category} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <CategoryStatusBadge status={category.status} />
      </div>
      <span className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-xs font-medium text-muted-foreground">
        Created {formatDateTime(category.created_at)}
      </span>
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

function parseStatus(value: string | null): CategoryStatus | undefined {
  return value === "active" || value === "archived" ? value : undefined
}
