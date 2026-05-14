"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const steps = [
  {
    icon: ShoppingBag,
    title: "Browse the drop",
    body: "Open the active sale and compare deals while stock is still visible.",
  },
  {
    icon: CheckCircle2,
    title: "Claim your item",
    body: "Pick what you want and move into checkout with clear availability.",
  },
  {
    icon: Clock3,
    title: "Stay in the flow",
    body: "If the sale is busy, the page keeps you informed instead of leaving you guessing.",
  },
  {
    icon: Package,
    title: "Track the result",
    body: "See the next status after checkout, then return to orders whenever you need.",
  },
];

export function HowItWorksForYou() {
  return (
    <section className="relative w-full py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
              How it works for you
            </span>
            <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
              From deal to order, the next step stays obvious.
            </h2>
          </div>
          <Button
            asChild
            variant="ghost"
            className="group w-fit rounded-full text-[#FF6600] hover:bg-[#FF6600]/5 hover:text-[#FF6600]"
          >
            <Link href="/flash-sale">
              View active drops
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <div className="relative grid gap-4 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-border md:block" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.35 }}
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
                viewport={{ once: false, amount: 0.35 }}
                transition={{
                  duration: 0.55,
                  ease: smoothEase,
                  delay: index * 0.07,
                }}
                whileHover={{
                  y: -8,
                  borderColor: "rgba(255, 102, 0, 0.35)",
                  transition: { duration: 0.24, ease: smoothEase },
                }}
                className="group relative overflow-hidden rounded-lg border border-border bg-background p-5"
              >
                <motion.div
                  animate={{ boxShadow: "0 0 0 0 rgba(255, 102, 0, 0)" }}
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
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.body}
                </p>
                <span
                  className="mt-5 inline-flex -translate-x-2 items-center text-xs font-semibold text-[#FF6600] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
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
