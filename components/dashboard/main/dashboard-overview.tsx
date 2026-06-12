"use client"

import Link from "next/link"
import type { ComponentType, ReactNode } from "react"
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  ArrowUpRight,
  Clock3,
  Flame,
  ReceiptText,
  RefreshCw,
  ShoppingCart,
  Users,
} from "lucide-react"
import { Area, AreaChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { OrdersTable } from "@/components/dashboard/main/orders-table"
import { ProductsTable } from "@/components/dashboard/main/products-table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useGetData } from "@/hooks/use-get-data"
import { endpoints } from "@/lib/api/endpoints"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"

const ease = [0.16, 1, 0.3, 1] as const
const MAX_TABLE_ROWS = 5

type DashboardResponse = {
  message: string
  data: AdminDashboard
}

type AdminDashboard = {
  period: {
    from: string
    to: string
    granularity: "day" | "week" | "month"
  }
  summary: {
    total_orders: number
    paid_orders: number
    pending_orders: number
    cancelled_orders: number
    expired_checkouts: number
    gross_revenue_amount: number
    average_order_amount: number
    signup_count: number
    active_buyer_count: number
    active_flash_sale_count: number
  }
  charts: {
    revenue: { label: string; value: number }[]
    orders: { label: string; paid: number; pending: number; cancelled: number }[]
    order_sources: { source: string; count: number }[]
    payment_status: { status: string; count: number }[]
  }
  top_products: {
    product_id: string
    sku: string
    name: string
    sold_quantity: number
    gross_revenue_amount: number
  }[]
  recent_orders: {
    id: string
    order_code: string
    status: string
    total_amount: number
    currency: string
    buyer: { id: string; email: string; full_name: string }
    created_at: string
    updated_at: string
  }[]
  active_flash_sales: {
    id: string
    slug: string
    name: string
    status: string
    starts_at: string
    ends_at: string
  }[]
  generated_at: string
}

const revenueConfig = {
  value: {
    label: "Revenue",
    color: "oklch(0.58 0.12 42)",
  },
} satisfies ChartConfig

const orderConfig = {
  paid: {
    label: "Paid",
    color: "oklch(0.52 0.12 148)",
  },
  pending: {
    label: "Pending",
    color: "oklch(0.64 0.12 78)",
  },
  cancelled: {
    label: "Cancelled",
    color: "oklch(0.56 0.13 28)",
  },
} satisfies ChartConfig

const paymentStatusOrder = [
  "paid",
  "pending",
  "requires_action",
  "failed",
  "expired",
  "refunded",
  "cancelled",
]

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    notation: Math.abs(amount) >= 1_000_000 ? "compact" : "standard",
  }).format(amount)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: Math.abs(value) >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value)
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ")
}

function statusTone(status: string) {
  if (["paid", "confirmed", "completed", "refunded"].includes(status)) return "success"
  if (["pending", "pending_payment", "requires_action", "waiting_payment"].includes(status)) return "warning"
  if (["cancelled", "failed", "expired"].includes(status)) return "danger"
  return "neutral"
}

function hasChartData<T extends Record<string, unknown>>(
  data: T[],
  keys: (keyof T)[],
) {
  return data.some((item) =>
    keys.some((key) => {
      const value = item[key]
      return typeof value === "number" && value > 0
    }),
  )
}

