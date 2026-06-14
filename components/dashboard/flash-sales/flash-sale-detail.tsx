"use client"

import { useState, type ComponentType } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CircleAlert,
  Edit,
  Loader2,
  Package,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
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
import { FlashSaleStatusBadge } from "./flash-sale-badges"
import { FlashSaleActions } from "./flash-sale-actions"
import {
  canCancel,
  canEnd,
  canPreload,
  canRelease,
  canRevertDraft,
  canRun,
  canSchedule,
  formatDateTime,
  formatPrice,
  isEditable,
  shortId,
} from "./flash-sale-utils"
import {
  checkFlashSaleReadiness,
  deleteFlashSaleItem,
  getAdminFlashSale,
  getFlashSaleReport,
  listAdminFlashSaleItems,
  type FlashSale,
  type FlashSaleItem,
  type FlashSaleItemStatus,
  type FlashSaleReadiness,
  type FlashSaleReport,
} from "@/lib/api/flash-sale"
import { cn } from "@/lib/utils"

export function FlashSaleDetail() {
  const params = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [deleteTarget, setDeleteTarget] = useState<FlashSaleItem | null>(null)

  const saleQuery = useQuery({
    queryKey: ["admin-flash-sale", params.id],
    queryFn: async () => {
      const response = await getAdminFlashSale(params.id, { include_items: false })
      return response.data.data
    },
    enabled: !!params.id,
  })

  const sale = saleQuery.data
  const readinessQuery = useQuery({
    queryKey: ["admin-flash-sale-readiness", params.id],
    queryFn: async () => {
      const response = await checkFlashSaleReadiness(params.id)
      return response.data.data
    },
    enabled:
      !!params.id &&
      !!sale &&
      (sale.status === "scheduled" ||
        sale.status === "running" ||
        !!sale.redis_preloaded_at),
  })

  const reportQuery = useQuery({
    queryKey: ["admin-flash-sale-report", params.id],
    queryFn: async () => {
      const response = await getFlashSaleReport(params.id)
      return response.data.data
    },
    enabled: !!params.id && !!sale,
  })

  const itemsMetaQuery = useQuery({
    queryKey: ["admin-flash-sale-items-meta", params.id],
    queryFn: async () => {
      const response = await listAdminFlashSaleItems(params.id, { page: 1, per_page: 1 })
      return response.data.data
    },
    enabled: !!params.id && !!sale,
  })

  const activeItemsMetaQuery = useQuery({
    queryKey: ["admin-flash-sale-items-meta", params.id, "active"],
    queryFn: async () => {
      const response = await listAdminFlashSaleItems(params.id, {
        page: 1,
        per_page: 1,
        status: "active",
      })
      return response.data.data
    },
    enabled: !!params.id && !!sale,
  })

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => deleteFlashSaleItem(params.id, itemId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Item removed")
      setDeleteTarget(null)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-flash-sale", params.id] }),
        queryClient.invalidateQueries({ queryKey: ["admin-flash-sale-items", params.id] }),
        queryClient.invalidateQueries({ queryKey: ["admin-flash-sale-items-meta", params.id] }),
        queryClient.invalidateQueries({ queryKey: ["admin-flash-sale-report", params.id] }),
        queryClient.invalidateQueries({ queryKey: ["admin-flash-sale-readiness", params.id] }),
      ])
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
      setDeleteTarget(null)
    },
  })

  if (saleQuery.isLoading) return <FlashSaleDetailSkeleton />

  if (saleQuery.isError || !sale) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-muted-foreground">Flash sale not found.</p>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Link href="/dashboard/flash-sales">
            <ArrowLeft className="size-4" />
            All flash sales
          </Link>
        </Button>
      </div>
    )
  }

  const editable = isEditable(sale.status)
  const readiness = readinessQuery.data
  const report = reportQuery.data
  const totalItems = itemsMetaQuery.data?.total ?? 0
  const activeItems = activeItemsMetaQuery.data?.total ?? 0
  const hasActions =
    canSchedule(sale.status) ||
    canRevertDraft(sale.status) ||
    canPreload(sale.status) ||
    canRun(sale.status) ||
    canRelease(sale.status) ||
    canEnd(sale.status) ||
    canCancel(sale.status)

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2 text-muted-foreground">
        <Link href="/dashboard/flash-sales">
          <ArrowLeft className="size-4" />
          All flash sales
        </Link>
      </Button>

      <CommandBand
        sale={sale}
        readiness={readiness}
        readinessLoading={readinessQuery.isLoading}
        report={report}
        activeItems={activeItems}
        totalItems={totalItems}
      />

      {hasActions && (
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
          <FlashSaleActions
            saleId={sale.id}
            status={sale.status}
            redisPreloadedAt={sale.redis_preloaded_at}
            readinessReady={readiness?.ready}
            readinessLoading={readinessQuery.isLoading}
          />
        </div>
      )}

      <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <div className="grid min-w-0 gap-4">
          <ReadinessPanel
            sale={sale}
            readiness={readiness}
            isLoading={readinessQuery.isLoading}
            activeItems={activeItems}
          />
          <ItemsPanel
            saleId={sale.id}
            editable={editable}
            onRequestDelete={setDeleteTarget}
            isDeleting={deleteItemMutation.isPending}
          />
        </div>
        <ReportPanel report={report} isLoading={reportQuery.isLoading} isError={reportQuery.isError} />
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove item?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {deleteTarget?.product.name ?? "this product"} from the sale.
              Warehouse stock is not changed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteItemMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteItemMutation.mutate(deleteTarget.id)}
              disabled={deleteItemMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteItemMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function CommandBand({
  sale,
  readiness,
  readinessLoading,
  report,
  activeItems,
  totalItems,
}: {
  sale: FlashSale
  readiness?: FlashSaleReadiness
  readinessLoading: boolean
  report?: FlashSaleReport
  activeItems: number
  totalItems: number
}) {
  const readinessLabel = readinessLoading
    ? "Checking Redis"
    : readiness?.ready
      ? "Ready to run"
      : sale.redis_preloaded_at
        ? "Redis needs attention"
        : "Redis not preloaded"

  return (
    <section className="relative min-w-0 overflow-hidden rounded-xl border border-[#2b2926] bg-[#20201f] p-5 text-white shadow-lg sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-[#FF6600]/50" />
      <div className="relative grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/12 px-3 py-1 text-xs font-semibold text-[#ff8a3d]">
              <Zap className="size-3.5" />
              Ops Command
            </span>
            <FlashSaleStatusBadge status={sale.status} />
            <Badge variant="outline" className="border-white/15 bg-white/[0.04] text-white/65">
              {shortId(sale.id)}
            </Badge>
          </div>
          <h1 className="mt-4 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
            {sale.name}
          </h1>
          <p className="mt-1 break-all font-mono text-xs text-white/45">/{sale.slug}</p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/62">
            {sale.description || "No description configured."}
          </p>
        </div>

        <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:min-w-[28rem]">
          <Signal label="Schedule" value={`${formatDateTime(sale.starts_at)} to ${formatDateTime(sale.ends_at)}`} icon={Calendar} />
          <Signal label="Readiness" value={readinessLabel} icon={ShieldCheck} tone={readiness?.ready ? "success" : "warn"} />
          <Signal label="Active items" value={`${activeItems} of ${totalItems}`} icon={Package} />
          <Signal label="Checkouts" value={report ? String(report.total_checkouts) : "No report"} icon={ReceiptText} />
        </div>
      </div>
    </section>
  )
}

function Signal({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string
  value: string
  icon: ComponentType<{ className?: string }>
  tone?: "neutral" | "success" | "warn"
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.045] p-3">
      <div className="flex items-center gap-2 text-[11px] font-medium text-white/38">
        <Icon
          className={cn(
            "size-3.5",
            tone === "success" && "text-[#39FF14]",
            tone === "warn" && "text-[#ff9f43]",
          )}
        />
        {label}
      </div>
      <p className="mt-2 break-words text-sm font-medium leading-5 text-white/80">{value}</p>
    </div>
  )
}

