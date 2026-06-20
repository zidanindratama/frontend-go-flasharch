import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  paid: {
    label: "Paid",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
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

type PaymentStatusBadgeProps = {
  status: string
  className?: string
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
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
