"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Package, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/components/dashboard/products/product-utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { SavedItem } from "@/lib/api/cart"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function SavedCartItem({
  item,
  onMoveToCart,
  onDelete,
  isMoving,
  isDeleting,
}: {
  item: SavedItem
  onMoveToCart: (savedItemId: string) => void
  onDelete: (savedItemId: string) => void
  isMoving: boolean
  isDeleting: boolean
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = useCallback(() => {
    if (confirmDelete) {
      onDelete(item.id)
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }, [confirmDelete, onDelete, item.id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, transition: { duration: 0.3, ease: smoothEase } }}
      transition={{ duration: 0.35, ease: smoothEase }}
      className="group"
    >
      <div className="flex gap-4 rounded-xl bg-card/60 p-4 ring-1 ring-foreground/5 transition-shadow duration-300 hover:shadow-md hover:shadow-foreground/5 hover:ring-foreground/10">
        <Link
          href={`/products/${item.product.slug}`}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted"
        >
          {item.product.thumbnail_url ? (
            <img
              src={item.product.thumbnail_url}
              alt={item.product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-6 w-6 text-muted-foreground/30" />
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="min-w-0">
            <Link
              href={`/products/${item.product.slug}`}
              className="line-clamp-1 text-sm font-medium text-foreground transition-colors hover:text-[#FF6600]"
            >
              {item.product.name}
            </Link>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {item.product.sku}
            </p>
          </div>
          <span className="mt-1 text-sm font-bold tabular-nums text-foreground">
            {formatPrice(item.unit_price_amount)}
          </span>
        </div>

        <div className="flex shrink-0 items-start gap-0.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onMoveToCart(item.id)}
                  disabled={isMoving}
                  className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-[#FF6600] transition-colors hover:bg-[#FF6600]/10"
                >
                  {isMoving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">Move to cart</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>Move back to active cart</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                    confirmDelete
                      ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                      : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                  )}
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>{confirmDelete ? "Click again to confirm" : "Remove saved item"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  )
}
