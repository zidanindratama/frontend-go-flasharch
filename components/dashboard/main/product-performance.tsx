"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table"
import { Package } from "lucide-react"
import { DataTable, SortHeader } from "@/components/common/data-table"
import { getProductPerformance, type ProductPerformance } from "@/lib/api/admin-reports"

const sortableColumns = new Set(["sold_quantity", "gross_revenue_amount", "paid_order_count", "pending_quantity", "cancelled_quantity"])

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function positiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

type DateRange = { from?: string; to?: string }

export function ProductPerformanceTable({ dateRange }: { dateRange: DateRange }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "")

  const page = positiveInt(searchParams.get("page"), 1)
  const perPage = positiveInt(searchParams.get("per_page"), 10)
  const sort = searchParams.get("sort") ?? "gross_revenue_amount"
  const order: "asc" | "desc" = searchParams.get("order") === "asc" ? "asc" : "desc"

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
      from: dateRange.from,
      to: dateRange.to,
    }),
    [page, perPage, searchParams, sort, order, dateRange.from, dateRange.to],
  )

  const query = useQuery({
    queryKey: ["admin.productPerformance", params],
    queryFn: async () => {
      const response = await getProductPerformance(params)
      return response.data
    },
  })

  const payload = query.data?.data
  const items = payload?.items ?? []
  const total = payload?.total ?? 0

  const columns = useMemo<ColumnDef<ProductPerformance>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{row.original.name}</p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">{row.original.sku}</p>
          </div>
        ),
      },
      {
        accessorKey: "sold_quantity",
        header: () => (
          <SortHeader label="Sold" active={sort === "sold_quantity"} direction={order} onClick={() => toggleSort("sold_quantity")} align="right" />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">{row.original.sold_quantity.toLocaleString("id-ID")}</span>
        ),
        meta: { align: "right" },
      },
      {
        accessorKey: "gross_revenue_amount",
        header: () => (
          <SortHeader label="Revenue" active={sort === "gross_revenue_amount"} direction={order} onClick={() => toggleSort("gross_revenue_amount")} align="right" />
        ),
        cell: ({ row }) => (
          <span className="font-medium tabular-nums text-foreground">{formatCurrency(row.original.gross_revenue_amount)}</span>
        ),
        meta: { align: "right" },
      },
      {
        accessorKey: "paid_order_count",
        header: () => (
          <SortHeader label="Orders" active={sort === "paid_order_count"} direction={order} onClick={() => toggleSort("paid_order_count")} align="right" />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">{row.original.paid_order_count.toLocaleString("id-ID")}</span>
        ),
        meta: { align: "right" },
      },
      {
        accessorKey: "pending_quantity",
        header: () => (
          <SortHeader label="Pending" active={sort === "pending_quantity"} direction={order} onClick={() => toggleSort("pending_quantity")} align="right" />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">{row.original.pending_quantity.toLocaleString("id-ID")}</span>
        ),
        meta: { align: "right" },
      },
      {
        accessorKey: "cancelled_quantity",
        header: () => (
          <SortHeader label="Cancelled" active={sort === "cancelled_quantity"} direction={order} onClick={() => toggleSort("cancelled_quantity")} align="right" />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">{row.original.cancelled_quantity.toLocaleString("id-ID")}</span>
        ),
        meta: { align: "right" },
      },
    ],
    [sort, order, toggleSort],
  )

  return (
    <DataTable
      columns={columns}
      data={items}
      rowCount={total}
      pagination={{ pageIndex: page - 1, pageSize: perPage }}
      onPaginationChange={(next) =>
        setQuery({ page: String(next.pageIndex + 1), per_page: String(next.pageSize) })
      }
      sorting={sorting}
      onSortingChange={(next) => {
        const item = next[0]
        if (item) {
          setQuery({ sort: item.id, order: item.desc ? "desc" : "asc", page: "1" })
        } else {
          setQuery({ sort: "gross_revenue_amount", order: "desc", page: "1" })
        }
      }}
      search={searchValue}
      onSearchChange={setSearchValue}
      searchPlaceholder="Search products by name or SKU..."
      isLoading={query.isLoading}
      isError={query.isError}
      emptyTitle="No product performance data"
      emptyDescription="Product sales metrics will appear here once orders are recorded."
      errorTitle="Failed to load product performance"
      errorDescription="Check your session and try again."
      mobileRow={mobileRow}
    />
  )
}

function mobileRow(row: Row<ProductPerformance>) {
  const item = row.original
  return (
    <div key={item.product_id} className="rounded-xl border border-border bg-background p-3 shadow-sm">
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{item.name}</p>
        <p className="mt-0.5 break-all font-mono text-xs text-muted-foreground">{item.sku}</p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">Sold</p>
          <p className="font-medium tabular-nums text-foreground">{item.sold_quantity.toLocaleString("id-ID")}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Revenue</p>
          <p className="font-medium tabular-nums text-foreground">{formatCurrency(item.gross_revenue_amount)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Orders</p>
          <p className="font-medium tabular-nums text-foreground">{item.paid_order_count.toLocaleString("id-ID")}</p>
        </div>
      </div>
    </div>
  )
}
