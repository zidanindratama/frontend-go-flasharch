"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useActiveFlashSale } from "@/lib/hooks/use-active-flash-sale";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Zap, Package, Clock } from "lucide-react";

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

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const target = useMemo(() => new Date(endsAt).getTime(), [endsAt]);
  const [time, setTime] = useState(() => {
    const diff = Math.max(0, target - Date.now());
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

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

export function FlashSaleHero() {
  const { data: sale, isLoading, isError } = useActiveFlashSale();

  return (
    <section className="relative w-full overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600]/3 via-transparent to-[#DC143C]/3" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-full max-w-md" />
              <Skeleton className="h-24 w-full max-w-sm" />
              <Skeleton className="h-14 w-48" />
            </div>
          ) : isError || !sale ? (
            <>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: smoothEase }}
              >
                <Badge
                  variant="outline"
                  className="rounded-full border-[#FF6600]/25 bg-[#FF6600]/5 px-3 py-1 text-xs font-medium text-[#FF6600]"
                >
                  <Zap className="mr-1 h-3 w-3" />
                  Next drop loading
                </Badge>

                <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  Something big is coming
                </h1>
                <p className="mt-4 max-w-md text-muted-foreground">
                  We are lining up the next set of deals. Hang tight — fresh drops
                  land regularly and every one of them is worth the wait.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-[#FF6600] px-8 text-base font-semibold text-white hover:bg-[#e65c00]"
                  >
                    <Link href="/products">
                      Browse products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Upcoming drop
                    </h3>
                    <Badge
                      variant="outline"
                      className="rounded-full border-[#FF6600]/25 bg-[#FF6600]/5 text-xs text-[#FF6600]"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Coming soon
                    </Badge>
                  </div>

                  <div className="mt-8 flex flex-col items-center justify-center py-6">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="h-12 w-12 text-muted-foreground/30" />
                    </motion.div>
                    <p className="mt-4 max-w-xs text-center text-sm text-muted-foreground">
                      The next flash sale is being prepared. New deals drop every
                      week.
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <>
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
                    Live Now
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  {sale.name}
                </h1>
                <p className="mt-4 max-w-md text-muted-foreground">
                  {sale.description ||
                    "Grab it before it is gone. Stock is real, speed matters."}
                </p>

                <div className="mt-8">
                  <CountdownTimer endsAt={sale.ends_at} />
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-[#FF6600] px-8 text-base font-semibold text-white hover:bg-[#e65c00]"
                  >
                    <Link href="#deals">
                      Shop the drop
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

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
                      Drop snapshot
                    </h3>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#2f7d1c]/20 bg-[#2f7d1c]/10 px-3 py-1 text-xs font-medium text-[#1f6b12] dark:border-[#39FF14]/20 dark:bg-[#39FF14]/10 dark:text-[#39FF14]">
                      <Zap className="h-3 w-3" />
                      Active
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {[
                      {
                        icon: Package,
                        label: "Total items",
                        value: sale.items?.length ?? 0,
                      },
                      {
                        icon: Clock,
                        label: "Ends at",
                        value: new Date(sale.ends_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      },
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
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
