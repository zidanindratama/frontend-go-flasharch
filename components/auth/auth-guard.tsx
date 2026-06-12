"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/stores/auth"
import { useUser } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [mounted, isLoading, isAuthenticated, pathname, router])

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <>{children}</>
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const { data: user } = useUser()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push(`/sign-in?redirect=${encodeURIComponent("/dashboard")}`)
      } else if (user && user.role.code !== "admin") {
        router.push("/account")
      }
    }
  }, [mounted, isLoading, isAuthenticated, user, router])

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role.code !== "admin") return null

  return <>{children}</>
}
