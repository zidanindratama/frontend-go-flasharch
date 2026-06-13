"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/components/dashboard/products/product-utils"
import type { Category } from "@/lib/api/catalog"

interface FilterChipBarProps {
  search: string
  selectedCategory: string | null
  priceRange: [number, number]
  minPrice: number
  maxPrice: number
  categories: Category[]
  onClearSearch: () => void
  onClearCategory: () => void
  onClearPriceRange: () => void
  onClearAll: () => void
  className?: string
}

export function FilterChipBar({
  search,
  selectedCategory,
  priceRange,
  minPrice,
  maxPrice,
  categories,
  onClearSearch,
  onClearCategory,
  onClearPriceRange,
  onClearAll,
  className,
}: FilterChipBarProps) {
  const categoryName = categories.find((c) => c.slug === selectedCategory)?.name
  const hasPriceFilter = priceRange[0] > minPrice || priceRange[1] < maxPrice

  const chips: { key: string; label: string; onClear: () => void }[] = []

  if (search) {
    chips.push({ key: "search", label: `Search: "${search}"`, onClear: onClearSearch })
  }

  if (categoryName) {
    chips.push({ key: "category", label: categoryName, onClear: onClearCategory })
  }

  if (hasPriceFilter) {
    chips.push({
      key: "price",
      label: `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`,
      onClear: onClearPriceRange,
    })
  }

  if (chips.length === 0) return null

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        {chips.map((chip) => (
          <motion.div
            key={chip.key}
            layout
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="group flex items-center gap-1.5 rounded-full bg-[#FF6600]/10 px-3 py-1.5 text-xs font-medium text-[#FF6600] hover:bg-[#FF6600]/15"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.onClear}
                className="ml-1 rounded-full p-0.5 transition-colors hover:bg-[#FF6600]/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 rounded-full px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        Clear all
      </Button>
    </div>
  )
}
