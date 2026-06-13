import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Zap,
  Activity,
  Gauge,
  Cpu,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
};

export const dashboardNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: Package,
    children: [
      { label: "All Products", href: "/dashboard/products", icon: Package },
      { label: "Categories", href: "/dashboard/products/categories", icon: Tag },
      { label: "Inventory", href: "/dashboard/products/inventory", icon: Warehouse },
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
];
