"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { Package, Wallet, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/account-mock"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function AnimatedCounter({
  value,
  duration = 1.2,
  delay = 0,
}: {
  value: number
  duration?: number
  delay?: number
}) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(count, value, { duration, ease })
      return () => controls.stop()
    }, delay * 1000)
    return () => clearTimeout(timeout)
  }, [value, duration, delay])

  return (
    <motion.span ref={ref} className="tabular-nums">
      {rounded}
    </motion.span>
  )
}

type StatCardVariant = "default" | "warning" | "success"

const iconStyles: Record<StatCardVariant, string> = {
  default: "bg-muted text-muted-foreground",
  warning: "bg-[#FF6B00]/8 text-[#FF6B00]",
  success: "bg-[#06D6A0]/8 text-[#06D6A0]",
}

const badgeStyles: Record<StatCardVariant, string> = {
  default: "",
  warning: "bg-[#FF6B00]/10 text-[#FF6B00]",
  success: "bg-[#06D6A0]/10 text-[#06D6A0]",
}

function StatCard({
  icon: Icon,
  label,
  value,
  displayValue,
  variant = "default",
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  displayValue?: string
  variant?: StatCardVariant
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.12 + delay * 0.06, duration: 0.5, ease }}
      className="flex flex-col gap-2 rounded-xl bg-card p-3.5 ring-1 ring-foreground/10 sm:p-4 lg:gap-2 lg:p-5"
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9",
            iconStyles[variant],
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        {variant !== "default" && (
          <span
            className={cn(
              "inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold",
              badgeStyles[variant],
            )}
          >
            {value} active
          </span>
        )}
      </div>
      <div>
        {displayValue ? (
          <p className="text-lg font-bold tracking-tight tabular-nums lg:text-xl">
            {displayValue}
          </p>
        ) : (
          <p className="text-lg font-bold tracking-tight tabular-nums lg:text-xl">
            <AnimatedCounter value={value} delay={delay} />
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {label}
        </p>
      </div>
    </motion.div>
  )
}

export function DashboardStats({
  totalOrders,
  totalSpent,
  pendingPayments,
  activeReservations,
}: {
  totalOrders: number
  totalSpent: number
  pendingPayments: number
  activeReservations: number
}) {
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
      <StatCard
        icon={Package}
        label="Total Orders"
        value={totalOrders}
        delay={0}
      />
      <StatCard
        icon={Wallet}
        label="Total Spent"
        value={totalSpent}
        displayValue={formatCurrency(totalSpent)}
        delay={1}
      />
      <StatCard
        icon={Clock}
        label="Pending Payment"
        value={pendingPayments}
        variant="warning"
        delay={2}
      />
      <StatCard
        icon={Zap}
        label="Active Reservations"
        value={activeReservations}
        variant="success"
        delay={3}
      />
    </div>
  )
}
