import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Zap,
  Activity,
  Gauge,
  Cpu,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  children?: NavItem[]
}

export const dashboardNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: Package,
    children: [
      { label: "Catalog", href: "/dashboard/products", icon: Package },
      { label: "Inventory", href: "/dashboard/products/inventory", icon: Package },
    ],
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    label: "Flash Sales",
    href: "/dashboard/flash-sales",
    icon: Zap,
  },
  {
    label: "Observability",
    href: "/dashboard/observability",
    icon: Activity,
  },
  {
    label: "Load Test",
    href: "/dashboard/load-test",
    icon: Gauge,
  },
  {
    label: "Architecture",
    href: "/dashboard/architecture",
    icon: Cpu,
  },
]
