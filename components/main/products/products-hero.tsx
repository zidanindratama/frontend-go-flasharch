"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Shield,
  Package,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const highlights = [
  { icon: Zap, label: "Quick checkout", desc: "Clear order status" },
  { icon: Shield, label: "Stock checked", desc: "Fair during busy drops" },
];

const stats = [
  { icon: Package, text: "Browse products across every category" },
  { icon: ShoppingCart, text: "Review price and product details before buying" },
  { icon: Shield, text: "Get clearer feedback when demand is high" },
];

export function ProductsHero() {
  return (
    <section className="relative w-full overflow-hidden border-b border-border bg-background pt-28 md:pt-32">
      {/* Background orbs — pushed to corners, lighter on mobile */}
      <div className="absolute -left-40 top-10 size-[28rem] rounded-full bg-[#FF6600]/[0.06] blur-3xl pointer-events-none md:size-[32rem] md:bg-[#FF6600]/8" />
      <div className="absolute -right-40 bottom-32 size-[24rem] rounded-full bg-[#DC143C]/[0.06] blur-3xl pointer-events-none md:size-[28rem] md:bg-[#DC143C]/8" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FF6600]/[0.02] via-transparent to-transparent pointer-events-none md:from-[#FF6600]/[0.03]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-6 md:pb-10">
        {/* Centered headline block */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FF6600]"
          >
            <Sparkles className="h-3.5 w-3.5" />
          Store catalog
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: smoothEase, delay: 0.1 }}
            className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-6xl"
          >
            All products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: smoothEase, delay: 0.2 }}
            className="mt-5 text-base leading-7 text-muted-foreground md:text-lg"
          >
            Browse products, compare prices, and open each item for details
            before you add it to cart.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <Link
              href="/flash-sale"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6600] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e65c00]"
            >
              <Zap className="h-4 w-4" />
              View flash sale
            </Link>
          </motion.div>
        </div>

        {/* Stats + Highlights in one centered row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.4 }}
          className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 md:mt-16 md:flex-row md:justify-center md:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{
                duration: 0.5,
                ease: smoothEase,
                delay: 0.5 + i * 0.1,
              }}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF6600]/10">
                <stat.icon className="h-4 w-4 text-[#FF6600]" />
              </div>
              <span>{stat.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlights row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.6 }}
          className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6 md:flex md:flex-row md:justify-center md:gap-5"
        >
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{
                duration: 0.4,
                ease: smoothEase,
                delay: 0.7 + i * 0.08,
              }}
              className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FF6600]/10">
                <item.icon className="h-4 w-4 text-[#FF6600]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
