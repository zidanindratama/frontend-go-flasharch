"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const points = [
  "Demonstrates the normal e-commerce flow before entering the flash sale scenario.",
  "Separates fast stock reservation in Redis from final persistence in PostgreSQL.",
  "Shows RabbitMQ as the pressure buffer for valid checkout work.",
  "Makes observability visible as a product feature, not only a backend detail.",
  "Provides a thesis-demo narrative that can be explained without extra context.",
];

export function ThesisContribution() {
  return (
    <section className="w-full py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: smoothEase }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
              Product Contribution
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              This frontend is not a thesis poster. It is a product demo that
              explains the research contribution.
            </h2>
            <p className="mt-5 max-w-xl text-muted-foreground">
              Landing page, catalog, flash sale, admin, observability, and load
              test screens should reinforce one story: the system stays
              measurable when checkout pressure rises.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full bg-[#FF6600] px-7 text-white hover:bg-[#e65c00]"
              >
                <Link href="/flash-sale">
                  View Flash Sale Flow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-7">
                <Link href="/about/observability">Open Observability</Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid gap-3">
            {points.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{ duration: 0.6, ease: smoothEase, delay: index * 0.06 }}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF6600]" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {point}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
