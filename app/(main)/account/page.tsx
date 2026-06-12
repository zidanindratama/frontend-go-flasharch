"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/hooks/use-auth"
import {
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  ChevronRight,
  PackageOpen,
} from "lucide-react"

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

export default function AccountPage() {
  const { data: user } = useUser()

  if (!user) return null

  return (
    <div className="space-y-4 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.55, ease }}
        className="flex items-center gap-3"
      >
        <Avatar className="h-10 w-10 lg:h-11 lg:w-11">
          <AvatarFallback className="bg-[#FF6600]/10 text-[#FF6600] font-semibold text-sm">
            {getInitials(user.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="text-base font-bold tracking-tight lg:text-lg">
            {user.full_name}
          </h1>
          <p className="text-xs text-muted-foreground lg:text-sm">
            Member since{" "}
            {new Date(user.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </motion.div>

      <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <div className="flex items-center gap-2 mb-3">
          <PackageOpen className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Quick Stats</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-lg font-bold tabular-nums">0</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-lg font-bold tabular-nums">IDR 0</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-lg font-bold tabular-nums">0</p>
            <p className="text-xs text-muted-foreground">Pending Payments</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-lg font-bold tabular-nums">0</p>
            <p className="text-xs text-muted-foreground">Active Reservations</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-sm font-semibold tracking-tight">Latest Orders</p>
        </div>
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
                delay: 0.5 + i * 0.06,
                duration: 0.45,
                ease,
              }}
              className="h-full"
            >
              <Link
                href={card.href}
                className="group flex h-full flex-col gap-2.5 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow hover:shadow-md hover:ring-[#FF6600]/20 min-h-[7.5rem]"
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