export function DashboardOverview() {
  const token = useAuthStore((s) => s.access_token)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const params = useMemo(() => {
    const next: Record<string, string> = { granularity: "day" }
    if (dateRange.from) next.from = dateRange.from.toISOString()
    if (dateRange.to) next.to = dateRange.to.toISOString()
    return next
  }, [dateRange.from, dateRange.to])

  const {
    data: dashboardRes,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetData<DashboardResponse>({
    queryKey: ["admin-dashboard", params.from, params.to, params.granularity],
    endpoint: endpoints.admin.dashboard,
    params,
    enabled: !!token,
    errorMessage: "Failed to load admin dashboard",
  })

  const dashboard = dashboardRes?.data
  const summary = dashboard?.summary

  const paymentStatuses = useMemo(() => {
    if (!dashboard) return []

    const byStatus = new Map(
      dashboard.charts.payment_status.map((item) => [item.status, item.count]),
    )
    const unknownStatuses = dashboard.charts.payment_status
      .map((item) => item.status)
      .filter((status) => !paymentStatusOrder.includes(status))

    return [...paymentStatusOrder, ...unknownStatuses].map((status) => ({
      status,
      count: byStatus.get(status) ?? 0,
    }))
  }, [dashboard])

  if (isLoading) return <DashboardSkeleton />

  if (isError || !dashboard || !summary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease }}
        className="flex min-h-[58vh] items-center justify-center px-2"
      >
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Activity className="size-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Dashboard unavailable
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The admin report did not return usable data. Check your session and
            backend health, then refresh.
          </p>
          <Button className="mt-5" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      </motion.div>
    )
  }

  const recentOrders = dashboard.recent_orders.slice(0, MAX_TABLE_ROWS)
  const topProducts = dashboard.top_products.slice(0, MAX_TABLE_ROWS)
  const activeFlashSales = dashboard.active_flash_sales.slice(0, 3)
  const paidRatio = summary.total_orders
    ? Math.round((summary.paid_orders / summary.total_orders) * 100)
    : 0
  const revenueHasData = hasChartData(dashboard.charts.revenue, ["value"])
  const ordersHasData = hasChartData(dashboard.charts.orders, [
    "paid",
    "pending",
    "cancelled",
  ])

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <DashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      <MetricStrip>
        <MetricTile
          icon={ReceiptText}
          label="Gross revenue"
          value={formatIDR(summary.gross_revenue_amount)}
          detail={`${dateLabel(dashboard.period.from)} to ${dateLabel(dashboard.period.to)}`}
          tone="revenue"
          featured
        />
        <MetricTile
          icon={ShoppingCart}
          label="Paid orders"
          value={formatNumber(summary.paid_orders)}
          detail={`${formatNumber(summary.pending_orders)} waiting`}
          tone="success"
        />
        <MetricTile
          icon={Users}
          label="Active buyers"
          value={formatNumber(summary.active_buyer_count)}
          detail={`${formatNumber(summary.signup_count)} signups`}
          tone="neutral"
        />
        <MetricTile
          icon={Clock3}
          label="Expired"
          value={formatNumber(summary.expired_checkouts)}
          detail="Missed payment"
          tone="warning"
        />
        <MetricTile
          icon={Flame}
          label="Flash sales"
          value={formatNumber(summary.active_flash_sale_count)}
          detail={`${paidRatio}% paid rate`}
          tone="orange"
        />
      </MetricStrip>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <ChartPanel
          eyebrow="Revenue"
          title="Gross revenue trend"
          action={dashboard.period.granularity}
        >
          {revenueHasData ? (
            <ChartContainer
              config={revenueConfig}
              className="h-[190px] w-full sm:h-[220px] lg:h-[240px]"
            >
              <AreaChart
                data={dashboard.charts.revenue}
                margin={{ left: 0, right: 10, top: 8, bottom: 0 }}
              >
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={28}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={{ stroke: "oklch(0.82 0.01 82)", strokeWidth: 1 }}
                  content={<ChartTooltipContent />}
                />
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="value"
                  type="monotone"
                  stroke="var(--color-value)"
                  fill="url(#revenueFill)"
                  strokeWidth={2.25}
                  dot={{ r: 2.5, strokeWidth: 2, fill: "hsl(var(--card))" }}
                  activeDot={{ r: 4.5, strokeWidth: 2 }}
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <ChartEmpty
              icon={ReceiptText}
              title="No paid revenue yet"
              copy="Revenue trend appears after paid orders are recorded."
            />
          )}
        </ChartPanel>

        <ChartPanel eyebrow="Order rhythm" title="Checkout movement">
          {ordersHasData ? (
            <ChartContainer
              config={orderConfig}
              className="h-[190px] w-full sm:h-[220px] lg:h-[240px]"
            >
              <LineChart
                data={dashboard.charts.orders}
                margin={{ left: 0, right: 10, top: 8, bottom: 0 }}
              >
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={28}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={{ stroke: "oklch(0.82 0.01 82)", strokeWidth: 1 }}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="paid"
                  type="monotone"
                  stroke="var(--color-paid)"
                  strokeWidth={2.25}
                  dot={{ r: 2.5, strokeWidth: 2, fill: "hsl(var(--card))" }}
                />
                <Line
                  dataKey="pending"
                  type="monotone"
                  stroke="var(--color-pending)"
                  strokeWidth={2.25}
                  dot={{ r: 2.5, strokeWidth: 2, fill: "hsl(var(--card))" }}
                />
                <Line
                  dataKey="cancelled"
                  type="monotone"
                  stroke="var(--color-cancelled)"
                  strokeWidth={2.25}
                  dot={{ r: 2.5, strokeWidth: 2, fill: "hsl(var(--card))" }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <ChartEmpty
              icon={ShoppingCart}
              title="No checkout movement"
              copy="Paid, pending, and cancelled orders will show here."
            />
          )}
        </ChartPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <CompactPanel eyebrow="Source mix" title="Checkout entry points">
          <SourceSplit items={dashboard.charts.order_sources} />
        </CompactPanel>

        <CompactPanel
          eyebrow="Payment status"
          title="All payment states"
          action={<PanelLink href="/dashboard/orders" />}
        >
          <StatusSummary statuses={paymentStatuses} />
        </CompactPanel>
      </section>

      <section className="grid items-stretch gap-4 xl:grid-cols-2">
        <CompactPanel title="Recent orders" action={<PanelLink href="/dashboard/orders" />}>
          <OrdersTable orders={recentOrders} />
        </CompactPanel>
        <CompactPanel title="Top products" action={<PanelLink href="/dashboard/products" />}>
          <ProductsTable products={topProducts} />
        </CompactPanel>
      </section>

      <CompactPanel
        eyebrow="Campaigns"
        title="Active flash sales"
        action={<PanelLink href="/dashboard/flash-sales" />}
      >
        {activeFlashSales.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {activeFlashSales.map((sale) => (
              <motion.div
                key={sale.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease }}
                className="rounded-xl border border-border bg-background p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {sale.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ends {dateLabel(sale.ends_at)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Running
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyPanel
            icon={Flame}
            title="No running flash sale"
            copy="Launch a campaign when stock is preloaded and ready."
          />
        )}
      </CompactPanel>
    </div>
  )
}

