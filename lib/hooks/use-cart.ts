"use client"

import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  getSavedItems,
  saveCartItemForLater,
  moveSavedItemToCart,
  deleteSavedItem,
} from "@/lib/api/cart"
import { getErrorMessage } from "@/lib/api/errors"
import { useAuthStore } from "@/stores/auth"

export function useCart() {
  const token = useAuthStore((s) => s.access_token)

  const cartQuery = useQuery({
    queryKey: ["account.cart"],
    queryFn: async () => {
      const response = await getCart()
      return response.data.data
    },
    enabled: !!token,
    staleTime: 30_000,
  })

  const itemCount = useMemo(() => {
    const cart = cartQuery.data
    if (!cart) return 0
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartQuery.data])

  const subtotal = useMemo(() => {
    const cart = cartQuery.data
    if (!cart) return 0
    return cart.items.reduce(
      (sum, item) => sum + item.unit_price_amount * item.quantity,
      0,
    )
  }, [cartQuery.data])

  return { cart: cartQuery.data, itemCount, subtotal, isLoading: cartQuery.isLoading }
}

export function useAddCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { product_id: string; quantity: number }) =>
      addCartItem(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account.cart"] })
      const { toast } = await import("sonner")
      toast.success("Added to cart")
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to add to cart"))
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, { quantity }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account.cart"] })
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update cart item"))
    },
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account.cart"] })
      const { toast } = await import("sonner")
      toast.success("Item removed from cart")
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to remove cart item"))
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account.cart"] })
      const { toast } = await import("sonner")
      toast.success("Cart cleared")
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to clear cart"))
    },
  })
}

export function useSavedItems() {
  const token = useAuthStore((s) => s.access_token)

  const savedQuery = useQuery({
    queryKey: ["account.cart.savedItems"],
    queryFn: async () => {
      const response = await getSavedItems()
      return response.data.data.items
    },
    enabled: !!token,
    staleTime: 30_000,
  })

  return { savedItems: savedQuery.data ?? [], isLoading: savedQuery.isLoading }
}

export function useSaveForLater() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => saveCartItemForLater(itemId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["account.cart"] }),
        queryClient.invalidateQueries({ queryKey: ["account.cart.savedItems"] }),
      ])
      const { toast } = await import("sonner")
      toast.success("Item saved for later")
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to save item"))
    },
  })
}

export function useMoveToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (savedItemId: string) => moveSavedItemToCart(savedItemId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["account.cart"] }),
        queryClient.invalidateQueries({ queryKey: ["account.cart.savedItems"] }),
      ])
      const { toast } = await import("sonner")
      toast.success("Item moved to cart")
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to move item to cart"))
    },
  })
}

export function useDeleteSavedItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (savedItemId: string) => deleteSavedItem(savedItemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account.cart.savedItems"] })
      const { toast } = await import("sonner")
      toast.success("Saved item deleted")
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to delete saved item"))
    },
  })
}
