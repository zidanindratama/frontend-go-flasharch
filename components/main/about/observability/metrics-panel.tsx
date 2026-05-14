"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const smoothEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface Metric {
  name: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "flat";
  change: string;
  data: number[];
}

const metrics: Metric[] = [
  {
    name: "Requests / sec",
    value: "2,847",
    unit: "req/s",
    trend: "up",
    change: "+12.4%",
    data: [40, 55, 45, 70, 60, 80, 75, 90, 85, 100],
  },
  {
    name: "Avg Response Time",
    value: "18",
    unit: "ms",
    trend: "down",
    change: "-4.2%",
    data: [60, 55, 50, 45, 48, 40, 38, 35, 32, 30],
  },
  {
    name: "Error Rate",
    value: "0.04",
    unit: "%",
    trend: "flat",
    change: "+0.01%",
    data: [20, 18, 22, 20, 19, 21, 20, 20, 19, 20],
  },
  {
    name: "Active Connections",
    value: "14,203",
    unit: "conn",
    trend: "up",
    change: "+8.7%",
    data: [30, 40, 35, 50, 55, 60, 58, 70, 75, 80],
  },
];

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const numeric = parseFloat(value.replace(/,/g, ""));
    const isFloat = value.includes(".");
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numeric * eased;
      setDisplay(
        isFloat
          ? current.toFixed(2)
          : Math.floor(current).toLocaleString()
      );
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

function Sparkline({ data, trend }: { data: number[]; trend: Metric["trend"] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 40;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return [x, y] as const;
  });

  const d = points.reduce((acc, [x, y], i) => {
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  const color =
    trend === "up"
      ? "#047857"
      : trend === "down"
        ? "#FF6600"
        : "#888888";
  const darkColor =
    trend === "up"
      ? "#39FF14"
      : trend === "down"
        ? "#FF6600"
        : "#888888";

  const last = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        className="dark:stroke-[var(--dark-stroke)]"
        style={{ "--dark-stroke": darkColor } as React.CSSProperties}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />
      <motion.circle
        cx={last[0]}
        cy={last[1]}
        r="2.5"
        fill={color}
        className="dark:fill-[var(--dark-stroke)]"
        style={{ "--dark-stroke": darkColor } as React.CSSProperties}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 1 }}
      />
    </svg>
  );
}

function TrendBadge({
  trend,
  change,
}: {
  trend: Metric["trend"];
  change: string;
}) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const color =
    trend === "up"
      ? "text-emerald-700 dark:text-[#39FF14]"
      : trend === "down"
        ? "text-[#FF6600]"
        : "text-muted-foreground";

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon className="h-3 w-3" />
      <span>{change}</span>
    </div>
  );
}

export function MetricsPanel() {
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
            Throughput
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Key Metrics
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Aggregated request volume, latency percentiles, and error rates
            over the last 10 minutes.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: smoothEase,
              }}
              whileHover={{ y: -3, transition: { duration: 0.25, ease: smoothEase } }}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-[#FF6600]/20"
            >
              <p className="text-xs text-muted-foreground">{metric.name}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  <AnimatedNumber value={metric.value} />
                </span>
                <span className="text-xs text-muted-foreground">
                  {metric.unit}
                </span>
              </div>
              <div className="mt-3">
                <TrendBadge trend={metric.trend} change={metric.change} />
              </div>
              <div className="mt-4 flex justify-end">
                <Sparkline data={metric.data} trend={metric.trend} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
