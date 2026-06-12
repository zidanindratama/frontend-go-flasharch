"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth"

export function AuthStoreHydration() {
  useEffect(() => {
    const result = useAuthStore.persist.rehydrate()
    if (result instanceof Promise) {
      result.then(() => {
        useAuthStore.getState().setLoading(false)
      })
    } else {
      useAuthStore.getState().setLoading(false)
    }
  }, [])

  return null
}
