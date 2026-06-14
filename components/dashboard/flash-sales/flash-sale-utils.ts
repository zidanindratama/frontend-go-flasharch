import type { FlashSaleStatus } from "@/lib/api/flash-sale"

export function formatDateTime(dateStr: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr))
}

export function formatDateShort(dateStr: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr))
}

export function shortId(id: string) {
  return id.slice(0, 8)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function isEditable(status: FlashSaleStatus) {
  return status === "draft" || status === "scheduled"
}

export function canPreload(status: FlashSaleStatus) {
  return status === "scheduled"
}

export function canRelease(status: FlashSaleStatus) {
  return status === "running"
}

export function canEnd(status: FlashSaleStatus) {
  return status === "running"
}

export function canCancel(status: FlashSaleStatus) {
  return status === "draft" || status === "scheduled" || status === "running"
}

export function canRevertDraft(status: FlashSaleStatus) {
  return status === "scheduled"
}

export function canSchedule(status: FlashSaleStatus) {
  return status === "draft"
}

export function canRun(status: FlashSaleStatus) {
  return status === "scheduled"
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function toRFC3339(datetimeLocal: string): string {
  if (!datetimeLocal) return ""
  const d = new Date(datetimeLocal)
  return d.toISOString()
}

export function toDatetimeLocal(rfc3339: string): string {
  if (!rfc3339) return ""
  const d = new Date(rfc3339)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}
