export type OrderStatus = "paid" | "waiting_payment" | "cancelled"

export type MockOrder = {
  id: string
  status: OrderStatus
  total_amount: number
  item_count: number
  created_at: string
  product_name: string
}

export type MockAccountDashboard = {
  total_orders: number
  total_spent_amount: number
  pending_payment_count: number
  active_reservation_count: number
  latest_orders: MockOrder[]
  user: {
    name: string
    email: string
    avatar_url: string | null
    member_since: string
  }
}

export const mockAccountDashboard: MockAccountDashboard = {
  total_orders: 6,
  total_spent_amount: 1200000,
  pending_payment_count: 1,
  active_reservation_count: 1,
  latest_orders: [
    {
      id: "ORD-2026-001",
      status: "paid",
      total_amount: 450000,
      item_count: 2,
      created_at: "2026-06-10T08:30:00Z",
      product_name: "Keychron Q1 Pro Mechanical Keyboard",
    },
    {
      id: "ORD-2026-002",
      status: "waiting_payment",
      total_amount: 320000,
      item_count: 1,
      created_at: "2026-06-11T14:20:00Z",
      product_name: "Logitech G Pro X Superlight",
    },
    {
      id: "ORD-2026-003",
      status: "cancelled",
      total_amount: 189000,
      item_count: 1,
      created_at: "2026-06-08T11:00:00Z",
      product_name: "SteelSeries QcK Heavy Mousepad",
    },
    {
      id: "ORD-2026-004",
      status: "paid",
      total_amount: 875000,
      item_count: 3,
      created_at: "2026-06-05T09:15:00Z",
      product_name: "Samsung 970 EVO Plus 1TB NVMe SSD",
    },
  ],
  user: {
    name: "Zidan Indratama",
    email: "zidan@gunadarma.ac.id",
    avatar_url: null,
    member_since: "2026-01-15",
  },
}

export function formatCurrency(amount: number): string {
  return `IDR ${amount.toLocaleString("id-ID")}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