function DashboardHeader({
  dateRange,
  onDateRangeChange,
  isFetching,
  onRefresh,
}: {
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  isFetching: boolean
  onRefresh: () => void
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease }}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Revenue, checkout, buyer, and active flash sale signals.
        </p>
      </div>

      <div className="grid gap-2 sm:flex sm:items-center">
        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          className="w-full justify-between sm:w-[230px]"
        />
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRefresh}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-foreground/20 hover:bg-muted"
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          Refresh
        </motion.button>
      </div>
    </motion.section>
  )
}

function MetricStrip({ children }: { children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.22, ease }}
      className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-5"
    >
      {children}
    </motion.section>
  )
}

function MetricTile({
  icon: Icon,
  label,
  value,
  detail,
  tone,
  featured,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  detail: string
  tone: "success" | "warning" | "orange" | "neutral" | "revenue"
  featured?: boolean
}) {
  const toneClass = {
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    neutral: "bg-muted text-muted-foreground",
    revenue: "bg-foreground text-background",
  }[tone]

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.18, ease }}
      className={cn(
        "min-w-0 rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4",
        featured && "col-span-2 lg:col-span-1",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase text-muted-foreground">
            {label}
          </p>
          <p className="mt-1.5 truncate text-xl font-semibold tracking-tight text-foreground tabular-nums sm:text-2xl">
            {value}
          </p>
        </div>
        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9", toneClass)}>
          <Icon className="size-4" />
        </div>
      </div>
      <p className="mt-2 truncate text-[11px] leading-5 text-muted-foreground sm:text-xs">
        {detail}
      </p>
    </motion.div>
  )
}

