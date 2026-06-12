"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  LogOut,
  Shield,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"
import { cn } from "@/lib/utils"
import { useUser, useSignOut } from "@/hooks/use-auth"
import { useAuthStore } from "@/stores/auth"

const headerEase = [0.16, 1, 0.3, 1] as const

type Props = {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Header({ sidebarOpen, onToggleSidebar }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [themeChanging, setThemeChanging] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { setTheme, resolvedTheme } = useTheme()
  const storedUser = useAuthStore((s) => s.user)
  const { data: fetchedUser, isLoading: userLoading } = useUser()
  const signOut = useSignOut()
  const user = fetchedUser ?? storedUser

  const userName = user?.full_name ?? (userLoading ? "Loading..." : "Account")
  const userEmail = user?.email ?? (userLoading ? "Fetching profile" : "No profile loaded")
  const userRole = user?.role?.name ?? (userLoading ? "Loading" : "Unknown")
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick)
      return () => document.removeEventListener("mousedown", handleClick)
    }
  }, [dropdownOpen])

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const toggleTheme = () => {
    if (themeChanging) return
    const target = resolvedTheme === "dark" ? "light" : "dark"
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>
        finished: Promise<void>
      }
    }
    setThemeChanging(true)

    if (!doc.startViewTransition || prefersReducedMotion()) {
      setTheme(target)
      requestAnimationFrame(() => setThemeChanging(false))
      return
    }

    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(target))
    })

    transition.ready
      .then(() => {
        const x = window.innerWidth / 2
        const y = window.innerHeight / 2
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        )
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 750,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        )
      })
      .catch(() => undefined)

    transition.finished.finally(() => setThemeChanging(false))
  }

  const handleLogout = () => {
    setDropdownOpen(false)
    signOut.mutate()
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25, ease: headerEase }}
              >
                <PanelLeftClose className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.25, ease: headerEase }}
              >
                <PanelLeftOpen className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {mounted && (
          <button
            onClick={toggleTheme}
            disabled={themeChanging}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <AnimatePresence mode="wait">
              {resolvedTheme === "dark" ? (
                <motion.span
                  key="sun"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.28 }}
                >
                  <Sun className="h-3.5 w-3.5" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={{ duration: 0.28 }}
                >
                  <Moon className="h-3.5 w-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
              dropdownOpen
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#FF6600]/15 text-[11px] font-semibold text-[#FF6600]">
              {userInitials}
            </div>

            <div className="hidden sm:block text-left leading-tight">
              <div className="text-[13px] font-medium text-foreground">
                {userName}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {userRole}
              </div>
            </div>

            <motion.span
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: headerEase }}
              className="hidden sm:block"
            >
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </motion.span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.2, ease: headerEase }}
                className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-popover shadow-xl shadow-black/5"
              >
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6600]/10 text-sm font-bold text-[#FF6600]">
                      {userInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {userName}
                      </div>
                      <div className="truncate text-[12px] text-muted-foreground">
                        {userEmail}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[#FF6600]/8 px-2 py-1">
                    <Shield className="h-3 w-3 text-[#FF6600]" />
                    <span className="text-[11px] font-medium text-[#FF6600]">
                      {userRole}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border mx-4" />

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
