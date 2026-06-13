import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ProductStatusBadge({ status }: { status: string }) {
  const tone =
    status === "active"
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : status === "draft"
        ? "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : status === "archived"
          ? "border-border bg-muted text-muted-foreground"
          : "border-border bg-muted text-muted-foreground"

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5 py-1 text-xs capitalize", tone)}
    >
      {status}
    </Badge>
  )
}

export function CategoryStatusBadge({ status }: { status: string }) {
  const tone =
    status === "active"
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : "border-border bg-muted text-muted-foreground"

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5 py-1 text-xs capitalize", tone)}
    >
      {status}
    </Badge>
  )
}
