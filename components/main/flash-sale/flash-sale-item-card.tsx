"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlashSaleItem } from "@/lib/api/flash-sale";
import { HardDrive, ArrowUpRight } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const iconRotation = [HardDrive];

export function FlashSaleItemCard({ item, index }: { item: FlashSaleItem; index: number }) {
  const Icon = iconRotation[index % iconRotation.length];
  const remaining = item.remaining_quantity ?? Math.max(0, item.sale_stock_quantity - item.reserved_quantity - item.sold_quantity);
  const claimedPercent = item.sale_stock_quantity > 0
    ? ((item.sale_stock_quantity - remaining) / item.sale_stock_quantity) * 100
    : 0;

  let stockLabel = "In stock";
  let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";
  if (remaining <= 0) {
    stockLabel = "Sold out";
    badgeVariant = "secondary";
  } else if (remaining <= item.sale_stock_quantity * 0.1) {
    stockLabel = `Only ${remaining} left`;
    badgeVariant = "destructive";
  } else if (remaining <= item.sale_stock_quantity * 0.3) {
    stockLabel = `Almost gone`;
    badgeVariant = "outline";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: smoothEase, delay: (index % 12) * 0.05 }}
      whileHover={{ y: -6, borderColor: "rgba(255, 102, 0, 0.35)" }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300"
    >
      <Link href={`/products/${item.product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#FF6600]/5 blur-3xl scale-150 group-hover:scale-200 transition-transform duration-700" />
              <Icon className="relative h-16 w-16 text-muted-foreground/30 transition-colors duration-500 group-hover:text-[#FF6600]/40" />
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant={badgeVariant} className="rounded-full text-xs">
              {stockLabel}
            </Badge>
          </div>
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6600] text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {item.product.sku}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-tight">{item.product.name}</h3>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#FF6600]">
              {item.sale_price_amount.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">{item.currency}</span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{remaining.toLocaleString()} left</span>
              <span className="font-medium">{Math.round(claimedPercent)}% claimed</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(claimedPercent, 100)}%` }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.8, ease: smoothEase }}
                className="h-full rounded-full bg-[#FF6600]"
              />
            </div>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <Button
          asChild
          disabled={remaining <= 0}
          className="w-full rounded-full bg-[#FF6600] text-white hover:bg-[#e65c00] disabled:opacity-50"
        >
          <Link href={`/products/${item.product.slug}`}>{remaining <= 0 ? "Sold out" : "Claim now"}</Link>
        </Button>
      </div>
    </motion.div>
  );
}
