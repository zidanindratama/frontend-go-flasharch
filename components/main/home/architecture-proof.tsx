"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/common/split-text";
import {
  ArrowRight,
  Server,
  Layers,
  Database,
  HardDrive,
  Activity,
} from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const flowSteps = [
  { label: "Frontend", icon: Server, desc: "Request" },
  { label: "API", icon: Layers, desc: "Validate" },
  { label: "Redis", icon: Database, desc: "Atomic Gate" },
  { label: "RabbitMQ", icon: Layers, desc: "Buffer" },
  { label: "Worker", icon: Server, desc: "Process" },
  { label: "PostgreSQL", icon: HardDrive, desc: "Persist" },
  { label: "LGTP", icon: Activity, desc: "Observe" },
];

function ArchitectureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes = flowSteps.map((_, i) => ({
      x: ((i + 0.5) / flowSteps.length) * canvas.width,
      y: canvas.height / 2,
      baseX: ((i + 0.5) / flowSteps.length) * canvas.width,
    }));

    const draw = () => {
      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node positions with sine wave
      nodes.forEach((node, i) => {
        node.x = node.baseX + Math.sin(time + i * 0.8) * 8;
        node.y = canvas.height / 2 + Math.cos(time * 0.7 + i * 1.2) * 12;
      });

      // Draw connections
      for (let i = 0; i < nodes.length - 1; i++) {
        const start = nodes[i];
        const end = nodes[i + 1];

        // Animated packet
        const progress = (time * 0.5 + i * 0.15) % 1;
        const px = start.x + (end.x - start.x) * progress;
        const py = start.y + (end.y - start.y) * progress;

        // Connection line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = "rgba(255, 102, 0, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Packet dot
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FF6600";
        ctx.fill();

        // Packet glow
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 102, 0, 0.2)";
        ctx.fill();
      }

      // Draw nodes
      nodes.forEach((node, i) => {
        const isCritical = flowSteps[i].label === "Redis" || flowSteps[i].label === "RabbitMQ";

        // Glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, isCritical ? 20 : 14, 0, Math.PI * 2);
        ctx.fillStyle = isCritical
          ? "rgba(255, 102, 0, 0.1)"
          : "rgba(255, 255, 255, 0.03)";
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, isCritical ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isCritical ? "#FF6600" : "rgba(255,255,255,0.3)";
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export function ArchitectureProof() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.2, 0.6], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#0a0a0a] py-24 md:py-32"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]"
          >
            System Architecture
          </motion.span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-white">
            <SplitText
              text="Built for pressure"
              delay={0.2}
              stagger={0.03}
            />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.6 }}
            className="mt-6 max-w-2xl mx-auto text-muted-foreground"
          >
            Every checkout follows a validated path. Redis guards stock.
            RabbitMQ absorbs spikes. Workers persist safely. Observability
            keeps it all visible.
          </motion.p>
        </div>

        {/* Animated architecture flow */}
        <div className="relative mb-8 h-[180px] md:mb-16 md:h-[280px]">
          <ArchitectureCanvas />

          {/* Desktop labels below canvas */}
          <div className="absolute bottom-0 left-0 right-0 hidden justify-between px-2 md:flex">
            {flowSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.6, ease: smoothEase, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <step.icon
                  className={`h-5 w-5 ${
                    step.label === "Redis" || step.label === "RabbitMQ"
                      ? "text-[#FF6600]"
                      : "text-white/40"
                  }`}
                />
                <span className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile request rail keeps the flow readable without falling back to generic cards. */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mb-12 md:hidden"
        >
          <div className="mb-4 flex items-center justify-between border-y border-white/10 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
              Checkout route
            </span>
            <span className="font-mono text-[10px] text-[#FF6600]">
              async_safe=true
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-[21px] top-5 bottom-5 w-px bg-gradient-to-b from-transparent via-white/18 to-transparent" />
            {flowSteps.map((step, index) => {
              const isGate = step.label === "Redis" || step.label === "RabbitMQ";

              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.45 }}
                  transition={{ duration: 0.5, ease: smoothEase, delay: index * 0.045 }}
                  className="relative flex items-center gap-4 py-3"
                >
                  <div
                    className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-[#0a0a0a] ${
                      isGate
                        ? "border-[#FF6600]/35 text-[#FF6600] shadow-[0_0_24px_rgba(255,102,0,0.12)]"
                        : "border-white/12 text-white/45"
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1 border-b border-white/10 py-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-lg font-bold uppercase tracking-tight text-white/85">
                        {step.label}
                      </h3>
                      <span className="font-mono text-[10px] text-white/30">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="text-sm text-white/42">{step.desc}</p>
                      {isGate && (
                        <span className="shrink-0 rounded-full border border-[#FF6600]/25 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-[#FF6600]">
                          gate
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Progress line */}
        <div className="relative h-px w-full bg-white/10 mb-16">
          <motion.div
            style={{ width: lineWidth }}
            className="absolute inset-y-0 left-0 bg-[#FF6600]"
          />
        </div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { label: "P95 Latency", value: "42ms", color: "#F6B73C" },
            { label: "Throughput", value: "8,400 rps", color: "#FF6600" },
            { label: "Oversell Count", value: "0", color: "#39FF14" },
            { label: "Queue Depth", value: "1,247", color: "#DC143C" },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, ease: smoothEase, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#FF6600]/30 transition-colors duration-500"
            >
              <div className="text-xs font-medium uppercase tracking-widest text-white/40">
                {metric.label}
              </div>
              <div
                className="mt-3 text-3xl font-bold tabular-nums"
                style={{ color: metric.color }}
              >
                {metric.value}
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                style={{ backgroundColor: metric.color }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="mt-12 text-center"
        >
          <Button
            asChild
            variant="ghost"
            className="rounded-full border border-white/20 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/about/architecture">
              Explore full architecture
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
