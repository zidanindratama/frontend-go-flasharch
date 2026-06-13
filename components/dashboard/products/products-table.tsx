"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table"
import { ArrowUpRight, Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, SortHeader, type DataTableFilter } from "@/components/common/data-table"
import { ProductStatusBadge } from "@/components/dashboard/products/product-badges"
import { ProductActions } from "@/components/dashboard/products/product-actions"
import { formatDateTime, formatPrice } from "@/components/dashboard/products/product-utils"
import { listAdminProducts, type Product, type ProductStatus } from "@/lib/api/catalog"
import { cn } from "@/lib/utils"

const sortableColumns = new Set([
  "created_at",
  "updated_at",
  "name",
  "sku",
  "base_price_amount",
  "status",
])

export function ProductsTable() {
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

  const productsQuery = useQuery({
    queryKey: ["admin-products", params],
    queryFn: async () => {
      const response = await listAdminProducts(params)
      return response.data
    },
  })

  const payload = productsQuery.data?.data
  const products = payload?.items ?? []
  const total = payload?.total ?? 0

  const filters: DataTableFilter[] = [
    {
      id: "status",
      label: "Status",
      value: status ?? "",
      placeholder: "All status",
      options: [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
        { label: "Archived", value: "archived" },
      ],
      onChange: (value) => setQuery({ status: value, page: "1" }),
    },
  ]

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <SortHeader
            label="Product"
            active={sort === "name"}
            direction={order}
            onClick={() => toggleSort("name")}
          />
        ),
        cell: ({ row }) => <ProductIdentity product={row.original} />,
      },
      {
        accessorKey: "sku",
        header: () => (
          <SortHeader
            label="SKU"
            active={sort === "sku"}
            direction={order}
            onClick={() => toggleSort("sku")}
          />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.sku}
          </span>
        ),
      },
      {
        accessorKey: "base_price_amount",
        header: () => (
          <SortHeader
            label="Price"
            active={sort === "base_price_amount"}
            direction={order}
            onClick={() => toggleSort("base_price_amount")}
          />
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm font-medium tabular-nums">
            {formatPrice(row.original.base_price_amount)}
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
          <ProductStatusBadge status={row.original.status} />
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
        cell: ({ row }) => <ProductActions product={row.original} />,
      },
    ],
    [sort, order, toggleSort],
  )

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <section className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/10 px-3 py-1 text-xs font-semibold text-[#FF6600]">
            <Package className="size-3.5" />
            Product catalog
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage product listings, pricing, and catalog status for the storefront.
          </p>
        </div>
        <Button asChild size="lg" className="h-10 rounded-xl">
          <Link href="/dashboard/products/new">
            <Plus className="size-4" />
            Add product
          </Link>
        </Button>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <SignalTile label="Total products" value={total.toLocaleString("id-ID")} />
        <SignalTile
          label="Visible page"
          value={products.length.toLocaleString("id-ID")}
        />
        <SignalTile
          label="Filtered status"
          value={status ? status : "all"}
          className="capitalize"
        />
      </div>

      <DataTable
        columns={columns}
        data={products}
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
        filters={filters}
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
        emptyTitle="No products found"
        emptyDescription="Create your first product or adjust filters."
        errorTitle="Products unavailable"
        errorDescription="Check admin session and backend health."
        mobileRow={mobileRow}
      />
    </div>
  )
}

function ProductIdentity({ product }: { product: Product }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {product.thumbnail_url ? (
        <img
          src={product.thumbnail_url}
          alt={product.name}
          className="size-10 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Package className="size-4" />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {product.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{product.slug}</p>
      </div>
    </div>
  )
}

function mobileRow(row: Row<Product>) {
  const product = row.original

  return (
    <div
      key={product.id}
      className="min-w-0 rounded-xl border border-border bg-background p-3 shadow-sm"
    >
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <ProductIdentity product={product} />
        </div>
        <div className="shrink-0">
          <ProductActions product={product} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ProductStatusBadge status={product.status} />
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {formatPrice(product.base_price_amount)}
        </span>
      </div>
      <Link
        href={`/dashboard/products/${product.id}`}
        className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="truncate">
          Created {formatDateTime(product.created_at)}
        </span>
        <ArrowUpRight className="size-3 shrink-0" />
      </Link>
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

function parseStatus(value: string | null): ProductStatus | undefined {
  return value === "active" || value === "draft" || value === "archived"
    ? value
    : undefined
}
