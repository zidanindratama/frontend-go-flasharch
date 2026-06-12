"use client"

import { useState, useEffect, useRef } from "react"
import { flushSync } from "react-dom"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/stores/auth"
import { useUser, useSignOut } from "@/hooks/use-auth"
import {
  Menu,
  X,
  Sun,
  Moon,
  Zap,
  ArrowUpRight,
  ChevronDown,
  LogOut,
  Shield,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react"
import { cn } from "@/lib/utils"

const guestLinks = [
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Guides" },
  { href: "/products", label: "Products" },
  { href: "/flash-sale", label: "Flash Sale" },
]

const buyerLinks = [
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Guides" },
  { href: "/products", label: "Products" },
  { href: "/flash-sale", label: "Flash Sale" },
  { href: "/account", label: "Account" },
]

const headerEase = [0.16, 1, 0.3, 1] as const

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [themeChanging, setThemeChanging] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [cookieAuth, setCookieAuth] = useState(false)
  const [cookieRole, setCookieRole] = useState<string | null>(null)
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const storedUser = useAuthStore((s) => s.user)
  const { data: fetchedUser } = useUser()
  const signOut = useSignOut()
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const effectiveAuthenticated = isAuthenticated || cookieAuth
  const user = fetchedUser ?? storedUser
  const userName = user?.full_name ?? "Account"
  const userEmail = user?.email ?? "Profile loading"
  const userRoleName = user?.role?.name ?? (cookieRole ?? "User")
  const userRoleCode = user?.role?.code ?? cookieRole ?? "buyer"
  const userInitials = getInitials(userName)
  const userAvatarUrl = user?.avatar_url ?? undefined
  const navLinks = effectiveAuthenticated ? buyerLinks : guestLinks

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true))
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const cookies = document.cookie
        .split(";")
        .map((cookie) => cookie.trim().split("="))
        .reduce<Record<string, string>>((acc, [key, value]) => {
          if (key) {
            acc[key] = decodeURIComponent(value ?? "")
          }
          return acc
        }, {})

      setCookieAuth(cookies["gfa-auth"] === "true")
      setCookieRole(cookies["gfa-role"] ?? null)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isAuthenticated])

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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const toggleTheme = () => {
    if (themeChanging) return

    const target = resolvedTheme === "dark" ? "light" : "dark"
    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => {
        ready: Promise<void>
        finished: Promise<void>
      }
    }

    setThemeChanging(true)

    if (!transitionDocument.startViewTransition || prefersReducedMotion()) {
      setTheme(target)

      window.requestAnimationFrame(() => setThemeChanging(false))
      return
    }

    const transition = transitionDocument.startViewTransition(() => {
      flushSync(() => {
        setTheme(target)
      })
    })

    transition.ready.then(() => {
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
    }).catch(() => undefined)

    transition.finished.finally(() => setThemeChanging(false))
  }

  const handleLogout = () => {
    setDropdownOpen(false)
    signOut.mutate()
  }

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "bg-background/55 backdrop-blur-md border-b border-border/30",
        )}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-[#FF6600]/10 group-hover:bg-[#FF6600]/20 transition-colors" />
                <Zap className="h-4 w-4 text-[#FF6600]" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Go FlashArch
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group relative px-4 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span>{link.label}</span>
                    {active ? (
                      <motion.span
                        layoutId="active-nav-line"
                        className="absolute bottom-0 left-4 right-4 h-px bg-[#FF6600]"
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      />
                    ) : (
                      <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-[#FF6600] transition-all duration-300 group-hover:w-[calc(100%-2rem)]" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  disabled={themeChanging}
                  className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <AnimatePresence mode="wait">
                    {resolvedTheme === "dark" ? (
                      <motion.div
                        key="sun"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.28 }}
                      >
                        <Sun className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ scale: 0, rotate: 90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -90 }}
                        transition={{ duration: 0.28 }}
                      >
                        <Moon className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              )}

              {/* User dropdown or Sign In */}
              {effectiveAuthenticated ? (
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
                    <Avatar className="h-7 w-7 rounded-md">
                      <AvatarImage src={userAvatarUrl} alt={userName} />
                      <AvatarFallback className="rounded-md bg-[#FF6600]/15 text-[11px] font-semibold text-[#FF6600]">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="hidden sm:block text-left leading-tight">
                      <div className="text-[13px] font-medium text-foreground">
                        {userName}
                      </div>
                      <div className="text-[11px] text-muted-foreground capitalize">
                        {userRoleName}
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
                            <Avatar className="h-10 w-10 rounded-lg">
                              <AvatarImage src={userAvatarUrl} alt={userName} />
                              <AvatarFallback className="rounded-lg bg-[#FF6600]/10 text-sm font-bold text-[#FF6600]">
                                {userInitials}
                              </AvatarFallback>
                            </Avatar>
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
                            <span className="text-[11px] font-medium text-[#FF6600] capitalize">
                              {userRoleName}
                            </span>
                          </div>
                        </div>

                        <div className="h-px bg-border mx-4" />

                        <div className="p-2">
                          <Link
                            href={
                              userRoleCode === "admin"
                                ? "/dashboard"
                                : "/account"
                            }
                            onClick={() => setDropdownOpen(false)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {userRoleCode === "admin" ? (
                              <LayoutDashboard className="h-3.5 w-3.5" />
                            ) : (
                              <ShoppingBag className="h-3.5 w-3.5" />
                            )}
                            {userRoleCode === "admin"
                              ? "Dashboard"
                              : "Account"}
                          </Link>
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
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex rounded-full text-sm font-medium"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              )}

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden rounded-full"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-background pt-20 md:hidden"
          >
            <div className="flex min-h-[calc(100dvh-5rem)] flex-col px-6 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08,
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-3 py-6"
              >
                <span className="h-px flex-1 bg-border" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Navigation
                </span>
              </motion.div>

              <nav className="border-y border-border">
                {navLinks.map((link, i) => {
                  const active = isActive(link.href)

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.12 + i * 0.055,
                        duration: 0.48,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-b border-border last:border-b-0"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "group flex items-center justify-between py-5 transition-colors",
                          active ? "text-[#FF6600]" : "text-foreground",
                        )}
                      >
                        <span className="flex min-w-0 items-baseline gap-4">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            0{i + 1}
                          </span>
                          <span className="truncate text-3xl font-bold tracking-tight">
                            {link.label}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                            active
                              ? "border-[#FF6600]/25 bg-[#FF6600]/10 text-[#FF6600]"
                              : "border-border text-muted-foreground group-hover:border-[#FF6600]/30 group-hover:text-[#FF6600]",
                          )}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.48,
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-auto pt-8"
              >
                {effectiveAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 mb-4">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage src={userAvatarUrl} alt={userName} />
                        <AvatarFallback className="rounded-lg bg-[#FF6600]/10 text-sm font-bold text-[#FF6600]">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-foreground">
                          {userName}
                        </div>
                        <div className="truncate text-xs text-muted-foreground capitalize">
                          {userRoleName}
                        </div>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 w-full rounded-full"
                    >
                      <Link
                        href={
                          userRoleCode === "admin" ? "/dashboard" : "/account"
                        }
                        onClick={() => setMobileOpen(false)}
                      >
                        {userRoleCode === "admin"
                          ? "Go to Dashboard"
                          : "Go to Account"}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-12 w-full rounded-full mt-2 text-destructive"
                      onClick={() => {
                        setMobileOpen(false)
                        handleLogout()
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full rounded-full"
                  >
                    <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Buyer and admin access use the same authentication entry.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
