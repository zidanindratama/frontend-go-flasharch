"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

const smoothEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  service: string;
  message: string;
}

const logs: LogEntry[] = [
  {
    timestamp: "14:32:01.244",
    level: "INFO",
    service: "api-gateway",
    message: "POST /v1/flash-sale/checkout — 201 Created (18ms)",
  },
  {
    timestamp: "14:32:01.198",
    level: "INFO",
    service: "flashsale-engine",
    message: "Stock decremented: product_4821 → 17 remaining",
  },
  {
    timestamp: "14:32:00.945",
    level: "WARN",
    service: "queue-worker",
    message: "Consumer lag detected on flashsale.orders (>200ms)",
  },
  {
    timestamp: "14:32:00.901",
    level: "INFO",
    service: "rabbitmq",
    message: "Message ack: order_91024 queued for processing",
  },
  {
    timestamp: "14:32:00.887",
    level: "INFO",
    service: "redis",
    message: "Lua EVALSHA hit: stock_gate script (0.8ms)",
  },
  {
    timestamp: "14:32:00.812",
    level: "INFO",
    service: "auth-service",
    message: "Token validated: user_7721 (0.4ms)",
  },
  {
    timestamp: "14:31:59.445",
    level: "ERROR",
    service: "notification",
    message: "SMTP timeout: retry 2/3 for order_91020",
  },
  {
    timestamp: "14:31:58.201",
    level: "INFO",
    service: "product-catalog",
    message: "Cache warm: 1,247 products refreshed",
  },
  {
    timestamp: "14:31:57.993",
    level: "INFO",
    service: "api-gateway",
    message: "GET /v1/products/featured — 200 OK (12ms)",
  },
  {
    timestamp: "14:31:57.842",
    level: "WARN",
    service: "api-gateway",
    message: "Rate limit approaching: 198/200 req/min for ip_10.0.4.12",
  },
];

const levelStyles = {
  INFO: "text-emerald-700 dark:text-[#39FF14]",
  WARN: "text-[#FF6600]",
  ERROR: "text-[#DC143C]",
};

export function LogStream() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Log Aggregation
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Live Log Stream
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Structured logs from all services, collected via the centralized
            logging pipeline. Last 10 entries shown.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              /var/log/flasharch/aggregated.log
            </span>
          </div>
          <div className="max-h-[420px] overflow-y-auto p-2">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.04,
                  ease: smoothEase,
                }}
                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                className="flex items-start gap-4 rounded-lg px-3 py-2 font-mono text-xs transition-colors hover:bg-muted/50"
              >
                <span className="shrink-0 text-muted-foreground">
                  {log.timestamp}
                </span>
                <span
                  className={`shrink-0 w-12 font-bold ${levelStyles[log.level]}`}
                >
                  {log.level}
                </span>
                <span className="shrink-0 w-28 text-muted-foreground">
                  [{log.service}]
                </span>
                <span className="break-all text-foreground">{log.message}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
