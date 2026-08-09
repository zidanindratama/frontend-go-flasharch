import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Zap,
  Gauge,
  Users,
  Warehouse,
  Newspaper,
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
    label: "Blogs",
    href: "/dashboard/blogs",
    icon: Newspaper,
    children: [
      { label: "All Blogs", href: "/dashboard/blogs", icon: Newspaper },
      { label: "Categories", href: "/dashboard/blogs/categories", icon: Tag },
    ],
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: Package,
    children: [
      { label: "All Products", href: "/dashboard/products", icon: Package },
      {
        label: "Categories",
        href: "/dashboard/products/categories",
        icon: Tag,
      },
      {
        label: "Inventory",
        href: "/dashboard/products/inventory",
        icon: Warehouse,
      },
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
    children: [
      { label: "All Sales", href: "/dashboard/flash-sales", icon: Zap },
      { label: "Create Sale", href: "/dashboard/flash-sales/new", icon: Tag },
    ],
  },
  {
    label: "Load Test",
    href: "/about/load-test",
    icon: Gauge,
  },
];
