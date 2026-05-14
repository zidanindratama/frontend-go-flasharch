"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock,
  Heart,
  LogIn,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const checklist = [
  {
    icon: LogIn,
    title: "Sign in before the timer ends",
    body: "Avoid losing time when deals open.",
  },
  {
    icon: Heart,
    title: "Choose products early",
    body: "Know what you want before stock starts moving.",
  },
  {
    icon: Clock,
    title: "Watch the sale window",
    body: "Drops are easier when the countdown is clear.",
  },
  {
    icon: ShoppingCart,
    title: "Return to orders after checkout",
    body: "Keep your purchase status in one place.",
  },
];

export function DropPrep() {
  return (
    <section className="relative w-full overflow-hidden border-t border-border py-24 md:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,102,0,0.08),transparent_35%,rgba(220,20,60,0.06))]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_28rem] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
            Before the drop
          </span>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            A little prep makes the sale feel calmer.
          </h2>
          <p className="mt-5 max-w-[66ch] text-muted-foreground">
            Big discounts move quickly. Go in with your account ready, your
            favorite products picked, and a clear place to check your order.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#FF6600] px-8 text-white hover:bg-[#e65c00]"
            >
              <Link href="/sign-up">
                Create account
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-border px-8"
            >
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, ease: smoothEase, delay: 0.1 }}
          className="rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="text-sm font-semibold">Drop-ready checklist</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Quick things to finish first
              </p>
            </div>
            <motion.span
              animate={{ scale: [1, 1.04, 1] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-full bg-[#39FF14]/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-[#39FF14]"
            >
              4 steps
            </motion.span>
          </div>

          <div className="mt-4 grid gap-3">
            {checklist.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{
                    duration: 0.45,
                    ease: smoothEase,
                    delay: index * 0.05,
                  }}
                  whileHover={{
                    x: 4,
                    borderColor: "rgba(255, 102, 0, 0.3)",
                    transition: { duration: 0.22, ease: smoothEase },
                  }}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 4 }}
                    transition={{ duration: 0.22, ease: smoothEase }}
                    className="flex size-10 items-center justify-center rounded-full bg-[#FF6600]/10 text-[#FF6600]"
                  >
                    <Icon className="size-4" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0.75, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.6 }}
                    transition={{
                      duration: 0.35,
                      ease: smoothEase,
                      delay: 0.12 + index * 0.06,
                    }}
                    className="mt-1 text-emerald-700 group-hover:scale-110 dark:text-[#39FF14]"
                  >
                    <Check className="size-4" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
