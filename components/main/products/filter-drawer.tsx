"use client"

import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { FilterSidebar } from "@/components/main/products/filter-sidebar"
import type { Category } from "@/lib/api/catalog"

interface FilterDrawerProps {
  categories: Category[]
  selectedCategory: string | null
  priceRange: [number, number]
  onCategoryChange: (slug: string | null) => void
  onPriceRangeChange: (range: [number, number]) => void
  onClearFilters: () => void
  activeFilterCount: number
  isLoading?: boolean
}

export function FilterDrawer({
  categories,
  selectedCategory,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters,
  activeFilterCount,
  isLoading,
}: FilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="relative h-11 gap-2 rounded-full border-border bg-background px-4 text-sm font-medium transition-all hover:border-[#FF6600]/30 hover:bg-[#FF6600]/5"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-0.5 rounded-full bg-[#FF6600] px-1.5 py-0 text-[10px] text-white"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full max-w-sm overflow-y-auto border-r border-border bg-card p-0"
      >
        <SheetHeader className="sticky top-0 z-10 border-b border-border bg-card px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold">Filters</SheetTitle>
          </div>
        </SheetHeader>
        <div className="p-5">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            priceRange={priceRange}
            onCategoryChange={onCategoryChange}
            onPriceRangeChange={onPriceRangeChange}
            onClearFilters={onClearFilters}
            activeFilterCount={activeFilterCount}
            isLoading={isLoading}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
