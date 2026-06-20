"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CircleAlert,
  Filter,
  ShieldCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { SortHeader } from "@/components/common/data-table"
import { getFlashSaleReconciliation, type ReconciliationReport } from "@/lib/api/flash-sale"
import { cn } from "@/lib/utils"

type ReconciliationPanelProps = {
  saleId: string
}

type SortField = "difference" | "initial_stock" | "postgresql_sold" | "redis_remaining" | "expected_remaining"

export function ReconciliationPanel({ saleId }: ReconciliationPanelProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [sort, setSort] = useState<SortField>("difference")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [mismatchOnly, setMismatchOnly] = useState(false)

  const reconciliationQuery = useQuery({
    queryKey: ["admin.flashSales", saleId, "reconciliation", { page, pageSize, sort, order, mismatchOnly }],
    queryFn: async () => {
      const response = await getFlashSaleReconciliation(saleId, {
        page,
        per_page: pageSize,
        sort,
        order,
        filter: mismatchOnly ? "mismatch" : undefined,
      })
      return response.data.data
    },
    enabled: !!saleId,
  })

  const report = reconciliationQuery.data
  const items = report?.items ?? []
  const total = report?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const visibleStart = total === 0 ? 0 : startIndex + 1
  const visibleEnd = Math.min(startIndex + items.length, total)

  const toggleSort = (field: SortField) => {
    if (sort === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSort(field)
      setOrder("desc")
    }
    setPage(1)
  }

  const updatePageSize = (value: string) => {
    setPageSize(Number(value))
    setPage(1)
  }

  const toggleMismatch = () => {
    setMismatchOnly((prev) => !prev)
    setPage(1)
  }

  if (reconciliationQuery.isLoading) {
    return (
      <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="h-5 w-40" />
        <div className="mt-5 grid gap-3 min-[360px]:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
        <div className="mt-5 grid gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  if (reconciliationQuery.isError || !report) {
    return (
      <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-semibold text-foreground">Reconciliation report</h2>
        <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
          Reconciliation unavailable. Report is generated when a sale ends or can be fetched on demand.
        </div>
      </section>
    )
  }

  return (
    <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Reconciliation report</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Redis vs PostgreSQL stock comparison.
            {report.reconciled_at && ` Generated ${formatTime(report.reconciled_at)}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={mismatchOnly ? "default" : "outline"}
            size="sm"
            className={cn(
              "gap-1.5 rounded-lg text-xs",
              mismatchOnly && "bg-[#DC143C]/10 text-[#DC143C] hover:bg-[#DC143C]/15 border-[#DC143C]/30",
            )}
            onClick={toggleMismatch}
          >
            <Filter className="size-3.5" />
            Mismatch only
            {report.summary.mismatched_items > 0 && (
              <Badge variant="outline" className="ml-1 rounded-full px-1.5 py-0 text-[10px] font-semibold">
                {report.summary.mismatched_items}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 min-[360px]:grid-cols-2 sm:grid-cols-4">
        <SummaryTile label="Total items" value={String(report.summary.total_items)} />
        <SummaryTile
          label="Mismatched"
          value={String(report.summary.mismatched_items)}
          warn={report.summary.has_mismatch}
        />
        <SummaryTile label="Initial stock" value={report.summary.total_initial_stock.toLocaleString()} />
        <SummaryTile label="PG sold" value={report.summary.total_postgresql_sold.toLocaleString()} />
      </div>

      {items.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          {mismatchOnly ? (
            <CheckCircle2 className="mx-auto size-6 text-[#39FF14]" />
          ) : (
            <ShieldCheck className="mx-auto size-6 text-muted-foreground" />
          )}
          <p className="mt-3 text-sm font-medium text-foreground">
            {mismatchOnly ? "No mismatches detected" : "No reconciliation data"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {mismatchOnly
              ? "All items match between Redis and PostgreSQL."
              : "Reconciliation data will appear after the sale ends."}
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full min-w-[840px] text-sm">
              <thead className="bg-muted/40">
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                  <th className="px-3 py-3">Product</th>
                  <th className="px-3 py-3 text-right">
                    <SortHeader
                      label="Initial"
                      active={sort === "initial_stock"}
                      direction={order}
                      onClick={() => toggleSort("initial_stock")}
                      align="right"
                    />
                  </th>
                  <th className="px-3 py-3 text-right">
                    <SortHeader
                      label="Redis left"
                      active={sort === "redis_remaining"}
                      direction={order}
                      onClick={() => toggleSort("redis_remaining")}
                      align="right"
                    />
                  </th>
                  <th className="px-3 py-3 text-right">PG reserved</th>
                  <th className="px-3 py-3 text-right">
                    <SortHeader
                      label="PG sold"
                      active={sort === "postgresql_sold"}
                      direction={order}
                      onClick={() => toggleSort("postgresql_sold")}
                      align="right"
                    />
                  </th>
                  <th className="px-3 py-3 text-right">
                    <SortHeader
                      label="Expected"
                      active={sort === "expected_remaining"}
                      direction={order}
                      onClick={() => toggleSort("expected_remaining")}
                      align="right"
                    />
                  </th>
                  <th className="px-3 py-3 text-right">
                    <SortHeader
                      label="Diff"
                      active={sort === "difference"}
                      direction={order}
                      onClick={() => toggleSort("difference")}
                      align="right"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.item_id} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-3">
                      <p className="font-medium text-foreground">{item.product_name}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{item.product_sku}</p>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{item.initial_stock}</td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      <RedisCell value={item.redis_remaining} available={item.redis_keys_available} />
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-amber-600 dark:text-amber-400">
                      {item.postgresql_reserved}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-[#1a8a0a] dark:text-[#39FF14]">
                      {item.postgresql_sold}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{item.expected_remaining}</td>
                    <td className="px-3 py-3 text-right">
                      <DifferenceBadge item={item} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-2 md:hidden">
            {items.map((item) => (
              <MobileReconciliationCard key={item.item_id} item={item} />
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {visibleStart}-{visibleEnd} of {total}
              {reconciliationQuery.isFetching ? " - refreshing" : ""}
            </span>
            <div className="flex items-center gap-3">
              <Select value={String(pageSize)} onValueChange={updatePageSize}>
                <SelectTrigger className="h-8 w-[70px] rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="rounded-lg"
                  onClick={() => setPage((v) => Math.max(1, v - 1))}
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
                  onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className="size-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function SummaryTile({
  label,
  value,
  warn = false,
}: {
  label: string
  value: string
  warn?: boolean
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 flex min-w-0 items-center gap-2">
        {warn ? (
          <AlertTriangle className="size-4 shrink-0 text-[#DC143C]" />
        ) : (
          <CheckCircle2 className="size-4 shrink-0 text-muted-foreground/60" />
        )}
        <p className="min-w-0 break-words text-sm font-semibold tabular-nums text-foreground">{value}</p>
      </div>
    </div>
  )
}

function RedisCell({ value, available }: { value: number | null; available: boolean }) {
  if (!available) {
    return (
      <span className="inline-flex items-center gap-1 text-[#DC143C]">
        <CircleAlert className="size-3.5" />
        Missing
      </span>
    )
  }
  return <span className="tabular-nums">{value ?? "—"}</span>
}

function DifferenceBadge({ item }: { item: { difference: number | null; redis_keys_available: boolean } }) {
  if (!item.redis_keys_available) {
    return (
      <Badge variant="outline" className="rounded-full border-[#DC143C]/25 bg-[#DC143C]/10 text-[#DC143C] text-[10px] font-semibold">
        Keys missing
      </Badge>
    )
  }
  if (item.difference === null) {
    return (
      <Badge variant="outline" className="rounded-full border-muted-foreground/20 bg-muted/50 text-muted-foreground text-[10px]">
        N/A
      </Badge>
    )
  }
  if (item.difference === 0) {
    return (
      <Badge variant="outline" className="rounded-full border-[#39FF14]/25 bg-[#39FF14]/10 text-[#1a8a0a] dark:text-[#39FF14] text-[10px] font-semibold">
        Match
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="rounded-full border-[#DC143C]/25 bg-[#DC143C]/10 text-[#DC143C] text-[10px] font-semibold tabular-nums">
      {item.difference > 0 ? "+" : ""}{item.difference}
    </Badge>
  )
}

function MobileReconciliationCard({
  item,
}: {
  item: ReconciliationReport["items"][number]
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-3">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-sm font-medium leading-5 text-foreground">
            {item.product_name}
          </p>
          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
            {item.product_sku}
          </p>
        </div>
        <DifferenceBadge item={item} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <MobileStat label="Initial" value={String(item.initial_stock)} />
        <MobileStat
          label="Redis left"
          value={item.redis_keys_available ? (item.redis_remaining?.toString() ?? "—") : "Missing"}
          warn={!item.redis_keys_available}
        />
        <MobileStat label="PG reserved" value={String(item.postgresql_reserved)} tone="warn" />
        <MobileStat label="PG sold" value={String(item.postgresql_sold)} tone="success" />
        <MobileStat label="Expected" value={String(item.expected_remaining)} />
      </div>
    </div>
  )
}

function MobileStat({
  label,
  value,
  tone = "neutral",
  warn = false,
}: {
  label: string
  value: string
  tone?: "neutral" | "warn" | "success"
  warn?: boolean
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 break-words text-sm tabular-nums text-foreground",
          warn && "font-medium text-[#DC143C]",
          tone === "warn" && "text-amber-600 dark:text-amber-400",
          tone === "success" && "text-[#1a8a0a] dark:text-[#39FF14]",
        )}
      >
        {value}
      </p>
    </div>
  )
}

function formatTime(dateStr: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr))
}
