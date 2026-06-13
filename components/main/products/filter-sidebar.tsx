"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, RotateCcw, SlidersHorizontal, Tag, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { FormattedPriceInput } from "@/components/common/formatted-price-input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/components/dashboard/products/product-utils"
import type { Category } from "@/lib/api/catalog"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const PRICE_MIN = 0
export const PRICE_MAX = 100_000_000
export const SLIDER_MAX = 10_000_000

interface FilterSidebarProps {
  categories: Category[]
  selectedCategory: string | null
  priceRange: [number, number]
  onCategoryChange: (slug: string | null) => void
  onPriceRangeChange: (range: [number, number]) => void
  onClearFilters: () => void
  activeFilterCount: number
  className?: string
  isLoading?: boolean
}

export function FilterSidebar({
  categories,
  selectedCategory,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters,
  activeFilterCount,
  className,
  isLoading,
}: FilterSidebarProps) {
  const [categorySearch, setCategorySearch] = useState("")

  const displayRange = useMemo(
    () => [Math.max(PRICE_MIN, priceRange[0]), Math.min(PRICE_MAX, priceRange[1])] as [number, number],
    [priceRange],
  )

  const sliderRange = useMemo(
    () => [Math.min(displayRange[0], SLIDER_MAX), Math.min(displayRange[1], SLIDER_MAX)] as [number, number],
    [displayRange],
  )

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories
    const term = categorySearch.toLowerCase().trim()
    return categories.filter((c) => c.name.toLowerCase().includes(term))
  }, [categories, categorySearch])

  function handleCategoryChange(slug: string | null) {
    onCategoryChange(slug)
    setCategorySearch("")
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: smoothEase, delay: 0.1 }}
      className={cn(
        "h-fit rounded-2xl border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#FF6600]" />
          <h2 className="text-base font-semibold tracking-tight">Filters</h2>
        </div>
        {activeFilterCount > 0 && (
          <Badge
            variant="secondary"
            className="rounded-full bg-[#FF6600]/10 text-[#FF6600] text-xs"
          >
            {activeFilterCount} active
          </Badge>
        )}
      </div>

      {activeFilterCount > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="mb-5 h-8 w-full justify-center gap-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear all filters
        </Button>
      )}

      <Separator className="my-4" />

      {/* Categories */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Category
          </h3>
        </div>

        {/* Category search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="h-9 rounded-lg border-border bg-muted/50 pl-8 pr-7 text-xs focus-visible:ring-[#FF6600]/20"
          />
          {categorySearch && (
            <button
              type="button"
              onClick={() => setCategorySearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-xs text-muted-foreground">No categories found.</p>
        ) : (
          <div className="space-y-1 max-h-[16rem] overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => handleCategoryChange(null)}
              className={cn(
                "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                selectedCategory === null
                  ? "bg-[#FF6600]/10 text-[#FF6600]"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <span>All categories</span>
              <AnimatePresence>
                {selectedCategory === null && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {filteredCategories.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No matching categories.
              </p>
            ) : (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.slug)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                    selectedCategory === category.slug
                      ? "bg-[#FF6600]/10 text-[#FF6600]"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="truncate">{category.name}</span>
                  <AnimatePresence>
                    {selectedCategory === category.slug && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Price Range
          </h3>
          <span className="text-xs font-semibold tabular-nums text-foreground">
            {formatPrice(displayRange[0])} - {formatPrice(displayRange[1])}
          </span>
        </div>

        {/* Min / Max inputs */}
        <div className="space-y-2">
          <FormattedPriceInput
            placeholder="Min price"
            value={priceRange[0]}
            onChange={(val) => {
              const min = Math.max(0, val)
              onPriceRangeChange([min, Math.max(min, priceRange[1])])
            }}
          />
          <FormattedPriceInput
            placeholder="Max price"
            value={priceRange[1]}
            onChange={(val) => {
              const max = Math.max(0, val)
              onPriceRangeChange([Math.min(priceRange[0], max), max])
            }}
          />
        </div>

        <Slider
          value={sliderRange}
          min={PRICE_MIN}
          max={SLIDER_MAX}
          step={50_000}
          onValueChange={(value) => {
            if (Array.isArray(value) && value.length === 2) {
              onPriceRangeChange([value[0], value[1]])
            }
          }}
          className="py-1"
        />

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{formatPrice(PRICE_MIN)}</span>
          <span>{formatPrice(SLIDER_MAX)}+</span>
        </div>
      </div>
    </motion.aside>
  )
}
