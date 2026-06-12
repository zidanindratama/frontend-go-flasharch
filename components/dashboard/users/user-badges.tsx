import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "admin"

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-xs capitalize",
        isAdmin
          ? "border-[#333333]/20 bg-[#333333]/8 text-foreground dark:border-white/15 dark:bg-white/10"
          : "border-[#FF6600]/25 bg-[#FF6600]/10 text-[#FF6600]",
      )}
    >
      {role}
    </Badge>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "active"
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : status === "suspended"
        ? "border-destructive/25 bg-destructive/10 text-destructive"
        : "border-border bg-muted text-muted-foreground"

  return (
    <Badge variant="outline" className={cn("rounded-full px-2.5 py-1 text-xs capitalize", tone)}>
      {status}
    </Badge>
  )
}

export function VerificationBadge({ verified }: { verified: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-xs",
        verified
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      )}
    >
      {verified ? "Verified" : "Pending"}
    </Badge>
  )
}

