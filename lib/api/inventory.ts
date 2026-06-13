import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

// ─── Types ─────────────────────────────────────────────────

export type WarehouseRef = {
  id: string
  code: string
  name: string
  status: string
}

export type ProductRef = {
  id: string
  sku: string
  slug: string
  name: string
}

export type StockSnapshot = {
  id: string
  on_hand_quantity: number
  reserved_quantity: number
  sold_quantity: number
  available_quantity: number
  version: number
  product: ProductRef
  warehouse: WarehouseRef
  created_at: string
  updated_at: string
}

export type MovementType =
  | "adjustment_in"
  | "adjustment_out"
  | "reservation"
  | "sale"
  | "release"

export type StockSnapshotBefore = {
  on_hand_quantity: number
  reserved_quantity: number
  sold_quantity: number
  available_quantity: number
  version: number
}

export type InventoryMovement = {
  id: string
  product: ProductRef
  warehouse: WarehouseRef
  movement_type: MovementType
  quantity_delta: number
  reference_type: string | null
  reference_id: string | null
  reason: string
  snapshot_before: StockSnapshotBefore
  snapshot_after: StockSnapshotBefore
  created_at: string
}

// ─── Query Params ──────────────────────────────────────────

export type StockListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
  product_id?: string
  warehouse_code?: string
  low_stock?: boolean
}

export type MovementListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
  product_id?: string
  warehouse_code?: string
  movement_type?: MovementType
  reference_type?: string
  created_from?: string
  created_to?: string
}

export type StockAdjustInput = {
  warehouse_code?: string
  quantity_delta: number
  reason: string
}

// ─── API Calls ─────────────────────────────────────────────

export type PaginatedResponse<T> = {
  message: string
  data: {
    items: T[]
    page: number
    per_page: number
    total: number
  }
}

export type SingleResponse<T> = {
  message: string
  data: T
}

export const listInventoryStocks = (params: StockListParams) =>
  api.get<PaginatedResponse<StockSnapshot>>(endpoints.admin.inventory.stocks, {
    params,
  })

export const getInventoryProductStock = (productId: string) =>
  api.get<SingleResponse<StockSnapshot>>(
    `${endpoints.admin.products}/${productId}/stock`,
  )

export const adjustProductStock = (
  productId: string,
  data: StockAdjustInput,
) =>
  api.post<SingleResponse<StockSnapshot>>(
    endpoints.admin.stockAdjust(productId),
    data,
  )

export const listInventoryMovements = (params: MovementListParams) =>
  api.get<PaginatedResponse<InventoryMovement>>(
    endpoints.admin.inventory.movements,
    { params },
  )