function ChartPanel({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{ duration: 0.22, ease }}
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
    >
      <PanelHeading eyebrow={eyebrow} title={title} action={action} />
      {children}
    </motion.div>
  )
}

function CompactPanel({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.22, ease }}
      className="flex min-h-[260px] flex-col rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
    >
      <PanelHeading eyebrow={eyebrow} title={title} action={action} />
      <div className="flex-1">{children}</div>
    </motion.div>
  )
}

function PanelHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="truncate text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

function PanelLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      View
      <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  )
}

function SourceSplit({ items }: { items: { source: string; count: number }[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0)

  if (items.length === 0) {
    return (
      <EmptyPanel
        icon={Activity}
        title="No source data"
        copy="Checkout source appears after orders are created."
      />
    )
  }

  return (
    <div className="grid gap-2.5">
      {items.map((item, index) => {
        const percentage = total ? Math.round((item.count / total) * 100) : 0
        return (
          <motion.div
            key={item.source}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.18, ease }}
            className="rounded-xl border border-border bg-background p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium capitalize text-foreground">
                  {statusLabel(item.source)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(item.count)} orders
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-foreground">
                {percentage}%
              </p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${percentage}%` }}
                viewport={{ once: false }}
                transition={{ duration: 0.35, delay: index * 0.04, ease }}
                className="h-full rounded-full bg-foreground/65"
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function StatusSummary({
  statuses,
}: {
  statuses: { status: string; count: number }[]
}) {
  return (
    <div className="grid gap-2.5 min-[560px]:grid-cols-4">
      {statuses.map((status) => (
        <StatusBlock
          key={status.status}
          label={status.status}
          value={status.count}
          tone={statusTone(status.status)}
        />
      ))}
    </div>
  )
}

function StatusBlock({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "success" | "warning" | "danger" | "neutral"
}) {
  const toneClass = {
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
    neutral: "bg-muted text-muted-foreground",
  }[tone]

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease }}
      className="rounded-xl border border-border bg-background p-3"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={cn("truncate rounded-full px-2 py-1 text-[11px] font-medium capitalize", toneClass)}>
          {statusLabel(label)}
        </span>
        <span className="text-lg font-semibold tabular-nums text-foreground">
          {formatNumber(value)}
        </span>
      </div>
    </motion.div>
  )
}

function ChartEmpty({
  icon: Icon,
  title,
  copy,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  copy: string
}) {
  return (
    <div className="flex min-h-[150px] items-center gap-3 rounded-xl border border-dashed border-border bg-background p-4 sm:min-h-[190px]">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 max-w-md text-sm leading-5 text-muted-foreground">
          {copy}
        </p>
      </div>
    </div>
  )
}

function EmptyPanel({
  icon: Icon,
  title,
  copy,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  copy: string
}) {
  return (
    <div className="flex min-h-28 items-center gap-3 rounded-xl border border-dashed border-border bg-background p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{copy}</p>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-32 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn("h-28 rounded-2xl", index === 0 && "col-span-2 lg:col-span-1")}
          />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-[280px] rounded-2xl" />
        <Skeleton className="h-[280px] rounded-2xl" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-[260px] rounded-2xl" />
        <Skeleton className="h-[260px] rounded-2xl" />
      </div>
    </div>
  )
}
