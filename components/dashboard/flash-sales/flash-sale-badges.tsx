import { Badge } from "@/components/ui/badge"
import type { FlashSaleStatus } from "@/lib/api/flash-sale"
import { cn } from "@/lib/utils"

const statusStyles: Record<FlashSaleStatus, string> = {
  draft: "border border-white/15 bg-white/10 text-white/80",
  scheduled: "border border-blue-400/30 bg-blue-500/15 text-blue-300",
  running: "border border-[#39FF14]/30 bg-[#39FF14]/15 text-[#39FF14]",
  ended: "border border-white/10 bg-white/5 text-white/50",
  cancelled: "border border-[#DC143C]/30 bg-[#DC143C]/15 text-[#DC143C]",
}

const statusLabels: Record<FlashSaleStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  running: "Running",
  ended: "Ended",
  cancelled: "Cancelled",
}

export function FlashSaleStatusBadge({ status, className }: { status: FlashSaleStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn(statusStyles[status], className)}>
      {statusLabels[status]}
    </Badge>
  )
}
