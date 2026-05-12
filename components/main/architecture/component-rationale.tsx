"use client";

import { motion } from "framer-motion";
import { Activity, Database, GitBranch, HardDrive, Server } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const zones = [
  {
    id: "01",
    name: "Stock Gate",
    stack: "Redis",
    icon: Database,
    tone: "#FF6600",
    statement:
      "The stock decision must happen fast and atomically before valid checkout work enters the asynchronous path.",
    proof: "stock validation + decrement",
  },
  {
    id: "02",
    name: "Pressure Buffer",
    stack: "RabbitMQ",
    icon: GitBranch,
    tone: "#F6B73C",
    statement:
      "Valid checkout messages are queued so PostgreSQL is not forced to absorb every concurrent request directly.",
    proof: "publish valid work only",
  },
  {
    id: "03",
    name: "Controlled Persistence",
    stack: "Worker + PostgreSQL",
    icon: HardDrive,
    tone: "#DC143C",
    statement:
      "Workers consume queued checkout work and write final transaction state into PostgreSQL as the durable source of truth.",
    proof: "final transaction write",
  },
  {
    id: "04",
    name: "Observability Envelope",
    stack: "Prometheus + Loki + Tempo + Grafana",
    icon: Activity,
    tone: "#8A8A8A",
    statement:
      "Metrics, logs, traces, and dashboards expose bottlenecks, failures, recovery signals, and system health.",
    proof: "logs / metrics / traces",
  },
  {
    id: "05",
    name: "Traffic Entry",
    stack: "Frontend + API",
    icon: Server,
    tone: "#8A8A8A",
    statement:
      "The buyer starts checkout in the frontend; the backend API receives the intent and passes it into the protected flow.",
    proof: "checkout intent boundary",
  },
];

export function ComponentRationale() {
  return (
    <section className="w-full py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="max-w-4xl"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
            Pressure Zones
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            The system is not a stack. It is a pressure-control route.
          </h2>
        </motion.div>

        <div className="mt-14 border-y border-border">
          {zones.map((zone, index) => (
            <motion.article
              key={zone.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.28 }}
              transition={{ duration: 0.62, ease: smoothEase, delay: index * 0.04 }}
              className="group grid gap-6 border-b border-border py-7 last:border-b-0 md:grid-cols-[0.25fr_0.45fr_1fr_0.45fr] md:items-center"
            >
              <div className="font-mono text-xs text-muted-foreground">{zone.id}</div>
              <div className="flex items-center gap-4">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border bg-card"
                  style={{ borderColor: `${zone.tone}55`, color: zone.tone }}
                >
                  <zone.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                    {zone.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {zone.stack}
                  </p>
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {zone.statement}
              </p>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:text-right">
                {zone.proof}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
