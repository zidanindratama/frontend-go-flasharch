"use client";

import { motion } from "framer-motion";
import { Activity, Radio, TrendingUp, Layers, Eye } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ObservabilityHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background pt-24 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,102,0,0.08),transparent_30%),radial-gradient(circle_at_84%_66%,rgba(57,255,20,0.055),transparent_28%)]" />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: smoothEase }}
          className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#FF6600]"
        >
          <span className="h-px w-9 bg-[#FF6600]" />
          Operational Dashboard
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, ease: smoothEase, delay: 0.12 }}
          className="mt-10 max-w-6xl text-5xl font-extrabold leading-[0.92] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl"
        >
          You can&apos;t fix what you can&apos;t see.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: smoothEase, delay: 0.28 }}
          className="mt-8 grid gap-8 lg:grid-cols-[0.7fr_0.3fr] lg:items-end"
        >
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
            A read-only view into system telemetry. Monitor service health,
            throughput, queue pressure, and trace execution flow across the
            Go FlashArch platform — so every performance anomaly leaves a trail.
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground lg:justify-end">
            <Radio className="h-4 w-4 text-emerald-700 dark:text-[#39FF14]" />
            <span className="font-mono">Live telemetry aggregation active</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: smoothEase, delay: 0.5 }}
          className="mt-16 grid gap-4 border-y border-border py-6 text-sm text-muted-foreground md:grid-cols-4"
        >
          <div className="flex items-start gap-3">
            <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6600]" />
            <p>
              Service health checks run every 10s across all core backends.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6600]" />
            <p>
              Metrics aggregate request volume, latency, and error rates in real time.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Layers className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6600]" />
            <p>
              Queue depth tracks RabbitMQ backlog so pressure is visible before it breaks.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6600]" />
            <p>
              Distributed traces follow every checkout from API to database to notification.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
