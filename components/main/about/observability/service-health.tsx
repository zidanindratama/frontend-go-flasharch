"use client";

import { motion } from "framer-motion";
import {
  Server,
  Database,
  HardDrive,
  Wifi,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const smoothEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface Service {
  name: string;
  role: string;
  status: "healthy" | "degraded" | "down";
  latency: string;
  uptime: string;
  icon: React.ElementType;
}

const services: Service[] = [
  {
    name: "API Gateway",
    role: "HTTP ingress & rate limiting",
    status: "healthy",
    latency: "12ms",
    uptime: "99.97%",
    icon: Server,
  },
  {
    name: "Auth Service",
    role: "JWT validation & sessions",
    status: "healthy",
    latency: "8ms",
    uptime: "99.99%",
    icon: ShieldCheck,
  },
  {
    name: "Product Catalog",
    role: "Inventory & pricing queries",
    status: "healthy",
    latency: "24ms",
    uptime: "99.95%",
    icon: Database,
  },
  {
    name: "Flash Sale Engine",
    role: "Redis stock gate & checkout",
    status: "healthy",
    latency: "3ms",
    uptime: "99.99%",
    icon: Cpu,
  },
  {
    name: "Queue Worker",
    role: "RabbitMQ order consumers",
    status: "degraded",
    latency: "145ms",
    uptime: "99.82%",
    icon: HardDrive,
  },
  {
    name: "Notification",
    role: "Email & webhook dispatch",
    status: "healthy",
    latency: "56ms",
    uptime: "99.91%",
    icon: Wifi,
  },
];

function StatusBadge({ status }: { status: Service["status"] }) {
  const config = {
    healthy: {
      dot: "bg-emerald-700 dark:bg-[#39FF14]",
      text: "text-emerald-700 dark:text-[#39FF14]",
      label: "Healthy",
    },
    degraded: {
      dot: "bg-[#FF6600]",
      text: "text-[#FF6600]",
      label: "Degraded",
    },
    down: {
      dot: "bg-[#DC143C]",
      text: "text-[#DC143C]",
      label: "Down",
    },
  };
  const c = config[status];
  return (
    <div className="flex items-center gap-2">
      <motion.span
        animate={status === "healthy" ? { scale: [1, 1.35, 1] } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn("h-2 w-2 rounded-full", c.dot)}
      />
      <span className={cn("text-xs font-medium", c.text)}>{c.label}</span>
    </div>
  );
}

function StatusIcon({ status }: { status: Service["status"] }) {
  if (status === "healthy")
    return <ShieldCheck className="h-5 w-5 text-emerald-700 dark:text-[#39FF14]" />;
  if (status === "degraded")
    return <AlertTriangle className="h-5 w-5 text-[#FF6600]" />;
  return <XCircle className="h-5 w-5 text-[#DC143C]" />;
}

export function ServiceHealth() {
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
            Service Health
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            System Status
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Real-time health checks across core services. Data is aggregated
            from periodic heartbeat probes.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: smoothEase,
              }}
              whileHover={{ y: -3, transition: { duration: 0.25, ease: smoothEase } }}
              className="group relative rounded-xl border border-border bg-card p-5 transition-colors hover:border-[#FF6600]/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"
                  >
                    <service.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#FF6600]" />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-semibold">{service.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {service.role}
                    </p>
                  </div>
                </div>
                <StatusIcon status={service.status} />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Status
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={service.status} />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Latency
                  </p>
                  <p className="mt-1 font-mono text-sm font-medium">
                    {service.latency}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Uptime
                  </p>
                  <p className="mt-1 font-mono text-sm font-medium">
                    {service.uptime}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
