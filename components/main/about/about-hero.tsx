"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,102,0,0.10),transparent_32%),radial-gradient(circle_at_80%_40%,rgba(220,20,60,0.08),transparent_28%)]" />
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[#FF6600]"
          >
            <span className="h-px w-9 bg-[#FF6600]" />
            Thesis Companion
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.15 }}
            className="mt-8 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            A flash sale backend that stays safe when traffic peaks.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.3 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Go FlashArch is an e-commerce frontend built to demonstrate a
            thesis on high-performance backend architecture for flash sale
            systems through Redis, RabbitMQ, PostgreSQL, and centralized
            observability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.45 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#FF6600] px-7 text-white hover:bg-[#e65c00]"
            >
              <Link href="/architecture">
                View Architecture
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link href="/load-test">Load Test Evidence</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: smoothEase, delay: 0.25 }}
          className="relative rounded-3xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="rounded-2xl border border-border bg-background p-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Thesis Title
                </p>
                <h2 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
                  Perancangan Arsitektur Backend High-Performance pada Sistem
                  Flash Sale
                </h2>
              </div>
              <BookOpen className="h-6 w-6 shrink-0 text-[#FF6600]" />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["Author", "Muhamad Zidan Indratama"],
                ["NPM", "50422968"],
                ["Program", "Informatics"],
                ["University", "Universitas Gunadarma"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-muted/45 p-4 text-foreground">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#2f7d1c] dark:text-[#39FF14]" />
              <p className="text-sm font-medium text-muted-foreground">
                Core focus: prevent over-selling and keep the database stable
                during concurrent checkout pressure.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
