"use client"

import { useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useStockAlertProductIds } from "@/lib/hooks/use-stock-alerts"
import { useAuthStore } from "@/stores/auth"

interface StockAlertButtonProps {
  productSlug: string
  subscribedSlugs: Set<string>
  isPending: boolean
  onToggle: (slug: string) => void
  size?: "sm" | "md" | "lg"
  variant?: "ghost" | "overlay" | "command"
  className?: string
}

export function StockAlertButton({
  productSlug,
  subscribedSlugs,
  isPending,
  onToggle,
  size = "sm",
  variant = "ghost",
  className,
}: StockAlertButtonProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isSubscribed = subscribedSlugs.has(productSlug)

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!isAuthenticated) {
        const { toast } = await import("sonner")
        toast.error("Login required for flash sale alerts")
        return
      }

      onToggle(productSlug)
    },
    [isAuthenticated, onToggle, productSlug],
  )

  const sizeClasses = {
    sm: "size-8",
    md: "size-9",
    lg: "size-10",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-[18px] w-[18px]",
    lg: "h-5 w-5",
  }

  const variantClasses = {
    ghost: cn(
      "rounded-full hover:bg-muted",
      isSubscribed && "hover:bg-[#FF6600]/10",
    ),
    overlay: cn(
      "rounded-full bg-background/90 shadow-lg shadow-foreground/10 ring-1 ring-border backdrop-blur-sm hover:bg-background",
    ),
    command: cn(
      "rounded-xl border border-border bg-card hover:bg-muted",
      isSubscribed && "border-[#FF6600]/30 bg-[#FF6600]/5",
    ),
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isSubscribed ? "Remove flash sale alert" : "Subscribe to flash sale alert"}
      className={cn(sizeClasses[size], variantClasses[variant], className)}
    >
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Loader2 className={cn(iconSizes[size], "animate-spin")} />
          </motion.div>
        ) : (
          <motion.div
            key={isSubscribed ? "filled" : "outline"}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Bell
              className={cn(
                iconSizes[size],
                "transition-colors duration-200",
                isSubscribed
                  ? "fill-[#FF6600] text-[#FF6600]"
                  : "text-muted-foreground",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

interface StockAlertToggleProps {
  productSlug: string
  size?: "sm" | "md" | "lg"
  variant?: "ghost" | "overlay" | "command"
  className?: string
}

export function StockAlertToggle({
  productSlug,
  size = "sm",
  variant = "ghost",
  className,
}: StockAlertToggleProps) {
  const { subscribedSlugs, toggleStockAlert, isPending } = useStockAlertProductIds()

  return (
    <StockAlertButton
      productSlug={productSlug}
      subscribedSlugs={subscribedSlugs}
      isPending={isPending}
      onToggle={toggleStockAlert}
      size={size}
      variant={variant}
      className={className}
    />
  )
}
