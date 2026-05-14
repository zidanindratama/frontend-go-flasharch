"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Cpu, Gauge, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const aboutPages: Array<{
  href: string;
  label: string;
  title: string;
  body: string;
  icon: LucideIcon;
}> = [
  {
    href: "/about/architecture",
    label: "Architecture",
    title: "Request path and stock safety",
    body: "Follow checkout from frontend intent to Redis, RabbitMQ, workers, PostgreSQL, and LGTP signals.",
    icon: Cpu,
  },
  {
    href: "/about/observability",
    label: "Observability",
    title: "Metrics, logs, traces, health",
    body: "Inspect queue depth, service status, log events, and trace timing in one thesis-ready ops view.",
    icon: Activity,
  },
  {
    href: "/about/load-test",
    label: "Load Test",
    title: "K6 pressure evidence",
    body: "Run and explain throughput, latency, failure rate, and oversell correctness under flash sale load.",
    icon: Gauge,
  },
];

export function AboutPages() {
  return (
    <section className="w-full border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
              About Pages
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Thesis proof lives under About.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Architecture, observability, and load testing are grouped here so
            the main navigation stays focused on shopping flow while reviewers
            still get the full technical story.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {aboutPages.map((page, index) => (
            <motion.div
              key={page.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.62, ease: smoothEase, delay: index * 0.07 }}
              className="group flex min-h-[260px] flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-[#FF6600]/35"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6600]/10 text-[#FF6600]">
                  <page.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
                {page.label}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">
                {page.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {page.body}
              </p>
              <Button
                asChild
                variant="ghost"
                className="mt-6 w-fit rounded-full px-0 text-[#FF6600] hover:bg-transparent hover:text-[#e65c00]"
              >
                <Link href={page.href}>
                  Open page
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
