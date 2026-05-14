"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/common/marquee";
import {
  ArrowRight,
  Zap,
  Clock,
  TrendingUp,
  Shield,
  Users,
} from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card px-4 py-3 md:px-6 md:py-4">
        <motion.span
          key={value}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: smoothEase }}
          className="block text-3xl font-bold tabular-nums md:text-5xl lg:text-6xl"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 2, minutes: 14, seconds: 33 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 0;
          minutes = 0;
          seconds = 0;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3 md:gap-4">
      <CountdownUnit value={time.hours} label="Hours" />
      <span className="mt-3 text-2xl font-light text-muted-foreground md:mt-5 md:text-4xl">
        :
      </span>
      <CountdownUnit value={time.minutes} label="Minutes" />
      <span className="mt-3 text-2xl font-light text-muted-foreground md:mt-5 md:text-4xl">
        :
      </span>
      <CountdownUnit value={time.seconds} label="Seconds" />
    </div>
  );
}

export function ActiveFlashSale() {
  return (
    <section className="relative w-full overflow-hidden border-y border-border">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600]/3 via-transparent to-[#DC143C]/3" />

      {/* Marquee top */}
      <div className="relative border-b border-border/50 py-3">
        <Marquee
          items={[
            "Flash Sale Live",
            "Limited Deals",
            "Clear Stock",
            "Fast Checkout",
            "Order Updates",
            "No Surprise Sellouts",
          ]}
          speed={40}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Countdown & info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: smoothEase }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#DC143C] opacity-75" />
                <span className="relative inline-flex h-full w-full rounded-full bg-[#DC143C]" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#DC143C]">
                Live Campaign
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Weekend Tech Drop
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md">
              Up to 40% off electronics. See what is still available, move
              quickly, and know what happens after you place an order.
            </p>

            <div className="mt-8">
              <CountdownTimer />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#FF6600] px-8 text-base font-semibold text-white hover:bg-[#e65c00]"
              >
                <Link href="/flash-sale/1">
                  Enter Flash Sale
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-border px-8"
              >
                <Link href="/flash-sale">View All Campaigns</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: Live stats panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Drop Snapshot
                </h3>
                <Badge
                  variant="outline"
                  className="rounded-full border-emerald-700/30 text-emerald-700 text-xs dark:border-[#39FF14]/30 dark:text-[#39FF14]"
                >
                  <Shield className="mr-1 h-3 w-3" />
                  Stock Safe
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { icon: TrendingUp, label: "Items claimed", value: "4,200" },
                  { icon: Users, label: "Shopping now", value: "1,847" },
                  { icon: Zap, label: "Deals left", value: "1,247" },
                  { icon: Clock, label: "Checkout pace", value: "Fast" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/50 bg-background p-4"
                  >
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="mt-2 text-xl font-bold tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stock progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stock remaining</span>
                  <span className="font-semibold">847 / 2,000</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "42.35%" }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 1.5, ease: smoothEase }}
                    className="h-full rounded-full bg-[#FF6600]"
                  />
                </div>
              </div>
            </div>

            {/* Decorative floating element */}
            <div className="absolute -top-4 -right-4 hidden lg:block">
              <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Stock check
                </div>
                <div className="mt-1 text-sm font-bold text-emerald-700 dark:text-[#39FF14]">
                  Ready
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee bottom */}
      <div className="relative border-t border-border/50 py-3">
        <Marquee
          items={[
            "Order Status Clear",
            "Checkout Stays Fair",
            "Stock Updates Fast",
            "Busy Drops Handled",
            "Deals End On Time",
            "Buy With Confidence",
          ]}
          speed={40}
          direction="right"
        />
      </div>
    </section>
  );
}
