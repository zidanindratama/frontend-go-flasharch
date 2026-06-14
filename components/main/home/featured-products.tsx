"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowUpRight,
  Headphones,
  HardDrive,
  Watch,
  Cable,
  Package,
  Loader2,
} from "lucide-react";
import { listProducts } from "@/lib/api/catalog";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const iconMap = [HardDrive, Cable, Headphones, Watch];

function StockBadge({ stock, count }: { stock: string; count: number }) {
  if (stock === "sold_out") {
    return (
      <Badge variant="secondary" className="rounded-full text-xs">
        Sold Out
      </Badge>
    );
  }
  if (stock === "limited") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-[#DC143C]/30 text-[#DC143C] text-xs"
      >
        {count} left
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full border border-[#2f7d1c]/20 bg-[#2f7d1c]/10 text-xs text-[#1f6b12] hover:bg-[#2f7d1c]/15 dark:border-[#39FF14]/20 dark:bg-[#39FF14]/10 dark:text-[#39FF14] dark:hover:bg-[#39FF14]/20">
      In Stock
    </Badge>
  );
}

function HomeProductCard({
  product,
  index,
  size,
}: {
  product: any;
  index: number;
  size: "large" | "small" | "wide";
}) {
  const Icon = iconMap[index % iconMap.length];
  const stockCount = product.stock_quantity ?? 0;
  const stockStatus =
    stockCount === 0 ? "sold_out" : stockCount <= 10 ? "limited" : "available";
  const categoryNames =
    product.categories?.map((c: any) => c.name).join(", ") || "";

  const sizeClasses: Record<string, string> = {
    large: "md:col-span-2 md:row-span-2",
    small: "md:col-span-1 md:row-span-1",
    wide: "md:col-span-2 md:row-span-1",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.65, ease: smoothEase, delay: index * 0.06 }}
      className={`group relative min-h-[260px] ${sizeClasses[size] || ""}`}
    >
      <Link href={`/products/${product.slug}`} className="block h-full">
        <div
          className={`relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:border-[#FF6600]/30 ${
            size === "large"
              ? "aspect-[4/3] md:aspect-auto md:min-h-full"
              : size === "wide"
              ? "aspect-[4/3] md:aspect-auto md:min-h-full"
              : "aspect-[4/3] md:aspect-auto md:min-h-full"
          }`}
        >
          {/* Image or icon placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            {product.thumbnail_url ? (
              <img
                src={product.thumbnail_url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#FF6600]/5 blur-3xl scale-150 group-hover:scale-200 transition-transform duration-700" />
                <Icon className="relative h-14 w-14 text-muted-foreground/30 transition-colors duration-500 group-hover:text-[#FF6600]/40 md:h-24 md:w-24" />
              </div>
            )}
          </div>

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100" />

          {/* Top right badge */}
          <div className="absolute top-4 right-4">
            <StockBadge stock={stockStatus} count={stockCount} />
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <p className="text-xs font-medium uppercase tracking-wider text-white/70 drop-shadow-sm">
              {categoryNames || "Product"}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white drop-shadow-md">
              {product.name}
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#FF6600] drop-shadow-sm">
                {product.base_price_amount?.toLocaleString()}
              </span>
              <span className="text-xs text-white/60 drop-shadow-sm">
                {product.currency}
              </span>
            </div>
          </div>

          {/* Corner arrow */}
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6600] text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-products", "popular"],
    queryFn: async () => {
      const res = await listProducts({
        sort: "popularity",
        order: "desc",
        per_page: 4,
        status: "active",
      });
      return res.data.data.items;
    },
    staleTime: 60_000,
  });

  const sizes: Array<"large" | "small" | "small" | "wide"> = [
    "large",
    "small",
    "small",
    "wide",
  ];

  return (
    <section className="relative w-full py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
              Featured
            </span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Popular right now
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Products with the most completed purchases, sorted by real buyer
              activity.
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="group w-fit rounded-full text-[#FF6600] hover:text-[#FF6600] hover:bg-[#FF6600]/5"
          >
            <Link href="/products?sort=popularity">
              View all products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Asymmetric grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-[220px_220px] lg:grid-rows-[260px_260px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-2xl border border-border bg-card ${
                  sizes[i] === "large"
                    ? "md:col-span-2 md:row-span-2"
                    : sizes[i] === "wide"
                    ? "md:col-span-2 md:row-span-1"
                    : ""
                }`}
              />
            ))}
          </div>
        ) : isError || !data?.length ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20">
            <p className="text-sm text-muted-foreground">
              No products found yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-[220px_220px] lg:grid-rows-[260px_260px]">
            {data.map((product: any, i: number) => (
              <HomeProductCard
                key={product.id}
                product={product}
                index={i}
                size={sizes[i] || "small"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
