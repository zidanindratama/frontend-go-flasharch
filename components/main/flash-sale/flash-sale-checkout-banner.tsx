"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Loader2 } from "lucide-react"
import { useFlashSaleCheckoutFlow } from "@/lib/hooks/use-checkout"

function formatTimeLeft(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function FlashSaleCheckoutBanner() {
  const { phase, checkout } = useFlashSaleCheckoutFlow()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!checkout?.expires_at) {
      setTimeLeft(null)
      return
    }

    function calculateTimeLeft() {
      const expiresAt = new Date(checkout!.expires_at).getTime()
      const now = Date.now()
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000))
      return diff
    }

    setTimeLeft(calculateTimeLeft())

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [checkout?.expires_at])

  const isVisible = phase === "polling" || phase === "payment" || phase === "redirecting"

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#FF6600] text-white shadow-lg"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              {phase === "redirecting" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {phase === "polling" && "Reserving your item..."}
                {phase === "payment" && "Preparing payment..."}
                {phase === "redirecting" && "Redirecting to payment..."}
              </span>
            </div>

            {phase === "polling" && timeLeft !== null && timeLeft > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/70">Expires in</span>
                <span className="font-mono text-lg font-bold tabular-nums">
                  {formatTimeLeft(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
