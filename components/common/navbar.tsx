"use client";

import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Zap, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Guides" },
  { href: "/products", label: "Products" },
  { href: "/flash-sale", label: "Flash Sale" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeChanging, setThemeChanging] = useState(false);
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toggleTheme = () => {
    if (themeChanging) return;

    const target = resolvedTheme === "dark" ? "light" : "dark";
    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    setThemeChanging(true);

    if (!transitionDocument.startViewTransition || prefersReducedMotion()) {
      setTheme(target);

      window.requestAnimationFrame(() => setThemeChanging(false));
      return;
    }

    const transition = transitionDocument.startViewTransition(() => {
      flushSync(() => {
        setTheme(target);
      });
    });

    transition.ready.then(() => {
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

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
      );
    }).catch(() => undefined);

    transition.finished.finally(() => setThemeChanging(false));
  };

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
                const active = isActive(link.href);

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
                );
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

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden md:flex rounded-full text-sm font-medium"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>

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
                  const active = isActive(link.href);

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
                  );
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
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full rounded-full"
                >
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Buyer and admin access use the same authentication entry.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
