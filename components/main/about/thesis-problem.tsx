"use client";

import { motion } from "framer-motion";
import { AlertTriangle, DatabaseZap, TimerReset } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const risks = [
  {
    icon: DatabaseZap,
    title: "Database overload",
    body: "Concurrent checkout can push too much write pressure into PostgreSQL in a short time window.",
  },
  {
    icon: TimerReset,
    title: "Latency spikes",
    body: "Uncontrolled request queues increase response time and make checkout behavior unstable.",
  },
  {
    icon: AlertTriangle,
    title: "Over-selling",
    body: "Non-atomic stock validation can allow more successful orders than the actual available stock.",
  },
];

export function ThesisProblem() {
  return (
    <section className="w-full border-y border-border bg-card/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: smoothEase }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
              Problem Statement
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Flash sales do not fail because the interface is slow. They fail
              when the backend loses control.
            </h2>
          </motion.div>

          <div className="grid gap-4">
            {risks.map((risk, index) => (
              <motion.div
                key={risk.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{ duration: 0.65, ease: smoothEase, delay: index * 0.08 }}
                className="group rounded-2xl border border-border bg-background p-6 transition-colors hover:border-[#FF6600]/30"
              >
                <div className="flex gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF6600]/10 text-[#FF6600]">
                    <risk.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{risk.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {risk.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
