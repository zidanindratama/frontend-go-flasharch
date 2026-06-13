"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table"
import { ArrowUpRight, Package, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable, SortHeader, type DataTableFilter } from "@/components/common/data-table"
import { formatDateTime } from "@/components/dashboard/products/product-utils"
import { cn } from "@/lib/utils"
import {
  listInventoryStocks,
  type StockSnapshot,
} from "@/lib/api/inventory"

const sortableColumns = new Set([
  "created_at",
  "updated_at",
  "on_hand_quantity",
  "reserved_quantity",
  "sold_quantity",
  "available_quantity",
  "product_name",
  "warehouse_code",
])

export function InventoryStocksTable() {
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
  const lowStock = searchParams.get("low_stock") === "true"

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
      low_stock: lowStock || undefined,
    }),
    [page, perPage, searchParams, sort, order, warehouseCode, lowStock],
  )

  const stocksQuery = useQuery({
    queryKey: ["admin-inventory-stocks", params],
    queryFn: async () => {
      const response = await listInventoryStocks(params)
      return response.data
    },
  })

  const payload = stocksQuery.data?.data
  const stocks = useMemo(() => payload?.items ?? [], [payload])
  const total = payload?.total ?? 0

  const lowStockCount = useMemo(
    () =>
      stocks.filter(
        (s) =>
          s.available_quantity <= 10 &&
          s.available_quantity > 0,
      ).length,
    [stocks],
  )

  const filters: DataTableFilter[] = [
    {
      id: "warehouse_code",
      label: "Warehouse",
      value: warehouseCode,
      placeholder: "All warehouses",
      options: [{ label: "Main Warehouse (MAIN)", value: "MAIN" }],
      onChange: (value) => setQuery({ warehouse_code: value, page: "1" }),
    },
  ]

  const columns = useMemo<ColumnDef<StockSnapshot>[]>(
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
        cell: ({ row }) => <ProductIdentity stock={row.original} />,
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
        accessorKey: "on_hand_quantity",
        header: () => (
          <SortHeader
            label="On Hand"
            active={sort === "on_hand_quantity"}
            direction={order}
            onClick={() => toggleSort("on_hand_quantity")}
          />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums font-medium">
            {row.original.on_hand_quantity.toLocaleString("id-ID")}
          </span>
        ),
      },
      {
        accessorKey: "reserved_quantity",
        header: () => (
          <SortHeader
            label="Reserved"
            active={sort === "reserved_quantity"}
            direction={order}
            onClick={() => toggleSort("reserved_quantity")}
          />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {row.original.reserved_quantity.toLocaleString("id-ID")}
          </span>
        ),
      },
      {
        accessorKey: "sold_quantity",
        header: () => (
          <SortHeader
            label="Sold"
            active={sort === "sold_quantity"}
            direction={order}
            onClick={() => toggleSort("sold_quantity")}
          />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {row.original.sold_quantity.toLocaleString("id-ID")}
          </span>
        ),
      },
      {
        accessorKey: "available_quantity",
        header: () => (
          <SortHeader
            label="Available"
            active={sort === "available_quantity"}
            direction={order}
            onClick={() => toggleSort("available_quantity")}
          />
        ),
        cell: ({ row }) => (
          <AvailableBadge quantity={row.original.available_quantity} />
        ),
      },
      {
        accessorKey: "updated_at",
        header: () => (
          <SortHeader
            label="Updated"
            active={sort === "updated_at"}
            direction={order}
            onClick={() => toggleSort("updated_at")}
          />
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatDateTime(row.original.updated_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <StockActions stock={row.original} />,
      },
    ],
    [sort, order, toggleSort],
  )

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="grid gap-3 sm:grid-cols-4">
        <SignalTile
          label="Total products"
          value={total.toLocaleString("id-ID")}
        />
        <SignalTile
          label="On hand"
          value={stocks
            .reduce((sum, s) => sum + s.on_hand_quantity, 0)
            .toLocaleString("id-ID")}
        />
        <SignalTile
          label="Reserved"
          value={stocks
            .reduce((sum, s) => sum + s.reserved_quantity, 0)
            .toLocaleString("id-ID")}
        />
        <SignalTile
          label="Low stock"
          value={lowStockCount.toLocaleString("id-ID")}
          highlight={lowStockCount > 0}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="low-stock"
          checked={lowStock}
          onCheckedChange={(checked) =>
            setQuery({ low_stock: checked ? "true" : "", page: "1" })
          }
        />
        <label
          htmlFor="low-stock"
          className="text-sm text-muted-foreground select-none"
        >
          Show low stock only
        </label>
      </div>

      <DataTable
        columns={columns}
        data={stocks}
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
        searchPlaceholder="Search stocks by product name or SKU..."
        filters={filters}
        isLoading={stocksQuery.isLoading}
        isError={stocksQuery.isError}
        emptyTitle="No stock data found"
        emptyDescription="Create products and adjust their stock to see inventory snapshots."
        errorTitle="Inventory unavailable"
        errorDescription="Check admin session and backend health."
        mobileRow={mobileRow}
      />
    </div>
  )
}

function ProductIdentity({ stock }: { stock: StockSnapshot }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6600]/10 text-[#FF6600]">
        <Package className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {stock.product.name}
        </p>
        <p className="truncate font-mono text-xs text-muted-foreground">
          {stock.product.sku}
        </p>
      </div>
    </div>
  )
}

function AvailableBadge({ quantity }: { quantity: number }) {
  let color = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  if (quantity <= 0) {
    color = "bg-red-500/10 text-red-600 dark:text-red-400"
  } else if (quantity <= 10) {
    color = "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums",
        color,
      )}
    >
      {quantity.toLocaleString("id-ID")}
    </span>
  )
}

function StockActions({ stock }: { stock: StockSnapshot }) {
  return (
    <Button asChild variant="ghost" size="icon" className="size-8">
      <Link href={`/dashboard/products/inventory/adjust/${stock.product.id}`}>
        <Settings2 className="size-4" />
        <span className="sr-only">Adjust stock</span>
      </Link>
    </Button>
  )
}

function mobileRow(row: Row<StockSnapshot>) {
  const stock = row.original

  return (
    <div
      key={stock.id}
      className="min-w-0 rounded-xl border border-border bg-background p-3 shadow-sm"
    >
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <ProductIdentity stock={stock} />
        </div>
        <div className="shrink-0">
          <StockActions stock={stock} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">On hand: </span>
          <span className="font-medium tabular-nums">
            {stock.on_hand_quantity}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Available: </span>
          <AvailableBadge quantity={stock.available_quantity} />
        </div>
        <div>
          <span className="text-muted-foreground">Reserved: </span>
          <span className="tabular-nums">{stock.reserved_quantity}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Sold: </span>
          <span className="tabular-nums">{stock.sold_quantity}</span>
        </div>
      </div>
      <Link
        href={`/dashboard/products/inventory/adjust/${stock.product.id}`}
        className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="truncate">
          Warehouse {stock.warehouse.code} &middot; Updated{" "}
          {formatDateTime(stock.updated_at)}
        </span>
        <ArrowUpRight className="size-3 shrink-0" />
      </Link>
    </div>
  )
}

function SignalTile({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 truncate text-2xl font-semibold tracking-tight",
          highlight
            ? "text-amber-600 dark:text-amber-400"
            : "text-foreground",
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
