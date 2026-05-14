"use client";

import { motion } from "framer-motion";
import { BadgeCheck, BellRing, PackageCheck, ShieldCheck } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Stock feels honest",
    body: "You can see what is still available before you commit to checkout.",
  },
  {
    icon: BadgeCheck,
    title: "Fair during busy drops",
    body: "When everyone arrives at once, the flow keeps purchases orderly.",
  },
  {
    icon: BellRing,
    title: "Status stays clear",
    body: "Know whether your order is waiting, confirmed, or needs another try.",
  },
  {
    icon: PackageCheck,
    title: "Less guesswork",
    body: "From deal to order, every step gives you a clear next action.",
  },
];

export function ShopperTrust() {
  return (
    <section className="relative w-full border-y border-border bg-muted/30 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
            Why shoppers trust it
          </span>
          <h2 className="mt-3 max-w-xl text-4xl font-bold tracking-tight md:text-5xl">
            A flash sale should feel exciting, not confusing.
          </h2>
          <p className="mt-5 max-w-[64ch] text-muted-foreground">
            Go FlashArch keeps the important shopping moments visible: what is
            left, what you claimed, and what happens after checkout.
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2">
          {trustPoints.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{
                  duration: 0.55,
                  ease: smoothEase,
                  delay: index * 0.06,
                }}
                whileHover={{
                  y: -6,
                  borderColor: "rgba(255, 102, 0, 0.35)",
                  transition: { duration: 0.22, ease: smoothEase },
                }}
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-5"
              >
                <motion.div
                  whileHover={{ rotate: -6, scale: 1.08 }}
                  transition={{ duration: 0.22, ease: smoothEase }}
                  className="flex size-10 items-center justify-center rounded-full bg-[#FF6600]/10 text-[#FF6600]"
                >
                  <Icon className="size-5" />
                </motion.div>
                <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.body}
                </p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false, amount: 0.7 }}
                  transition={{
                    duration: 0.55,
                    ease: smoothEase,
                    delay: 0.12 + index * 0.05,
                  }}
                  className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-[#FF6600]/60"
                />
                <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-[#FF6600]/0 blur-2xl transition-colors duration-300 group-hover:bg-[#FF6600]/10" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
