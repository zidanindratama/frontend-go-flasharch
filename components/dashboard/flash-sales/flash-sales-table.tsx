"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table"
import { Zap, Plus, Eye, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DataTable, SortHeader, type DataTableFilter } from "@/components/common/data-table"
import { FlashSaleStatusBadge } from "./flash-sale-badges"
import { formatDateTime, shortId, isEditable } from "./flash-sale-utils"
import { listAdminFlashSales, deleteFlashSale, type FlashSale, type FlashSaleStatus } from "@/lib/api/flash-sale"
import { getErrorMessage } from "@/lib/api/errors"

const sortableColumns = new Set(["created_at", "updated_at", "name", "starts_at", "status"])

const allStatuses: FlashSaleStatus[] = ["draft", "scheduled", "running", "ended", "cancelled"]

export function FlashSalesTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "")
  const [deleteTarget, setDeleteTarget] = useState<FlashSale | null>(null)

  const page = positiveInt(searchParams.get("page"), 1)
  const perPage = positiveInt(searchParams.get("per_page"), 10)
  const sort = searchParams.get("sort") ?? "created_at"
  const order: "asc" | "desc" = searchParams.get("order") === "asc" ? "asc" : "desc"
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
      status: status ?? undefined,
    }),
    [page, perPage, searchParams, sort, order, status],
  )

  const salesQuery = useQuery({
    queryKey: ["admin.flashSales", params],
    queryFn: async () => {
      const response = await listAdminFlashSales(params)
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (saleId: string) => deleteFlashSale(saleId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Flash sale deleted")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales"] })
      setDeleteTarget(null)
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to delete flash sale"))
      setDeleteTarget(null)
    },
  })

  const payload = salesQuery.data?.data
  const sales = payload?.items ?? []
  const total = payload?.total ?? 0

  const filters: DataTableFilter[] = [
    {
      id: "status",
      label: "Status",
      value: status ?? "",
      placeholder: "All statuses",
      options: allStatuses.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s })),
      onChange: (value) => setQuery({ status: value, page: "1" }),
    },
  ]

  const columns: ColumnDef<FlashSale>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortHeader
          label="Name"
          active={sort === column.id}
          direction={order}
          onClick={() => toggleSort(column.id)}
        />
      ),
      cell: ({ row }) => (
        <div className="min-w-0">
          <Link
            href={`/dashboard/flash-sales/${row.original.id}`}
            className="font-medium text-foreground hover:text-[#FF6600] transition-colors"
          >
            {row.original.name}
          </Link>
          <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
            {shortId(row.original.id)}
          </p>
        </div>
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
      cell: ({ row }) => <FlashSaleStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "starts_at",
      header: ({ column }) => (
        <SortHeader
          label="Starts"
          active={sort === column.id}
          direction={order}
          onClick={() => toggleSort(column.id)}
        />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDateTime(row.original.starts_at)}</span>
      ),
    },
    {
      accessorKey: "ends_at",
      header: "Ends",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDateTime(row.original.ends_at)}</span>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-muted-foreground">{row.original.items?.length ?? 0}</span>
      ),
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
        <span className="text-sm text-muted-foreground">{formatDateTime(row.original.created_at)}</span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <TooltipProvider>
          <div className="flex items-center justify-end gap-1">
            <ActionTooltip label="Detail">
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                className="rounded-lg"
              >
                <Link href={`/dashboard/flash-sales/${row.original.id}`}>
                  <Eye className="size-4" />
                  <span className="sr-only">Detail</span>
                </Link>
              </Button>
            </ActionTooltip>
            {isEditable(row.original.status) && (
              <ActionTooltip label="Edit">
                <Button
                  asChild
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg"
                >
                  <Link href={`/dashboard/flash-sales/${row.original.id}/edit`}>
                    <Pencil className="size-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
              </ActionTooltip>
            )}
            {isEditable(row.original.status) && (
              <ActionTooltip label="Delete">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(row.original)}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </ActionTooltip>
            )}
          </div>
        </TooltipProvider>
      ),
    },
  ]

  const mobileRow = (row: Row<FlashSale>) => {
    const sale = row.original
    return (
      <Link
        key={sale.id}
        href={`/dashboard/flash-sales/${sale.id}`}
        className="block rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-[#FF6600]/30"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{sale.name}</p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">{shortId(sale.id)}</p>
          </div>
          <FlashSaleStatusBadge status={sale.status} />
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{formatDateTime(sale.starts_at)}</span>
          <span>{sale.items?.length ?? 0} items</span>
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
              <Zap className="size-3.5" />
              Flash Sales
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Manage flash sales
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Create, schedule, and monitor flash sale campaigns with real-time stock control.
            </p>
          </div>
          <Button asChild size="lg" className="h-10 rounded-xl shrink-0">
            <Link href="/dashboard/flash-sales/new">
              <Plus className="size-4" />
              Create flash sale
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SignalTile label="Total" value={total} />
        <SignalTile label="Draft" value={sales.filter((s) => s.status === "draft").length} />
        <SignalTile label="Running" value={sales.filter((s) => s.status === "running").length} />
        <SignalTile label="Scheduled" value={sales.filter((s) => s.status === "scheduled").length} />
      </div>

      <DataTable
        columns={columns}
        data={sales}
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
        searchPlaceholder="Search sales..."
        filters={filters}
        isLoading={salesQuery.isLoading}
        isError={salesQuery.isError}
        emptyTitle="No flash sales"
        emptyDescription="Create your first flash sale to get started."
        errorTitle="Sales unavailable"
        errorDescription="Check admin session and backend health."
        mobileRow={mobileRow}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete flash sale?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteTarget?.name}&quot; and all its items. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function SignalTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{value}</p>
    </div>
  )
}

function positiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback
  const n = parseInt(value, 10)
  return n > 0 ? n : fallback
}

function parseStatus(value: string | null): FlashSaleStatus | null {
  if (!value) return null
  if (["draft", "scheduled", "running", "ended", "cancelled"].includes(value)) {
    return value as FlashSaleStatus
  }
  return null
}

function ActionTooltip({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
