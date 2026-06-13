import type { Product } from "@/lib/api/catalog"

export function formatPrice(amount: number, currency = "IDR") {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatStock(product: Product) {
  const total = product.images?.length ?? 0
  return `${total} image${total === 1 ? "" : "s"}`
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

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
