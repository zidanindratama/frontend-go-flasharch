"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const proofTiles = [
  {
    label: "Stock correctness",
    value: "Oversell target: 0",
    body: "Redis is responsible for the fast stock decision before valid checkout work continues.",
  },
  {
    label: "Write stability",
    value: "Queue before persistence",
    body: "RabbitMQ separates checkout acceptance from final PostgreSQL writes.",
  },
  {
    label: "Operational visibility",
    value: "Logs, metrics, traces",
    body: "LGTP makes the asynchronous flow explainable during a demo or incident review.",
  },
  {
    label: "Load-test evidence",
    value: "K6 validates pressure",
    body: "The thesis story is completed by throughput, latency, and stock-correctness evidence.",
  },
];

export function CheckoutSequence() {
  return (
    <section className="w-full border-t border-border bg-card/35 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: smoothEase }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
              Thesis Demo Proof
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              The architecture should prove four things.
            </h2>
            <p className="mt-5 text-muted-foreground">
              The page should help reviewers explain why the system uses Redis,
              RabbitMQ, PostgreSQL, and centralized observability together.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full bg-[#FF6600] px-7 text-white hover:bg-[#e65c00]"
              >
                <Link href="/about/load-test">
                  View Load Test
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-7">
                <Link href="/about">Read Thesis Context</Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {proofTiles.map((tile, index) => (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{ duration: 0.6, ease: smoothEase, delay: index * 0.06 }}
                className="rounded-3xl border border-border bg-background p-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {tile.label}
                </p>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">{tile.value}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {tile.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
