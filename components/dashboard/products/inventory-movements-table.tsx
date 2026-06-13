"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table"
import { Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable, SortHeader, type DataTableFilter } from "@/components/common/data-table"
import { formatDateTime } from "@/components/dashboard/products/product-utils"
import {
  formatMovementType,
  movementTypeColor,
  formatDelta,
  deltaColor,
} from "@/components/dashboard/products/inventory-utils"
import { cn } from "@/lib/utils"
import {
  listInventoryMovements,
  type InventoryMovement,
  type MovementType,
} from "@/lib/api/inventory"

const sortableColumns = new Set([
  "created_at",
  "quantity_delta",
  "movement_type",
  "product_name",
  "warehouse_code",
  "reference_type",
])

const movementTypeOptions: { label: string; value: MovementType }[] = [
  { label: "Adjustment In", value: "adjustment_in" },
  { label: "Adjustment Out", value: "adjustment_out" },
  { label: "Reserved", value: "reservation" },
  { label: "Sold", value: "sale" },
  { label: "Released", value: "release" },
]

export function InventoryMovementsTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  )

  const page = positiveInt(searchParams.get("page"), 1)
  const perPage = positiveInt(searchParams.get("per_page"), 10)
  const sort = searchParams.get("sort") ?? "created_at"
  const order: "asc" | "desc" =
    searchParams.get("order") === "asc" ? "asc" : "desc"
  const warehouseCode = searchParams.get("warehouse_code") ?? ""
  const movementType = searchParams.get("movement_type") ?? ""

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
      warehouse_code: warehouseCode || undefined,
      movement_type: (movementType as MovementType) || undefined,
    }),
    [page, perPage, searchParams, sort, order, warehouseCode, movementType],
  )

  const movementsQuery = useQuery({
    queryKey: ["admin-inventory-movements", params],
    queryFn: async () => {
      const response = await listInventoryMovements(params)
      return response.data
    },
  })

  const payload = movementsQuery.data?.data
  const movements = useMemo(() => payload?.items ?? [], [payload])
  const total = payload?.total ?? 0

  const summary = useMemo(() => {
    let totalIn = 0
    let totalOut = 0
    let totalSales = 0
    for (const m of movements) {
      if (m.movement_type === "adjustment_in") totalIn += m.quantity_delta
      else if (m.movement_type === "adjustment_out") totalOut += m.quantity_delta
      else if (m.movement_type === "sale") totalSales += Math.abs(m.quantity_delta)
    }
    return { totalIn, totalOut, totalSales }
  }, [movements])

  const filters: DataTableFilter[] = [
    {
      id: "movement_type",
      label: "Type",
      value: movementType,
      placeholder: "All types",
      options: movementTypeOptions,
      onChange: (value) => setQuery({ movement_type: value, page: "1" }),
    },
    {
      id: "warehouse_code",
      label: "Warehouse",
      value: warehouseCode,
      placeholder: "All warehouses",
      options: [{ label: "Main Warehouse (MAIN)", value: "MAIN" }],
      onChange: (value) => setQuery({ warehouse_code: value, page: "1" }),
    },
  ]

  const columns = useMemo<ColumnDef<InventoryMovement>[]>(
    () => [
      {
        accessorKey: "product_name",
        header: () => (
          <SortHeader
            label="Product"
            active={sort === "product_name"}
            direction={order}
            onClick={() => toggleSort("product_name")}
          />
        ),
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FF6600]/10 text-[#FF6600]">
              <Package className="size-3.5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {row.original.product.name}
              </p>
              <p className="truncate font-mono text-xs text-muted-foreground">
                {row.original.product.sku}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "movement_type",
        header: () => (
          <SortHeader
            label="Type"
            active={sort === "movement_type"}
            direction={order}
            onClick={() => toggleSort("movement_type")}
          />
        ),
        cell: ({ row }) => (
          <MovementTypeBadge type={row.original.movement_type} />
        ),
      },
      {
        accessorKey: "quantity_delta",
        header: () => (
          <SortHeader
            label="Qty"
            active={sort === "quantity_delta"}
            direction={order}
            onClick={() => toggleSort("quantity_delta")}
          />
        ),
        cell: ({ row }) => (
          <span
            className={cn(
              "whitespace-nowrap tabular-nums font-semibold",
              deltaColor(row.original.quantity_delta),
            )}
          >
            {formatDelta(row.original.quantity_delta)}
          </span>
        ),
      },
      {
        accessorKey: "reason",
        header: () => <span className="text-xs font-semibold uppercase text-muted-foreground">Reason</span>,
        cell: ({ row }) => (
          <p className="max-w-[200px] truncate text-sm text-muted-foreground">
            {row.original.reason || "—"}
          </p>
        ),
      },
      {
        id: "snapshot",
        header: () => <span className="text-xs font-semibold uppercase text-muted-foreground">Before → After</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
            <span>{row.original.snapshot_before?.available_quantity ?? "—"}</span>
            <span>→</span>
            <span className="font-medium text-foreground">
              {row.original.snapshot_after?.available_quantity ?? "—"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "warehouse_code",
        header: () => (
          <SortHeader
            label="Warehouse"
            active={sort === "warehouse_code"}
            direction={order}
            onClick={() => toggleSort("warehouse_code")}
          />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.warehouse.code}
          </span>
        ),
      },
      {
        accessorKey: "created_at",
        header: () => (
          <SortHeader
            label="Time"
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
    ],
    [sort, order, toggleSort],
  )

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="grid gap-3 sm:grid-cols-4">
        <SignalTile
          label="Total movements"
          value={total.toLocaleString("id-ID")}
        />
        <SignalTile
          label="Stock in"
          value={`+${summary.totalIn.toLocaleString("id-ID")}`}
          className="text-emerald-600 dark:text-emerald-400"
        />
        <SignalTile
          label="Stock out"
          value={summary.totalOut.toLocaleString("id-ID")}
          className="text-red-600 dark:text-red-400"
        />
        <SignalTile
          label="Sales"
          value={summary.totalSales.toLocaleString("id-ID")}
          className="text-teal-600 dark:text-teal-400"
        />
      </div>

      <DataTable
        columns={columns}
        data={movements}
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
        searchPlaceholder="Search movements by product name or SKU..."
        filters={filters}
        isLoading={movementsQuery.isLoading}
        isError={movementsQuery.isError}
        emptyTitle="No movements found"
        emptyDescription="Stock changes will appear here once adjustments or sales occur."
        errorTitle="Movements unavailable"
        errorDescription="Check admin session and backend health."
        mobileRow={mobileRow}
      />
    </div>
  )
}

function MovementTypeBadge({ type }: { type: MovementType }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-xs",
        movementTypeColor(type),
      )}
    >
      {formatMovementType(type)}
    </Badge>
  )
}

function mobileRow(row: Row<InventoryMovement>) {
  const movement = row.original

  return (
    <div
      key={movement.id}
      className="min-w-0 rounded-xl border border-border bg-background p-3 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {movement.product.name}
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground">
            {movement.product.sku}
          </p>
        </div>
        <MovementTypeBadge type={movement.movement_type} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
        <span
          className={cn(
            "font-semibold tabular-nums",
            deltaColor(movement.quantity_delta),
          )}
        >
          {formatDelta(movement.quantity_delta)}
        </span>
        <span className="text-muted-foreground">{movement.reason || "—"}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>Available: {movement.snapshot_before?.available_quantity ?? "—"}</span>
        <span>→</span>
        <span className="font-medium text-foreground">
          {movement.snapshot_after?.available_quantity ?? "—"}
        </span>
      </div>
      <span className="mt-2 inline-block text-xs text-muted-foreground">
        {formatDateTime(movement.created_at)}
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
