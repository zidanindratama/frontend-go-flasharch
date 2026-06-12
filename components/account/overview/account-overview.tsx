"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import {
  ChevronRight,
  Heart,
  MapPin,
  PackageOpen,
  Settings,
  ShoppingBag,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/hooks/use-auth"
import {
  getBuyerDashboard,
  type BuyerOrderRow,
} from "@/lib/api/account"
import { useAuthStore } from "@/stores/auth"
import { cn } from "@/lib/utils"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const navCards = [
  {
    label: "Orders",
    href: "/account/orders",
    icon: ShoppingBag,
    desc: "Track purchases & payments",
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
    desc: "Saved flash-sale items",
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
    desc: "Manage shipping addresses",
  },
  {
    label: "Settings",
    href: "/account/settings",
    icon: Settings,
    desc: "Account & preferences",
  },
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount / 100)
}

function statusStyle(status: string) {
  if (["paid", "completed", "confirmed"].includes(status)) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  }
  if (["pending", "pending_payment", "waiting_payment"].includes(status)) {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  }
  if (["cancelled", "failed", "expired"].includes(status)) {
    return "bg-red-500/10 text-red-600 dark:text-red-400"
  }
  return "bg-muted text-muted-foreground"
}

function OrderRow({ order }: { order: BuyerOrderRow }) {
  return (
    <Link
      href="/account/orders"
      className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-muted/40"
    >
      <div className="min-w-0">
        <p className="line-clamp-1 break-all text-sm font-medium text-foreground">
          {order.order_code}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {order.item_count} item{order.item_count === 1 ? "" : "s"} -{" "}
          {new Date(order.created_at).toLocaleDateString("en", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold tabular-nums text-foreground">
          {formatCurrency(order.total_amount)}
        </p>
        <span
          className={cn(
            "mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
            statusStyle(order.status),
          )}
        >
          {order.status.replaceAll("_", " ")}
        </span>
      </div>
    </Link>
  )
}

export function AccountOverview() {
  const { data: user } = useUser()
  const token = useAuthStore((s) => s.access_token)
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["buyer-dashboard"],
    queryFn: async () => {
      const response = await getBuyerDashboard()
      return response.data
    },
    enabled: !!token,
    staleTime: 60_000,
  })

  if (!user) return null

  const stats = dashboard?.data

  return (
    <div className="space-y-4 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.45, ease }}
        className="flex items-center gap-3"
      >
        <Avatar className="h-10 w-10 lg:h-11 lg:w-11">
          <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name} />
          <AvatarFallback className="bg-[#FF6600]/10 text-sm font-semibold text-[#FF6600]">
            {getInitials(user.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="text-base font-bold tracking-tight lg:text-lg">
            {user.full_name}
          </h1>
          <p className="text-xs text-muted-foreground lg:text-sm">
            Member since{" "}
            {new Date(user.created_at).toLocaleDateString("en", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </motion.div>

      <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <div className="mb-3 flex items-center gap-2">
          <PackageOpen className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Quick Stats</p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[74px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Total Orders" value={stats?.total_orders ?? 0} />
            <StatTile
              label="Total Spent"
              value={formatCurrency(stats?.total_spent_amount ?? 0)}
            />
            <StatTile
              label="Pending Payments"
              value={stats?.pending_payment_count ?? 0}
            />
            <StatTile
              label="Active Reservations"
              value={stats?.active_reservation_count ?? 0}
            />
          </div>
        )}
      </div>

      <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-sm font-semibold tracking-tight">Latest Orders</p>
          <Link
            href="/account/orders"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        {isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[72px] rounded-lg" />
            ))}
          </div>
        ) : stats?.latest_orders.length ? (
          <div className="grid gap-2">
            {stats.latest_orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
              <PackageOpen className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No orders yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Your completed orders will appear here.
            </p>
          </div>
        )}
      </div>

      <div className="lg:hidden">
        <h2 className="mb-3 px-1 text-sm font-semibold tracking-tight">
          Account Menu
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {navCards.map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + i * 0.05,
                duration: 0.35,
                ease,
              }}
              className="h-full"
            >
              <Link
                href={card.href}
                className="group flex h-full min-h-[7.5rem] flex-col gap-2.5 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow hover:shadow-md hover:ring-[#FF6600]/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF6600]/10">
                    <card.icon className="h-4 w-4 text-[#FF6600]" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{card.label}</p>
                  <p className="text-xs text-muted-foreground">{card.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="truncate text-lg font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
