"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useActiveFlashSale } from "@/lib/hooks/use-active-flash-sale";
import { Skeleton } from "@/components/ui/skeleton";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FlashSaleProgressBar() {
  const { data: sale, isLoading } = useActiveFlashSale();

  const stats = useMemo(() => {
    if (!sale) return null;
    const items = sale.items ?? [];
    const totalStock = items.reduce((sum, item) => sum + item.sale_stock_quantity, 0);
    const totalSold = items.reduce((sum, item) => sum + item.sold_quantity + item.reserved_quantity, 0);
    const totalRemaining = Math.max(0, totalStock - totalSold);
    const claimedPercent = totalStock > 0 ? (totalSold / totalStock) * 100 : 0;
    return { totalStock, totalSold, totalRemaining, claimedPercent };
  }, [sale]);

  return (
    <section className="relative w-full border-b border-border bg-card py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-6">
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-3 w-full" />
          </div>
        ) : stats ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.7, ease: smoothEase }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-semibold text-foreground">
                {stats.totalSold.toLocaleString()} items claimed
              </span>
              <span className="text-muted-foreground">
                {stats.totalRemaining.toLocaleString()} remaining
              </span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(stats.claimedPercent, 100)}%` }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 1.2, ease: smoothEase }}
                className="h-full rounded-full bg-gradient-to-r from-[#FF6600] to-[#DC143C]"
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Stock moves fast. Refresh to see the latest numbers.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: smoothEase }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-semibold text-foreground">Next drop loading</span>
              <span className="text-muted-foreground">Stay tuned</span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-0 rounded-full bg-[#FF6600]/30" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              New deals are on the way. Check back soon.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
