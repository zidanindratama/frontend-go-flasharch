"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActiveFlashSale } from "@/lib/hooks/use-active-flash-sale";
import { getPublicFlashSaleItems, type FlashSaleItem } from "@/lib/api/flash-sale";
import { FlashSaleItemCard } from "./flash-sale-item-card";
import { ArrowDown, ArrowRight, Flame, TrendingUp, DollarSign, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sortOptions = [
  { value: "remaining_quantity-desc", label: "Most stock", icon: TrendingUp },
  { value: "sale_price_amount-asc", label: "Lowest price", icon: DollarSign },
  { value: "sold_quantity-desc", label: "Most popular", icon: Flame },
  { value: "created_at-desc", label: "Newest", icon: Clock },
];

function parseSortOption(value: string): { sort: string; order: "asc" | "desc" } {
  const [sort, order] = value.split("-");
  return {
    sort: sort ?? "remaining_quantity",
    order: order === "asc" ? "asc" : "desc",
  };
}

export function FlashSaleItemGrid() {
  const { data: sale, isLoading: isSaleLoading } = useActiveFlashSale();
  const [sortValue, setSortValue] = useState("remaining_quantity-desc");
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<FlashSaleItem[]>([]);

  const perPage = 12;
  const { sort, order } = parseSortOption(sortValue);

  const { data, isLoading: isItemsLoading, isError } = useQuery({
    queryKey: ["public-flash-sale-items", sale?.slug, page, perPage, sort, order],
    queryFn: async () => {
      if (!sale?.slug) return { items: [] as FlashSaleItem[], page: 1, per_page: perPage, total: 0 };
      const res = await getPublicFlashSaleItems(sale.slug, {
        page,
        per_page: perPage,
        sort,
        order,
      });
      return res.data.data;
    },
    enabled: !!sale?.slug,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setAccumulated(data.items);
      } else {
        setAccumulated((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = data.items.filter((item) => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
  }, [sortValue, sale?.slug]);

  const isLoading = isSaleLoading || (isItemsLoading && page === 1);
  const total = data?.total ?? 0;
  const hasMore = accumulated.length < total;

  return (
    <section id="deals" className="relative w-full py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
              Live deals
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Grab them before they are gone
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              {total > 0
                ? `${total.toLocaleString()} deals available. Stock updates in real time.`
                : "Loading the latest deals..."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortValue} onValueChange={setSortValue}>
              <SelectTrigger
                className={cn(
                  "h-12 gap-2 rounded-full border-border bg-background px-4 text-sm font-medium transition-all hover:border-[#FF6600]/30 focus:ring-[#FF6600]/20",
                )}
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                {sortOptions.map((option) => {
                  const OptionIcon = option.icon;
                  return (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="rounded-lg text-sm focus:bg-[#FF6600]/5 focus:text-[#FF6600]"
                    >
                      <span className="flex items-center gap-2">
                        <OptionIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        {option.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[360px] rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: smoothEase }}
            >
              <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Something went wrong</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Deals could not load this time. Try again in a moment.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full border-border"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
            </motion.div>
          </div>
        ) : accumulated.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: smoothEase }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6600]/20 bg-[#FF6600]/5 px-3 py-1 text-xs font-medium text-[#FF6600]">
                <Clock className="h-3 w-3" />
                Coming soon
              </span>
              <h3 className="mt-6 text-2xl font-bold tracking-tight">
                New drops are on the way
              </h3>
              <p className="mt-3 max-w-sm text-muted-foreground">
                This sale has ended or items are not live yet. Fresh deals drop
                regularly — stay close.
              </p>
              <Button
                asChild
                className="mt-8 rounded-full bg-[#FF6600] px-6 text-white hover:bg-[#e65c00]"
              >
                <Link href="/products">
                  Browse all products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {accumulated.map((item, i) => (
                <FlashSaleItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  disabled={isItemsLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border-border px-8"
                >
                  {isItemsLoading ? "Loading..." : "Load more deals"}
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
