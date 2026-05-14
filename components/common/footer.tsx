"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowUpRight, Globe, MessageCircle } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const footerLinks = {
  Product: [
    { label: "Products", href: "/products" },
    { label: "Flash Sale", href: "/flash-sale" },
    { label: "Orders", href: "/orders" },
    { label: "Guides", href: "/blogs" },
  ],
  System: [
    { label: "About", href: "/about" },
    { label: "Why It Works", href: "/about/architecture" },
    { label: "Reliability View", href: "/about/observability" },
    { label: "Stress Test", href: "/about/load-test" },
  ],
  Account: [
    { label: "Sign In", href: "/sign-in" },
    { label: "Sign Up", href: "/sign-up" },
    { label: "Forgot Password", href: "/forgot-password" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-[#FF6600]/10" />
                <Zap className="h-4 w-4 text-[#FF6600]" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Go FlashArch
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Flash sale shopping with clearer stock, faster checkout, and
              order updates that make busy drops easier to trust.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-[#FF6600]/30 transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-[#FF6600]/30 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="ml-0.5 h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Go FlashArch. Muhamad Zidan
            Indratama. Universitas Gunadarma.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              About Thesis
            </Link>
            <span className="text-xs text-muted-foreground">
              Built for fair checkout and high-demand sale moments
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
