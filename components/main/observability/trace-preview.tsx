"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCommitHorizontal,
  Search,
  Loader2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const smoothEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface Span {
  name: string;
  service: string;
  duration: string;
  depth: number;
  status: "ok" | "error";
}

const mockTrace: Span[] = [
  {
    name: "POST /v1/flash-sale/checkout",
    service: "api-gateway",
    duration: "18.4ms",
    depth: 0,
    status: "ok",
  },
  {
    name: "auth.middleware.verify",
    service: "auth-service",
    duration: "2.1ms",
    depth: 1,
    status: "ok",
  },
  {
    name: "rate_limiter.check",
    service: "api-gateway",
    duration: "0.8ms",
    depth: 1,
    status: "ok",
  },
  {
    name: "redis.lua.stock_gate",
    service: "flashsale-engine",
    duration: "3.2ms",
    depth: 1,
    status: "ok",
  },
  {
    name: "redis.decr stock:product_4821",
    service: "redis",
    duration: "0.9ms",
    depth: 2,
    status: "ok",
  },
  {
    name: "rabbitmq.publish order_91024",
    service: "rabbitmq",
    duration: "1.4ms",
    depth: 1,
    status: "ok",
  },
  {
    name: "queue.consume order_91024",
    service: "queue-worker",
    duration: "145.2ms",
    depth: 1,
    status: "ok",
  },
  {
    name: "db.insert orders",
    service: "postgresql",
    duration: "12.8ms",
    depth: 2,
    status: "ok",
  },
  {
    name: "db.update inventory",
    service: "postgresql",
    duration: "8.3ms",
    depth: 2,
    status: "ok",
  },
  {
    name: "notify.send email",
    service: "notification",
    duration: "56.1ms",
    depth: 2,
    status: "ok",
  },
];

const errorTrace: Span[] = [
  {
    name: "POST /v1/flash-sale/checkout",
    service: "api-gateway",
    duration: "45.2ms",
    depth: 0,
    status: "ok",
  },
  {
    name: "auth.middleware.verify",
    service: "auth-service",
    duration: "2.5ms",
    depth: 1,
    status: "ok",
  },
  {
    name: "redis.lua.stock_gate",
    service: "flashsale-engine",
    duration: "3.1ms",
    depth: 1,
    status: "ok",
  },
  {
    name: "redis.decr stock:product_9912",
    service: "redis",
    duration: "0.7ms",
    depth: 2,
    status: "ok",
  },
  {
    name: "rabbitmq.publish order_9912",
    service: "rabbitmq",
    duration: "1.2ms",
    depth: 1,
    status: "ok",
  },
  {
    name: "queue.consume order_9912",
    service: "queue-worker",
    duration: "245.8ms",
    depth: 1,
    status: "error",
  },
  {
    name: "db.insert orders",
    service: "postgresql",
    duration: "—",
    depth: 2,
    status: "error",
  },
];

function TraceTable({ trace, traceId }: { trace: Span[]; traceId: string }) {
  const total = trace.reduce((acc, s) => {
    const n = parseFloat(s.duration);
    return acc + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <GitCommitHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">
            Trace ID: {traceId}
          </span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          Total: {total > 0 ? `${total.toFixed(1)}ms` : "—"}
        </span>
      </div>

      <div className="p-4">
        <AnimatePresence mode="popLayout">
          {trace.map((span, i) => (
            <motion.div
              key={`${traceId}-${i}`}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{
                duration: 0.35,
                delay: i * 0.04,
                ease: smoothEase,
              }}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
            >
              <div className="shrink-0" style={{ width: span.depth * 24 }} />
              <motion.div
                animate={
                  span.status === "ok" ? { scale: [1, 1.35, 1] } : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`h-2 w-2 shrink-0 rounded-full ${
                  span.status === "ok"
                    ? "bg-emerald-700 dark:bg-[#39FF14]"
                    : "bg-[#DC143C]"
                }`}
              />
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                {span.name}
              </span>
              <span className="hidden w-24 shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
                {span.service}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {span.duration}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

export function TracePreview() {
  const [mode, setMode] = useState<"mock" | "real">("mock");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTrace, setActiveTrace] = useState<{
    spans: Span[];
    id: string;
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError(null);
    setActiveTrace(null);

    // Simulated API delay — replace with real trace backend later
    await new Promise((r) => setTimeout(r, 800));

    if (orderId.trim() === "91024") {
      setActiveTrace({ spans: mockTrace, id: `trace_${orderId}` });
    } else if (orderId.trim() === "9912") {
      setActiveTrace({ spans: errorTrace, id: `trace_${orderId}` });
    } else {
      setError(
        `No trace found for order "${orderId}". Try 91024 or 9912, or switch to Mock mode.`
      );
    }

    setLoading(false);
  };

  const showMock = () => {
    setMode("mock");
    setError(null);
    setActiveTrace(null);
  };

  const displayedTrace =
    mode === "mock"
      ? { spans: mockTrace, id: "trace_8f2a91d4" }
      : activeTrace;

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
            Distributed Tracing
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Trace Preview
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            End-to-end request flow across services. Search by order ID when
            backend tracing is available, or toggle mock data to preview the
            visualization.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setMode("mock");
                  setError(null);
                  setActiveTrace(null);
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  mode === "mock"
                    ? "border-[#FF6600]/30 bg-[#FF6600]/10 text-[#FF6600]"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {mode === "mock" ? (
                  <ToggleRight className="h-3.5 w-3.5" />
                ) : (
                  <ToggleLeft className="h-3.5 w-3.5" />
                )}
                Mock
              </button>
              <button
                onClick={() => {
                  setMode("real");
                  setError(null);
                  setActiveTrace(null);
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  mode === "real"
                    ? "border-[#FF6600]/30 bg-[#FF6600]/10 text-[#FF6600]"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {mode === "real" ? (
                  <ToggleRight className="h-3.5 w-3.5" />
                ) : (
                  <ToggleLeft className="h-3.5 w-3.5" />
                )}
                Real
              </button>
            </div>

            {mode === "real" && (
              <motion.form
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                transition={{ duration: 0.3, ease: smoothEase }}
                onSubmit={handleSearch}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Order ID..."
                    className="h-8 rounded-md border border-border bg-background pl-8 pr-3 text-xs font-mono text-foreground outline-none ring-ring placeholder:text-muted-foreground focus:border-[#FF6600]/40 focus:ring-1"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !orderId.trim()}
                  className="inline-flex h-8 items-center rounded-md border border-border bg-muted px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted/80 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Trace"
                  )}
                </button>
              </motion.form>
            )}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {mode === "real" && error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className="flex flex-col items-center justify-center gap-3 px-5 py-12"
              >
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{error}</p>
                <button
                  onClick={showMock}
                  className="text-xs font-medium text-[#FF6600] underline underline-offset-4 transition-opacity hover:opacity-80"
                >
                  Show mock trace instead
                </button>
              </motion.div>
            ) : mode === "real" && !activeTrace ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className="flex flex-col items-center justify-center gap-2 px-5 py-12"
              >
                <GitCommitHorizontal className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Enter an order ID above to search for its distributed trace.
                </p>
                <p className="text-xs text-muted-foreground">
                  Try <span className="font-mono">91024</span> or{" "}
                  <span className="font-mono">9912</span> for demo data.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={displayedTrace?.id ?? "mock"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {displayedTrace && (
                  <TraceTable
                    trace={displayedTrace.spans}
                    traceId={displayedTrace.id}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
