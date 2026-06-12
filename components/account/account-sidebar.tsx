"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSignOut } from "@/hooks/use-auth"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const accountNavItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Settings", href: "/account/settings", icon: Settings },
]

function SidebarItem({
  label,
  href,
  icon: Icon,
  isActive,
}: {
  label: string
  href: string
  icon: LucideIcon
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#FF6600]/10 text-[#FF6600]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {isActive && (
        <motion.span
          layoutId="account-sidebar-active"
          className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-[#FF6600]"
          transition={{ duration: 0.65, ease }}
        />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-[#FF6600]" : "text-muted-foreground/60 group-hover:text-muted-foreground",
        )}
      />
      <span>{label}</span>
    </Link>
  )
}

export function AccountSidebar() {
  const pathname = usePathname()
  const signOut = useSignOut()

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 space-y-1">
          {accountNavItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.45, ease }}
            >
              <SidebarItem
                {...item}
                isActive={
                  item.href === "/account"
                    ? pathname === "/account"
                    : pathname.startsWith(item.href)
                }
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.45, ease }}
            className="pt-4"
          >
            <div className="border-t border-border pt-4">
              <button
                type="button"
                onClick={() => signOut.mutate()}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4 shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      </aside>
    </>
  )
}
