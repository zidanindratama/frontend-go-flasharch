"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table"
import { Eye, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/common/order-status-badge"
import { DataTable, SortHeader, type DataTableFilter } from "@/components/common/data-table"
import { listAdminOrders, type AdminOrderRow } from "@/lib/api/checkout"

const sortableColumns = new Set(["created_at", "total_amount", "status"])

const allStatuses = [
  "pending_payment",
  "paid",
  "shipped",
  "fulfilled",
  "cancelled",
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function positiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

export function OrdersTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "")

  const page = positiveInt(searchParams.get("page"), 1)
  const perPage = positiveInt(searchParams.get("per_page"), 10)
  const sort = searchParams.get("sort") ?? "created_at"
  const order: "asc" | "desc" = searchParams.get("order") === "asc" ? "asc" : "desc"
  const status = searchParams.get("status") ?? undefined

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

  const ordersQuery = useQuery({
    queryKey: ["admin.orders", params],
    queryFn: async () => {
      const response = await listAdminOrders(params)
      return response.data
    },
  })

  const payload = ordersQuery.data?.data
  const orders = payload?.items ?? []
  const total = payload?.total ?? 0

  const filters: DataTableFilter[] = [
    {
      id: "status",
      label: "Status",
      value: status ?? "",
      placeholder: "All statuses",
      options: allStatuses.map((s) => ({
        label: s.replaceAll("_", " "),
        value: s,
      })),
      onChange: (value) => setQuery({ status: value, page: "1" }),
    },
  ]

  const columns: ColumnDef<AdminOrderRow>[] = [
    {
      accessorKey: "order_code",
      header: ({ column }) => (
        <SortHeader
          label="Order"
          active={sort === column.id}
          direction={order}
          onClick={() => toggleSort(column.id)}
        />
      ),
      cell: ({ row }) => (
        <div className="min-w-0">
          <Link
            href={`/dashboard/orders/${row.original.id}`}
            className="font-medium text-foreground hover:text-[#FF6600] transition-colors"
          >
            <span className="break-all">{row.original.order_code}</span>
          </Link>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {row.original.buyer.full_name || row.original.buyer.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: ({ column }) => (
        <SortHeader
          label="Amount"
          active={sort === column.id}
          direction={order}
          onClick={() => toggleSort(column.id)}
        />
      ),
      cell: ({ row }) => (
        <span className="text-sm font-medium tabular-nums text-foreground">
          {formatCurrency(row.original.total_amount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortHeader
          label="Status"
          active={sort === column.id}
          direction={order}
          onClick={() => toggleSort(column.id)}
        />
      ),
      cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    },
    {
      id: "payment",
      header: "Payment",
      cell: ({ row }) => {
        const p = row.original.payment
        if (!p) return <span className="text-xs text-muted-foreground">-</span>
        return (
          <OrderStatusBadge status={p.status} />
        )
      },
    },
    {
      id: "shipment",
      header: "Shipment",
      cell: ({ row }) => {
        const s = row.original.shipment
        if (!s) return <span className="text-xs text-muted-foreground">-</span>
        return (
          <div className="min-w-0">
            <p className="truncate text-sm text-foreground">{s.carrier}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {s.tracking_number}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <SortHeader
          label="Created"
          active={sort === column.id}
          direction={order}
          onClick={() => toggleSort(column.id)}
        />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground tabular-nums">
          {timeAgo(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="rounded-lg"
          >
            <Link href={`/dashboard/orders/${row.original.id}`}>
              <Eye className="size-4" />
              <span className="sr-only">Detail</span>
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  const mobileRow = (row: Row<AdminOrderRow>) => {
    const order = row.original
    return (
      <Link
        key={order.id}
        href={`/dashboard/orders/${order.id}`}
        className="block rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-[#FF6600]/30"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="break-all font-semibold text-foreground">
              {order.order_code}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {order.buyer.full_name || order.buyer.email}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {formatCurrency(order.total_amount)}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {timeAgo(order.created_at)}
          </span>
        </div>
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/10 px-3 py-1 text-xs font-semibold text-[#FF6600]">
              <ShoppingCart className="size-3.5" />
              Orders
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Manage orders
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track, fulfill, and manage customer orders
            </p>
          </div>
        </div>
      </section>

      <DataTable
        columns={columns}
        data={orders}
        rowCount={total}
        pagination={{ pageIndex: page - 1, pageSize: perPage }}
        onPaginationChange={(p) =>
          setQuery({ page: String(p.pageIndex + 1), per_page: String(p.pageSize) })
        }
        sorting={sorting}
        onSortingChange={(s) => {
          if (s.length) {
            setQuery({ sort: s[0].id, order: s[0].desc ? "desc" : "asc", page: "1" })
          } else {
            setQuery({ sort: "created_at", order: "desc", page: "1" })
          }
        }}
        search={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search orders..."
        filters={filters}
        isLoading={ordersQuery.isLoading}
        isError={ordersQuery.isError}
        emptyTitle="No orders found"
        emptyDescription="Orders will appear here when customers place them."
        errorTitle="Failed to load orders"
        errorDescription="Please try again."
        mobileRow={mobileRow}
      />
    </div>
  )
}
