"use client";

import { motion } from "framer-motion";
import { Search, MousePointerClick, Package, ArrowRight } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const steps = [
  {
    icon: Search,
    title: "Browse the drop",
    body: "Find the deal you want. Stock is shown in real time so you know what is still available.",
  },
  {
    icon: MousePointerClick,
    title: "Claim your item",
    body: "Hit claim to reserve your stock. Your item is held while you complete checkout.",
  },
  {
    icon: Package,
    title: "Track your order",
    body: "After checkout, follow your order status from payment to delivery in one place.",
  },
];

export function FlashSaleHowItWorks() {
  return (
    <section className="relative w-full py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="mb-14 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            From deal to order in three steps
          </h2>
        </motion.div>

        <div className="relative grid gap-4 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-border md:block" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.1, ease: smoothEase }}
            className="absolute left-0 right-0 top-8 hidden h-px origin-left bg-[#FF6600] md:block"
          />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.55, ease: smoothEase, delay: index * 0.07 }}
                whileHover={{
                  y: -8,
                  borderColor: "rgba(255, 102, 0, 0.35)",
                }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-300"
              >
                <motion.div
                  whileHover={{
                    scale: 1.06,
                    boxShadow: "0 0 0 8px rgba(255, 102, 0, 0.08)",
                  }}
                  transition={{ duration: 0.24, ease: smoothEase }}
                  className="relative z-10 flex size-16 items-center justify-center rounded-full border border-[#FF6600]/25 bg-[#FF6600]/10 text-[#FF6600]"
                >
                  <Icon className="size-6" />
                </motion.div>
                <span className="mt-6 block font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.body}</p>
                <span className="mt-5 inline-flex -translate-x-2 items-center text-xs font-semibold text-[#FF6600] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Step ready
                  <ArrowRight className="ml-1 size-3" />
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
