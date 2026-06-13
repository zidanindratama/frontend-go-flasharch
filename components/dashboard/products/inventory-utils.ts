import type { MovementType } from "@/lib/api/inventory"

export function formatMovementType(type: MovementType): string {
  switch (type) {
    case "adjustment_in":
      return "Adjustment In"
    case "adjustment_out":
      return "Adjustment Out"
    case "reservation":
      return "Reserved"
    case "sale":
      return "Sold"
    case "release":
      return "Released"
  }
}

export function movementTypeColor(type: MovementType): string {
  switch (type) {
    case "adjustment_in":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    case "adjustment_out":
      return "bg-red-500/10 text-red-600 dark:text-red-400"
    case "reservation":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    case "sale":
      return "bg-teal-500/10 text-teal-600 dark:text-teal-400"
    case "release":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  }
}

export function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta.toLocaleString("id-ID")}`
  return delta.toLocaleString("id-ID")
}

export function deltaColor(delta: number): string {
  if (delta > 0) return "text-emerald-600 dark:text-emerald-400"
  if (delta < 0) return "text-red-600 dark:text-red-400"
  return "text-muted-foreground"
}
