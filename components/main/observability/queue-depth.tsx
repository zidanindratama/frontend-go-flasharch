"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Layers } from "lucide-react";

const smoothEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface QueueMetric {
  name: string;
  depth: number;
  max: number;
  consumers: number;
  throughput: string;
}

const queues: QueueMetric[] = [
  {
    name: "flashsale.orders",
    depth: 1_247,
    max: 10_000,
    consumers: 8,
    throughput: "412 / sec",
  },
  {
    name: "flashsale.payments",
    depth: 89,
    max: 5_000,
    consumers: 4,
    throughput: "198 / sec",
  },
  {
    name: "flashsale.notifications",
    depth: 3_412,
    max: 20_000,
    consumers: 6,
    throughput: "670 / sec",
  },
  {
    name: "flashsale.stock.updates",
    depth: 12,
    max: 2_000,
    consumers: 2,
    throughput: "56 / sec",
  },
];

function AnimatedCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

function QueueBar({
  depth,
  max,
}: {
  depth: number;
  max: number;
}) {
  const pct = Math.min((depth / max) * 100, 100);
  const color =
    pct > 80
      ? "bg-[#DC143C]"
      : pct > 50
        ? "bg-[#FF6600]"
        : "bg-emerald-700 dark:bg-[#39FF14]";

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: smoothEase }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

export function QueueDepth() {
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
            Message Queue
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Queue Depth
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            RabbitMQ queue backlog and consumer throughput. High depth with
            sustained throughput indicates healthy buffering under load.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {queues.map((queue, i) => (
            <motion.div
              key={queue.name}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"
                  >
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                  <div>
                    <h3 className="font-mono text-sm font-semibold">
                      {queue.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {queue.consumers} active consumers
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-bold">
                    <AnimatedCount value={queue.depth} />
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    messages
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <QueueBar depth={queue.depth} max={queue.max} />
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span className="font-mono">{queue.throughput}</span>
                  <span>{queue.max.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
