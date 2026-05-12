"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ArchitectureHero() {
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
          Architecture Lab
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, ease: smoothEase, delay: 0.12 }}
          className="mt-10 max-w-6xl text-5xl font-extrabold leading-[0.92] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Stock is decided before the database feels pressure.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: smoothEase, delay: 0.28 }}
          className="mt-8 grid gap-8 lg:grid-cols-[0.7fr_0.3fr] lg:items-end"
        >
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
            The thesis architecture separates the fast stock decision from the
            durable write path. Redis protects stock atomically, RabbitMQ buffers
            valid checkout work, workers persist final state into PostgreSQL,
            and centralized observability keeps the asynchronous system
            explainable.
          </p>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#FF6600] px-7 text-white hover:bg-[#e65c00]"
            >
              <Link href="/flash-sale">
                Run the Flash Sale Path
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link href="/observability">Inspect Signals</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: smoothEase, delay: 0.5 }}
          className="mt-16 grid gap-4 border-y border-border py-6 text-sm text-muted-foreground md:grid-cols-3"
        >
          <p>
            Frontend checkout intent enters the backend API before the protected
            stock-safe path begins.
          </p>
          <p>
            Redis validates and decrements stock before RabbitMQ accepts valid
            checkout work.
          </p>
          <p>
            Workers write final state to PostgreSQL while LGTP exposes logs,
            metrics, traces, and health signals.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
