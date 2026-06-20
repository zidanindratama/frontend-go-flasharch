import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; className: string }> = {
  pending_payment: {
    label: "Pending payment",
    className:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  waiting_payment: {
    label: "Waiting payment",
    className:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  paid: {
    label: "Paid",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  shipped: {
    label: "Shipped",
    className:
      "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  fulfilled: {
    label: "Delivered",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
  failed: {
    label: "Failed",
    className:
      "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
  expired: {
    label: "Expired",
    className: "bg-muted text-muted-foreground",
  },
}

const fallback = {
  label: "Unknown",
  className: "bg-muted text-muted-foreground",
}

type OrderStatusBadgeProps = {
  status: string
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    ...fallback,
    label: status.replaceAll("_", " "),
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
