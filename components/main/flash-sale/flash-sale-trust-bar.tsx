"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle, Lock, RefreshCw } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const signals = [
  {
    icon: ShieldCheck,
    title: "Real stock",
    body: "Every item count is backed by live inventory.",
  },
  {
    icon: CheckCircle,
    title: "Fair checkout",
    body: "First claim, first served. No hidden queues.",
  },
  {
    icon: Lock,
    title: "Secure reservation",
    body: "Your stock is reserved while you pay.",
  },
  {
    icon: RefreshCw,
    title: "Live updates",
    body: "Numbers refresh as deals are claimed.",
  },
];

export function FlashSaleTrustBar() {
  return (
    <section className="relative w-full border-y border-border bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <motion.div
                key={signal.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.55, ease: smoothEase, delay: index * 0.06 }}
                whileHover={{ scale: 1.02 }}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors duration-300 hover:border-[#FF6600]/30"
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 5 }}
                  transition={{ duration: 0.2, ease: smoothEase }}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FF6600]/10 text-[#FF6600]"
                >
                  <Icon className="size-5" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-semibold">{signal.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{signal.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
