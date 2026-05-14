"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/common/split-text";
import { AnimatedGridBackground } from "@/components/common/animated-grid-bg";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const floatingBadges = [
  { icon: ShieldCheck, label: "Stock", value: "Protected", x: "10%", y: "20%", delay: 0.2 },
  { icon: Clock3, label: "Checkout", value: "Quick", x: "85%", y: "25%", delay: 0.4 },
  { icon: BadgeCheck, label: "Orders", value: "Clear", x: "8%", y: "70%", delay: 0.6 },
  { icon: PackageCheck, label: "Updates", value: "Live", x: "88%", y: "65%", delay: 0.8 },
];

export function StorefrontHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
      <AnimatedGridBackground />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[#FF6600]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[#DC143C]/5 blur-[100px] pointer-events-none" />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto max-w-7xl px-6 py-32 md:py-40"
      >
        <div className="flex flex-col items-center text-center">
          {/* Live indicator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.3 }}
            className="mb-8 inline-flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#DC143C]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#DC143C]">
              Limited deals are live
            </span>
            <span className="h-px w-8 bg-[#DC143C]" />
          </motion.div>

          {/* Main headline */}
          <h1 className="max-w-5xl">
            <SplitText
              text="Shop fast."
              className="block text-[2.5rem] font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              delay={0.4}
              stagger={0.04}
            />
            <span className="mt-2 block">
              <SplitText
                text="Checkout faster."
                className="block text-[2.5rem] font-extrabold tracking-tight text-[#FF6600] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                delay={0.8}
                stagger={0.08}
                type="words"
              />
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 1.4 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Shop limited drops with clearer stock, faster checkout, and fewer
            frustrating surprises when demand spikes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 1.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden rounded-full bg-[#FF6600] px-8 text-base font-semibold text-white hover:bg-[#e65c00] transition-all duration-300"
            >
              <Link href="/flash-sale">
                <span className="relative z-10 flex items-center">
                  Enter Flash Sale
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-border px-8 text-base font-medium hover:bg-accent transition-all duration-300"
            >
              <Link href="/products">Browse Products</Link>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 1.8 }}
            className="mt-16 grid grid-cols-3 gap-8 md:gap-16"
          >
            {[
              { value: "Live", label: "Stock updates" },
              { value: "Fast", label: "Checkout flow" },
              { value: "0", label: "Surprise sellouts" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold tabular-nums text-foreground md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Floating badges with parallax */}
      {floatingBadges.map((badge) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: smoothEase, delay: badge.delay + 1 }}
          className="absolute hidden lg:flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm px-4 py-3"
          style={{ left: badge.x, top: badge.y }}
        >
          <badge.icon className="h-4 w-4 text-[#FF6600]" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {badge.label}
          </span>
          <span className="text-sm font-bold text-foreground">{badge.value}</span>
        </motion.div>
      ))}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-5 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
