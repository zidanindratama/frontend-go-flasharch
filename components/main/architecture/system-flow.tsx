"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Database,
  HardDrive,
  Layers,
  Monitor,
  Server,
  type LucideIcon,
} from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const nodes: Array<{
  name: string;
  role: string;
  detail: string;
  icon: LucideIcon;
  area: "entry" | "gate" | "buffer" | "persist" | "observe";
}> = [
  {
    name: "Frontend",
    role: "Checkout intent",
    detail: "Buyer starts checkout from the storefront or flash sale campaign.",
    icon: Monitor,
    area: "entry",
  },
  {
    name: "Backend API",
    role: "Request entry",
    detail: "The API receives the checkout intent before the stock-safe path begins.",
    icon: Server,
    area: "entry",
  },
  {
    name: "Redis",
    role: "Atomic stock gate",
    detail: "Stock validation and decrement happen atomically before queueing valid work.",
    icon: Database,
    area: "gate",
  },
  {
    name: "RabbitMQ",
    role: "Pressure buffer",
    detail: "Valid checkout work is queued so PostgreSQL is not hit by every concurrent request at once.",
    icon: Layers,
    area: "buffer",
  },
  {
    name: "Worker",
    role: "Async processor",
    detail: "Workers consume queue messages and move checkout work toward final persistence.",
    icon: Server,
    area: "persist",
  },
  {
    name: "PostgreSQL",
    role: "Source of truth",
    detail: "Final transaction and order state are written durably after the protected flow.",
    icon: HardDrive,
    area: "persist",
  },
  {
    name: "LGTP",
    role: "Observability envelope",
    detail: "Metrics, logs, traces, and dashboards expose bottlenecks, failures, and recovery signals.",
    icon: Activity,
    area: "observe",
  },
];

function NodeChip({ node, index }: { node: (typeof nodes)[number]; index: number }) {
  const accent = node.area === "gate" ? "#FF6600" : node.area === "buffer" ? "#F6B73C" : "currentColor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.55, ease: smoothEase, delay: index * 0.04 }}
      className="group rounded-2xl border border-border bg-card p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <node.icon className="h-5 w-5 text-muted-foreground" style={{ color: accent }} />
        <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-tight">{node.name}</h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {node.role}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {node.detail}
      </p>
    </motion.div>
  );
}

export function SystemFlow() {
  const entryNodes = nodes.filter((node) => node.area === "entry");
  const persistNodes = nodes.filter((node) => node.area === "persist");
  const redisNode = nodes.find((node) => node.name === "Redis")!;
  const rabbitNode = nodes.find((node) => node.name === "RabbitMQ")!;
  const lgtpNode = nodes.find((node) => node.name === "LGTP")!;

  return (
    <section className="relative w-full overflow-hidden bg-background py-20 text-foreground md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_30%,rgba(255,102,0,0.07),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="max-w-4xl"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
            Request Map
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Map the pressure, not a timeline.
          </h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            The architecture is organized by responsibility: request entry,
            stock gate, pressure buffer, controlled persistence, and an
            observability layer that wraps the whole route.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:grid-rows-[auto_auto]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.65, ease: smoothEase }}
            className="rounded-[2rem] border border-border bg-card p-5 lg:row-span-2"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              entry zone
            </div>
            <div className="mt-5 grid gap-4">
              {entryNodes.map((node, index) => (
                <NodeChip key={node.name} node={node} index={index} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: smoothEase, delay: 0.08 }}
            className="relative overflow-hidden rounded-[2rem] border border-[#FF6600]/25 bg-[#FF6600]/10 p-6"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF6600]">
              atomic gate
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-[0.65fr_1fr] md:items-end">
              <div>
                <redisNode.icon className="h-8 w-8 text-[#FF6600]" />
                <h3 className="mt-6 text-4xl font-extrabold tracking-tight">Redis</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {redisNode.detail}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.65, ease: smoothEase, delay: 0.1 }}
            className="rounded-[2rem] border border-border bg-card p-5 lg:row-span-2"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              persistence zone
            </div>
            <div className="mt-5 grid gap-4">
              {persistNodes.map((node, index) => (
                <NodeChip key={node.name} node={node} index={index + 4} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: smoothEase, delay: 0.16 }}
            className="relative overflow-hidden rounded-[2rem] border border-[#F6B73C]/25 bg-[#F6B73C]/10 p-6"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#B77A11] dark:text-[#F6B73C]">
              pressure buffer
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-[0.65fr_1fr] md:items-end">
              <div>
                <rabbitNode.icon className="h-8 w-8 text-[#B77A11] dark:text-[#F6B73C]" />
                <h3 className="mt-6 text-4xl font-extrabold tracking-tight">RabbitMQ</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {rabbitNode.detail}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="mt-4 rounded-[2rem] border border-border bg-card p-6"
        >
          <div className="grid gap-6 lg:grid-cols-[0.36fr_1fr] lg:items-center">
            <div>
              <lgtpNode.icon className="h-7 w-7 text-muted-foreground" />
              <h3 className="mt-5 text-3xl font-extrabold tracking-tight">LGTP Observability</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {lgtpNode.detail} Prometheus records metrics, Loki stores logs,
              Tempo captures traces, and Grafana visualizes system health.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