function ReadinessPanel({
  sale,
  readiness,
  isLoading,
  activeItems,
}: {
  sale: FlashSale
  readiness?: FlashSaleReadiness
  isLoading: boolean
  activeItems: number
}) {
  const blockingReason = getBlockingReason(sale, readiness, activeItems)

  return (
    <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Readiness gate</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Redis preload, active items, and launch blockers.
          </p>
        </div>
        {isLoading ? (
          <Badge variant="outline">Checking</Badge>
        ) : readiness?.ready ? (
          <Badge variant="outline" className="border-[#39FF14]/25 bg-[#39FF14]/10 text-[#1a8a0a] dark:text-[#39FF14]">
            Ready
          </Badge>
        ) : (
          <Badge variant="outline" className="border-[#FF6600]/25 bg-[#FF6600]/10 text-[#d65300]">
            Blocked
          </Badge>
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <ReadinessMetric
          label="Redis preload"
          value={sale.redis_preloaded_at ? formatDateTime(sale.redis_preloaded_at) : "Missing"}
          good={!!sale.redis_preloaded_at}
        />
        <ReadinessMetric
          label="Active items"
          value={String(activeItems)}
          good={activeItems > 0}
        />
        <ReadinessMetric
          label="Blocking reason"
          value={blockingReason}
          good={!blockingReason}
        />
      </div>

      {!!readiness?.missing_keys?.length && (
        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
          <p className="text-xs font-medium text-muted-foreground">Missing keys</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {readiness.missing_keys.map((key) => (
              <code key={key} className="rounded-md bg-background px-2 py-1 text-xs text-foreground">
                {key}
              </code>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function ReadinessMetric({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 flex min-w-0 items-center gap-2">
        {good ? (
          <CheckCircle2 className="size-4 shrink-0 text-[#1a8a0a] dark:text-[#39FF14]" />
        ) : (
          <CircleAlert className="size-4 shrink-0 text-[#FF6600]" />
        )}
        <p className="min-w-0 break-words text-sm font-medium text-foreground">{value || "None"}</p>
      </div>
    </div>
  )
}

function ItemsPanel({
  saleId,
  editable,
  onRequestDelete,
  isDeleting,
}: {
  saleId: string
  editable: boolean
  onRequestDelete: (item: FlashSaleItem) => void
  isDeleting: boolean
}) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | FlashSaleItemStatus>("all")
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const itemsQuery = useQuery({
    queryKey: ["admin-flash-sale-items", saleId, page, pageSize, query, statusFilter],
    queryFn: async () => {
      const response = await listAdminFlashSaleItems(saleId, {
        page,
        per_page: pageSize,
        search: query.trim() || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      })
      return response.data.data
    },
    enabled: !!saleId,
  })

  const items = itemsQuery.data?.items ?? []
  const total = itemsQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const visibleStart = total === 0 ? 0 : startIndex + 1
  const visibleEnd = Math.min(startIndex + items.length, total)
  const hasFilter = query.trim() !== "" || statusFilter !== "all"

  const updateQuery = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const updateStatus = (value: "all" | FlashSaleItemStatus) => {
    setStatusFilter(value)
    setPage(1)
  }

  const updatePageSize = (value: string) => {
    setPageSize(Number(value))
    setPage(1)
  }

  return (
    <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Item operations</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Server-side search, status filter, stock split, and sale pricing.
          </p>
        </div>
        {editable && (
          <Button asChild size="sm" className="gap-2 rounded-xl sm:w-fit">
            <Link href={`/dashboard/flash-sales/${saleId}/items/new`}>
              <Plus className="size-4" />
              Add item
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,1fr)_9rem_8rem]">
        <div className="relative col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Search product or SKU"
            className="h-10 rounded-lg pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={updateStatus}>
          <SelectTrigger className="h-10 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
            <SelectItem value="sold_out">Sold out</SelectItem>
          </SelectContent>
        </Select>
        <Select value={String(pageSize)} onValueChange={updatePageSize}>
          <SelectTrigger className="h-10 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 rows</SelectItem>
            <SelectItem value="25">25 rows</SelectItem>
            <SelectItem value="50">50 rows</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {itemsQuery.isLoading ? (
        <div className="mt-5 grid gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : total === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          {hasFilter ? (
            <Search className="mx-auto size-6 text-muted-foreground" />
          ) : (
            <Package className="mx-auto size-6 text-muted-foreground" />
          )}
          <p className="mt-3 text-sm font-medium text-foreground">
            {hasFilter ? "No matching items" : "No sale items"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {hasFilter
              ? "Adjust search or status filter to find products in this sale."
              : "Add active products before scheduling and preloading Redis."}
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <div className="grid gap-2 md:hidden">
            {items.map((item) => (
              <MobileItemCard
                key={item.id}
                item={item}
                saleId={saleId}
                editable={editable}
                onRequestDelete={onRequestDelete}
                isDeleting={isDeleting}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/40">
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                  <th className="px-3 py-3">Product</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Price</th>
                  <th className="px-3 py-3 text-right">Stock</th>
                  <th className="px-3 py-3 text-right">Reserved</th>
                  <th className="px-3 py-3 text-right">Sold</th>
                  <th className="px-3 py-3 text-right">Remaining</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    saleId={saleId}
                    editable={editable}
                    onRequestDelete={onRequestDelete}
                    isDeleting={isDeleting}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {visibleStart}-{visibleEnd} of {total}
              {itemsQuery.isFetching ? " - refreshing" : ""}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-lg"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <span className="min-w-16 text-center tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-lg"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="size-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function ItemRow({
  item,
  saleId,
  editable,
  onRequestDelete,
  isDeleting,
}: {
  item: FlashSaleItem
  saleId: string
  editable: boolean
  onRequestDelete: (item: FlashSaleItem) => void
  isDeleting: boolean
}) {
  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="px-3 py-3">
        <p className="font-medium text-foreground">{item.product.name}</p>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">{item.product.sku}</p>
      </td>
      <td className="px-3 py-3">
        <ItemStatusBadge status={item.status} />
      </td>
      <td className="px-3 py-3 text-right font-medium text-[#d65300]">
        {formatPrice(item.sale_price_amount)}
      </td>
      <td className="px-3 py-3 text-right tabular-nums">{item.sale_stock_quantity}</td>
      <td className="px-3 py-3 text-right tabular-nums text-amber-600 dark:text-amber-400">
        {item.reserved_quantity}
      </td>
      <td className="px-3 py-3 text-right tabular-nums text-[#1a8a0a] dark:text-[#39FF14]">
        {item.sold_quantity}
      </td>
      <td className="px-3 py-3 text-right tabular-nums font-medium">
        {item.remaining_quantity}
      </td>
      <td className="px-3 py-3 text-right">
        {editable ? (
          <div className="flex items-center justify-end gap-1">
            <Button asChild variant="ghost" size="icon-sm" className="rounded-lg">
              <Link href={`/dashboard/flash-sales/${saleId}/items/${item.id}/edit`}>
                <Edit className="size-4" />
                <span className="sr-only">Edit item</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg text-destructive hover:text-destructive"
              onClick={() => onRequestDelete(item)}
              disabled={isDeleting}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete item</span>
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Locked</span>
        )}
      </td>
    </tr>
  )
}

function MobileItemCard({
  item,
  saleId,
  editable,
  onRequestDelete,
  isDeleting,
}: {
  item: FlashSaleItem
  saleId: string
  editable: boolean
  onRequestDelete: (item: FlashSaleItem) => void
  isDeleting: boolean
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-3">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-sm font-medium leading-5 text-foreground">
            {item.product.name}
          </p>
          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
            {item.product.sku}
          </p>
        </div>
        <ItemStatusBadge status={item.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <MobileStat label="Price" value={formatPrice(item.sale_price_amount)} tone="price" />
        <MobileStat label="Remaining" value={String(item.remaining_quantity)} strong />
        <MobileStat label="Stock" value={String(item.sale_stock_quantity)} />
        <MobileStat label="Reserved" value={String(item.reserved_quantity)} tone="warn" />
        <MobileStat label="Sold" value={String(item.sold_quantity)} tone="success" />
      </div>

      <div className="mt-3 flex items-center justify-end border-t border-border pt-2">
        {editable ? (
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon-sm" className="rounded-lg">
              <Link href={`/dashboard/flash-sales/${saleId}/items/${item.id}/edit`}>
                <Edit className="size-4" />
                <span className="sr-only">Edit item</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg text-destructive hover:text-destructive"
              onClick={() => onRequestDelete(item)}
              disabled={isDeleting}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete item</span>
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Locked</span>
        )}
      </div>
    </div>
  )
}

function MobileStat({
  label,
  value,
  tone = "neutral",
  strong = false,
}: {
  label: string
  value: string
  tone?: "neutral" | "price" | "warn" | "success"
  strong?: boolean
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 break-words text-sm tabular-nums text-foreground",
          strong && "font-semibold",
          tone === "price" && "font-medium text-[#d65300]",
          tone === "warn" && "text-amber-600 dark:text-amber-400",
          tone === "success" && "text-[#1a8a0a] dark:text-[#39FF14]",
        )}
      >
        {value}
      </p>
    </div>
  )
}

function ReportPanel({
  report,
  isLoading,
  isError,
}: {
  report?: FlashSaleReport
  isLoading: boolean
  isError: boolean
}) {
  if (isLoading) {
    return (
      <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="h-5 w-32" />
        <div className="mt-5 grid gap-3 min-[360px]:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  if (isError || !report) {
    return (
      <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-semibold text-foreground">Realtime report</h2>
        <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
          Report unavailable. Check reporting service and sale activity.
        </div>
      </section>
    )
  }

  const pressureItems = [...report.items]
    .sort((a, b) => {
      const remainingDelta = a.remaining_quantity - b.remaining_quantity
      if (remainingDelta !== 0) return remainingDelta
      return b.sold_quantity - a.sold_quantity
    })
    .slice(0, 8)

  return (
    <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Realtime report</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Generated {formatDateTime(report.generated_at)}
          </p>
        </div>
        <ReceiptText className="size-4 text-muted-foreground" />
      </div>

      <div className="mt-5 grid gap-3 min-[360px]:grid-cols-2">
        <ReportMetric label="Revenue" value={formatPrice(report.revenue_amount)} />
        <ReportMetric label="Total checkouts" value={String(report.total_checkouts)} />
        <ReportMetric label="Confirmed" value={String(report.confirmed_checkouts)} />
        <ReportMetric label="Paid orders" value={String(report.paid_orders)} />
        <ReportMetric label="Pending payments" value={String(report.pending_payments)} />
        <ReportMetric label="Conversion" value={`${Math.round(report.conversion_rate)}%`} />
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-medium text-muted-foreground">Checkout counts</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(report.checkout_counts ?? {}).length === 0 ? (
            <span className="text-xs text-muted-foreground">No checkout counters yet.</span>
          ) : (
            Object.entries(report.checkout_counts).map(([status, count]) => (
              <Badge key={status} variant="outline" className="rounded-full">
                {status}: {count}
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground">Pressure items</p>
          {report.items.length > pressureItems.length && (
            <span className="text-xs text-muted-foreground">
              Top {pressureItems.length} of {report.items.length}
            </span>
          )}
        </div>
        <div className="mt-3 grid gap-2">
          {report.items.length === 0 ? (
            <p className="text-xs text-muted-foreground">No item counters yet.</p>
          ) : (
            pressureItems.map((item) => (
              <div key={item.item_id} className="min-w-0 rounded-xl border border-border bg-background p-3">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium leading-5 text-foreground">{item.product_name}</p>
                    <p className="mt-0.5 break-all font-mono text-xs text-muted-foreground">{item.sku}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                    {item.remaining_quantity}
                  </p>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground min-[360px]:grid-cols-3">
                  <span>Stock {item.sale_stock_quantity}</span>
                  <span>Reserved {item.reserved_quantity}</span>
                  <span>Sold {item.sold_quantity}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function ReportMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-lg font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  )
}

function ItemStatusBadge({ status }: { status: FlashSaleItemStatus }) {
  const styles: Record<FlashSaleItemStatus, string> = {
    active: "border-[#39FF14]/25 bg-[#39FF14]/10 text-[#1a8a0a] dark:text-[#39FF14]",
    hidden: "border-muted-foreground/20 bg-muted/50 text-muted-foreground",
    sold_out: "border-destructive/25 bg-destructive/10 text-destructive",
  }
  return (
    <Badge variant="outline" className={styles[status]}>
      {status.replace("_", " ")}
    </Badge>
  )
}

function getBlockingReason(sale: FlashSale, readiness?: FlashSaleReadiness, activeItems = 0) {
  if (sale.status === "draft") return "Schedule sale first"
  if (!sale.redis_preloaded_at) return "Preload Redis"
  if (activeItems === 0) {
    return "Add active item"
  }
  if (readiness && !readiness.ready) return "Missing Redis keys"
  return ""
}

function FlashSaleDetailSkeleton() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-52 rounded-2xl" />
      <Skeleton className="h-16 rounded-2xl" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <div className="grid gap-4">
          <Skeleton className="h-52 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  )
}
