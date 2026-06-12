import type { AdminUser } from "@/lib/api/admin-users"

export function userInitials(user?: Pick<AdminUser, "full_name" | "email"> | null) {
  const source = user?.full_name || user?.email || "User"
  return source
    .split(/[.\s@_-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function formatDateTime(value?: string | null) {
  if (!value) return "Never"
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function shortId(value: string) {
  return `${value.slice(0, 8)}...${value.slice(-6)}`
}

