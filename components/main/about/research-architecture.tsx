"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Database,
  Layers,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const architecture: Array<{
  name: string;
  body: string;
  icon: LucideIcon;
}> = [
  {
    name: "Frontend",
    body: "The buyer sends checkout intent from the catalog or flash sale flow.",
    icon: Server,
  },
  {
    name: "Redis",
    body: "Stock validation and decrement are handled atomically.",
    icon: Database,
  },
  {
    name: "RabbitMQ",
    body: "Valid checkout work enters a queue so write pressure stays controlled.",
    icon: Layers,
  },
  {
    name: "Worker",
    body: "Workers process queued messages and write the final state.",
    icon: Server,
  },
  {
    name: "PostgreSQL",
    body: "Orders and transactions become the durable source of truth.",
    icon: Database,
  },
  {
    name: "LGTP",
    body: "Logs, metrics, traces, and dashboards expose system health signals.",
    icon: Activity,
  },
];

export function ResearchArchitecture() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] py-20 text-white md:py-28">
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="max-w-3xl"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
            Research Questions
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Two research questions answered by this architecture.
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            "How can a backend architecture using Redis and RabbitMQ process high concurrent checkout requests without overloading PostgreSQL and without over-selling?",
            "How can centralized observability using Loki, Grafana, Tempo, and Prometheus help trace bottlenecks, failures, and recovery signals in an asynchronous system?",
          ].map((question, index) => (
            <motion.div
              key={question}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.7, ease: smoothEase, delay: index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-white/35">
                Question 0{index + 1}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/85">{question}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {architecture.map(({ name, body, icon: Icon }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.65, ease: smoothEase, delay: index * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-[#FF6600]/30"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6600]/10 text-[#FF6600]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">{name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-white"
        >
          <div className="flex gap-4">
            <ShieldCheck className="h-6 w-6 shrink-0 text-[#39FF14]/80" />
            <p className="text-sm leading-relaxed text-white/65">
              Frontend proof target: reviewers can see the request path, why
              Redis and RabbitMQ are used, queue state, checkout traces, and K6
              results that explain latency, throughput, and over-selling count.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
