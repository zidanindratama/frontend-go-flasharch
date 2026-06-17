"use client"

import { useCallback, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getBuyerWishlist,
  addToWishlist,
  removeFromWishlist,
  type WishlistItem,
} from "@/lib/api/account"
import { getErrorMessage } from "@/lib/api/errors"
import { useAuthStore } from "@/stores/auth"

export function useWishlistProductIds() {
  const token = useAuthStore((s) => s.access_token)
  const queryClient = useQueryClient()

  const wishlistQuery = useQuery({
    queryKey: ["account.wishlist"],
    queryFn: async () => {
      const response = await getBuyerWishlist()
      return response.data.data.items
    },
    enabled: !!token,
    staleTime: 60_000,
  })

  const wishlistedIds = useMemo(() => {
    const items = wishlistQuery.data ?? []
    return new Set(items.map((item: WishlistItem) => item.product.id))
  }, [wishlistQuery.data])

  const addMutation = useMutation({
    mutationFn: (productId: string) => addToWishlist({ product_id: productId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account.wishlist"] })
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to add to wishlist"))
    },
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account.wishlist"] })
    },
    onError: async (error: Error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to remove from wishlist"))
    },
  })

  const toggleWishlist = useCallback(
    (productId: string) => {
      if (wishlistedIds.has(productId)) {
        removeMutation.mutate(productId)
      } else {
        addMutation.mutate(productId)
      }
    },
    [wishlistedIds, addMutation, removeMutation],
  )

  const isPending = addMutation.isPending || removeMutation.isPending

  return { wishlistedIds, toggleWishlist, isPending }
}
