"use client"

import { ArrowDownAZ, ArrowUpAZ, Flame, Star } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type SortOption = {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}

export const sortOptions: SortOption[] = [
  { label: "Newest", value: "newest-desc", icon: Star },
  { label: "Price: Low to High", value: "price-asc", icon: ArrowUpAZ },
  { label: "Price: High to Low", value: "price-desc", icon: ArrowDownAZ },
  { label: "Popularity", value: "popularity-desc", icon: Flame },
  { label: "Name: A to Z", value: "name-asc", icon: ArrowUpAZ },
  { label: "Name: Z to A", value: "name-desc", icon: ArrowDownAZ },
]

export function parseSortOption(value: string): { sort: string; order: "asc" | "desc" } {
  const [sort, order] = value.split("-")
  return {
    sort: sort ?? "newest",
    order: order === "asc" ? "asc" : "desc",
  }
}

export function buildSortOption(sort: string, order: "asc" | "desc"): string {
  if (sort === "base_price_amount") return `price-${order}`
  return `${sort}-${order}`
}

interface SortSelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SortSelect({ value, onChange, className }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-12 gap-2 rounded-full border-border bg-background px-4 text-sm font-medium transition-all hover:border-[#FF6600]/30 focus:ring-[#FF6600]/20",
          className,
        )}
      >
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border">
        {sortOptions.map((option) => {
          const OptionIcon = option.icon
          return (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-lg text-sm focus:bg-[#FF6600]/5 focus:text-[#FF6600]"
            >
              <span className="flex items-center gap-2">
                <OptionIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {option.label}
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
