"use client";

import { motion } from "framer-motion";
import { Gauge, Timer, Users, Activity } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function LoadTestHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background pt-24 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,102,0,0.08),transparent_30%),radial-gradient(circle_at_84%_66%,rgba(220,20,60,0.055),transparent_28%)]" />
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
          Performance Lab
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, ease: smoothEase, delay: 0.12 }}
          className="mt-10 max-w-6xl text-5xl font-extrabold leading-[0.92] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Pressure-test the system before users do.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: smoothEase, delay: 0.28 }}
          className="mt-8 grid gap-8 lg:grid-cols-[0.7fr_0.3fr] lg:items-end"
        >
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
            Simulate flash sale traffic with configurable virtual users,
            ramp-up curves, and target endpoints. Validate that Redis stock
            gates and RabbitMQ buffers hold under real pressure.
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground lg:justify-end">
            <Gauge className="h-4 w-4 text-[#FF6600]" />
            <span className="font-mono">K6-compatible execution model</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: smoothEase, delay: 0.5 }}
          className="mt-16 grid gap-4 border-y border-border py-6 text-sm text-muted-foreground md:grid-cols-4"
        >
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6600]" />
            <p>Configure virtual users, ramp-up time, and hold duration.</p>
          </div>
          <div className="flex items-start gap-3">
            <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6600]" />
            <p>Target specific endpoints: checkout, product list, or auth.</p>
          </div>
          <div className="flex items-start gap-3">
            <Timer className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6600]" />
            <p>Real-time metrics streamed during test execution.</p>
          </div>
          <div className="flex items-start gap-3">
            <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6600]" />
            <p>
              Latency percentiles, error rates, and throughput breakdowns.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
