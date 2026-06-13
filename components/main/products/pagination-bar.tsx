"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationBarProps {
  page: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function PaginationBar({
  page,
  perPage,
  total,
  onPageChange,
  className,
}: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  if (total <= perPage && totalPages <= 1) {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        <p className="text-sm text-muted-foreground">
          Showing {total} product{total === 1 ? "" : "s"}
        </p>
      </div>
    )
  }

  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    pages.push(1)

    if (page > 3) {
      pages.push("ellipsis")
    }

    const startPage = Math.max(2, page - 1)
    const endPage = Math.min(totalPages - 1, page + 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (page < totalPages - 2) {
      pages.push("ellipsis")
    }

    pages.push(totalPages)
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 sm:flex-row sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground tabular-nums">{start}</span>{" "}
        -{" "}
        <span className="font-medium text-foreground tabular-nums">{end}</span>{" "}
        of{" "}
        <span className="font-medium text-foreground tabular-nums">
          {total.toLocaleString("id-ID")}
        </span>{" "}
        products
      </p>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-9 w-9 rounded-full border border-border hover:bg-muted disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant={item === page ? "default" : "ghost"}
              size="icon"
              onClick={() => onPageChange(item)}
              className={cn(
                "h-9 w-9 rounded-full text-sm font-medium transition-all",
                item === page
                  ? "bg-[#FF6600] text-white hover:bg-[#e65c00]"
                  : "border border-border hover:bg-muted",
              )}
            >
              {item}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-9 w-9 rounded-full border border-border hover:bg-muted disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
