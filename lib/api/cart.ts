import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type CartProduct = {
  id: string
  sku: string
  slug: string
  name: string
  base_price_amount: number
  currency: string
  status: string
  thumbnail_url: string | null
}

export type CartItem = {
  id: string
  product_id: string
  product: CartProduct
  quantity: number
  unit_price_amount: number
  currency: string
  created_at: string
  updated_at: string
}

export type Cart = {
  id: string
  user_id: string
  status: string
  items: CartItem[]
  created_at: string
  updated_at: string
}

export type CartResponse = {
  message: string
  data: Cart
}

export type CartItemResponse = {
  message: string
  data: CartItem
}

export type AddCartItemInput = {
  product_id: string
  quantity: number
}

export type UpdateCartItemInput = {
  quantity: number
}

export type SavedItemProduct = {
  id: string
  sku: string
  slug: string
  name: string
  base_price_amount: number
  currency: string
  status: string
  thumbnail_url: string | null
}

export type SavedItem = {
  id: string
  user_id: string
  product: SavedItemProduct
  quantity: number
  unit_price_amount: number
  currency: string
  created_at: string
  updated_at: string
}

export type SavedItemsResponse = {
  message: string
  data: { items: SavedItem[] }
}

export const getCart = () => api.get<CartResponse>(endpoints.cart.root)

export const addCartItem = (data: AddCartItemInput) =>
  api.post<CartItemResponse>(endpoints.cart.items, data)

export const updateCartItem = (itemId: string, data: UpdateCartItemInput) =>
  api.patch<{ message: string; data: { id: string; quantity: number; unit_price_amount: number; currency: string } }>(
    endpoints.cart.item(itemId),
    data,
  )

export const removeCartItem = (itemId: string) =>
  api.delete<{ message: string }>(endpoints.cart.item(itemId))

export const clearCart = () =>
  api.delete<{ message: string }>(endpoints.cart.items)

export const getSavedItems = () =>
  api.get<SavedItemsResponse>(endpoints.cart.savedItems)

export const saveCartItemForLater = (itemId: string) =>
  api.post<{ message: string; data: { id: string; product_id: string; quantity: number; unit_price_amount: number; currency: string } }>(
    endpoints.cart.saveForLater(itemId),
  )

export const moveSavedItemToCart = (savedItemId: string) =>
  api.post<{ message: string }>(endpoints.cart.moveToCart(savedItemId))

export const deleteSavedItem = (savedItemId: string) =>
  api.delete<{ message: string }>(endpoints.cart.savedItem(savedItemId))
