"use client";

import { useMemo, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useActiveFlashSale } from "@/lib/hooks/use-active-flash-sale";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Zap, Clock } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function FlashSaleLiveStats() {
  const { data: sale, isLoading } = useActiveFlashSale();

  const stats = useMemo(() => {
    if (!sale) return null;
    const items = sale.items ?? [];
    const totalStock = items.reduce((sum, item) => sum + item.sale_stock_quantity, 0);
    const totalClaimed = items.reduce((sum, item) => sum + item.sold_quantity + item.reserved_quantity, 0);
    const dealsLeft = items.filter((item) => (item.remaining_quantity ?? 0) > 0).length;
    const shoppingNow = Math.max(1, Math.floor(totalClaimed * 0.42));
    return { totalClaimed, shoppingNow, dealsLeft };
  }, [sale]);

  const statCards = [
    { icon: TrendingUp, label: "Items claimed", value: stats?.totalClaimed ?? 0 },
    { icon: Users, label: "Shopping now", value: stats?.shoppingNow ?? 0 },
    { icon: Zap, label: "Deals left", value: stats?.dealsLeft ?? 0 },
    { icon: Clock, label: "Checkout pace", value: "Fast", isText: true },
  ];

  return (
    <section className="relative w-full border-y border-border bg-card py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="mb-10 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
            Live momentum
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            The drop is moving
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.55, ease: smoothEase, delay: index * 0.06 }}
                whileHover={{ y: -6, borderColor: "rgba(255, 102, 0, 0.35)" }}
                className="rounded-2xl border border-border bg-background p-5 transition-colors duration-300"
              >
                <stat.icon className="h-5 w-5 text-[#FF6600]" />
                <div className="mt-3 text-2xl font-bold tabular-nums md:text-3xl">
                  {stat.isText ? stat.value : <AnimatedNumber value={stat.value as number} />}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: TrendingUp, label: "Items claimed", value: "—" },
              { icon: Users, label: "Shopping now", value: "—" },
              { icon: Zap, label: "Deals left", value: "—" },
              { icon: Clock, label: "Checkout pace", value: "Soon", isText: true },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: smoothEase, delay: index * 0.06 }}
                className="rounded-2xl border border-border/50 bg-background/50 p-5"
              >
                <stat.icon className="h-5 w-5 text-muted-foreground/40" />
                <div className="mt-3 text-2xl font-bold tabular-nums md:text-3xl text-muted-foreground/40">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
