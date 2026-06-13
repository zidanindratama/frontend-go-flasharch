"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Package,
  ListChecks,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getProduct, listProductReviews, listProducts } from "@/lib/api/catalog"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/components/dashboard/products/product-utils"
import type { Product } from "@/lib/api/catalog"
import { ProductReviews } from "./product-reviews"
import { RelatedProducts } from "./related-products"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
}

const flowSteps = [
  {
    label: "Stock checked",
    value: "Availability is confirmed before checkout continues.",
    icon: ShieldCheck,
    tone: "text-emerald-700",
  },
  {
    label: "Order lined up",
    value: "Busy sale traffic is handled in a clear order.",
    icon: ListChecks,
    tone: "text-primary",
  },
  {
    label: "Checkout reviewed",
    value: "The order is processed without rushing stock changes.",
    icon: ReceiptText,
    tone: "text-[var(--warning)]",
  },
  {
    label: "Result confirmed",
    value: "You get a clear status: confirmed, waiting, or sold out.",
    icon: CheckCircle2,
    tone: "text-emerald-700",
  },
]

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < Math.round(rating)
                ? "fill-primary text-primary"
                : "text-muted-foreground/45",
            )}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-foreground">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm text-muted-foreground">
        {count} {count === 1 ? "review" : "reviews"}
      </span>
    </div>
  )
}

function ProductGallery({ product }: { product: Product }) {
  const images = product.images?.length
    ? product.images
    : product.thumbnail_url
      ? [
          {
            id: "thumb",
            url: product.thumbnail_url,
            alt_text: product.name,
            sort_order: 0,
            product_id: product.id,
            file_id: "",
            created_at: "",
          },
        ]
      : []
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="relative flex aspect-[5/4] min-h-[360px] w-full items-center justify-center overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
        <div className="absolute inset-6 rounded-xl border border-dashed border-border" />
        <Package className="size-14 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="grid gap-3 md:gap-4 lg:grid-cols-[5.5rem_minmax(0,1fr)]">
      {images.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border bg-card transition-all duration-300 ease-out sm:size-20",
                activeIndex === i
                  ? "border-primary opacity-100 shadow-sm shadow-primary/20"
                  : "border-border opacity-55 hover:opacity-100",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={img.url}
                alt={img.alt_text || product.name}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="order-1 lg:order-2">
        <div className="relative aspect-[4/3] min-h-[260px] overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10 sm:min-h-[360px] lg:aspect-[5/4]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_oklch,var(--ops-grid)_55%,transparent)_1px,transparent_1px)] bg-[length:auto,28px_28px]" />
          <AnimatePresence mode="wait">
            <motion.img
              key={images[activeIndex].id}
              src={images[activeIndex].url}
              alt={images[activeIndex].alt_text || product.name}
              className="relative z-10 size-full object-cover mix-blend-normal"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.42, ease: smoothEase }}
            />
          </AnimatePresence>

          <div className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-lg shadow-foreground/10 ring-1 ring-border sm:left-4 sm:top-4">
            <ShieldCheck className="size-3.5 text-emerald-700" />
            Stock checked first
          </div>

          {images.length > 1 && (
            <div className="absolute right-3 top-3 z-20 flex gap-2 sm:right-4 sm:top-4">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() =>
                  setActiveIndex((i) => (i - 1 + images.length) % images.length)
                }
                aria-label="Previous product image"
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
                aria-label="Next product image"
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Checkout confidence
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                Stock is checked before your order is accepted.
              </p>
            </div>
            <span className="w-fit text-sm font-medium text-emerald-700">
              No over-selling
            </span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {flowSteps.map((step) => (
              <div
                key={step.label}
                className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 sm:flex-col sm:items-start"
              >
                <step.icon className={cn("size-4 shrink-0", step.tone)} />
                <p className="truncate text-xs font-medium text-foreground">
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <Badge className="bg-[var(--health)]/12 text-[var(--health)] hover:bg-[var(--health)]/12">
        Available
      </Badge>
    )
  }

  if (status === "draft") {
    return <Badge variant="secondary">Draft</Badge>
  }

  return <Badge variant="destructive">Archived</Badge>
}

function ProductCommandPanel({ product }: { product: Product }) {
  const active = product.status === "active"
  const category = product.categories?.[0]

  return (
    <Card className="border-border/80 bg-card/96 shadow-2xl shadow-primary/5 lg:sticky lg:top-28">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={product.status} />
          {category && (
            <Link href={`/products?category=${category.slug}`}>
              <Badge variant="outline" className="hover:border-primary">
                {category.name}
              </Badge>
            </Link>
          )}
        </div>
        <CardTitle className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
          {product.name}
        </CardTitle>
        <CardDescription className="font-mono text-xs">
          SKU {product.sku}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {product.rating_count > 0 && (
          <StarRating
            rating={product.rating_average}
            count={product.rating_count}
          />
        )}

        <div className="rounded-xl bg-muted/70 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Current price
              </p>
              <p className="mt-1 text-3xl font-black tracking-tight text-primary">
                {formatPrice(product.base_price_amount)}
              </p>
            </div>
            <span className="mb-1 font-mono text-xs text-muted-foreground">
              {product.currency}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ["Stock", "Checked"],
            ["Order", "Ready"],
            ["Status", "Clear"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border p-3">
              <p className="text-[11px] text-muted-foreground">{label}</p>
              <p className="mt-1 truncate font-mono text-xs font-semibold text-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Button disabled={!active} className="h-11 w-full justify-between">
            <span className="inline-flex items-center gap-2">
              <ShoppingCart data-icon="inline-start" />
              Add to cart
            </span>
            <ArrowUpRight data-icon="inline-end" />
          </Button>
          <Button asChild variant="outline" className="h-11 w-full justify-between">
            <Link href="/flash-sale">
              <span className="inline-flex items-center gap-2">
                <Zap data-icon="inline-start" />
                Check flash sale
              </span>
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        {!active && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            This product is currently not available for purchase.
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-3 bg-[var(--ops-background)] text-[var(--ops-foreground)]">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-[var(--ops-muted)]">Checkout confidence</span>
          <span className="font-mono text-emerald-700">100%</span>
        </div>
        <Progress value={100} className="bg-white/10" />
      </CardFooter>
    </Card>
  )
}

function ProductDescription({ description }: { description: string }) {
  if (!description || description.trim() === "") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product description</CardTitle>
          <CardDescription>No product description available yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      className="flex flex-col gap-5"
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Product detail
        </span>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground md:text-4xl">
          Product description
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Read the product notes before you add it to cart.
        </p>
      </div>
      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle>About this product</CardTitle>
          <CardDescription>Details from the seller.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="product-rich-text max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </CardContent>
      </Card>
    </motion.section>
  )
}

function SystemProofBand() {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      className="overflow-hidden rounded-xl bg-[var(--ops-background)] text-[var(--ops-foreground)]"
    >
      <div className="relative p-5 md:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--ops-grid)_1px,transparent_1px)] bg-[length:26px_26px] opacity-70" />
          <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Checkout assurance
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-tight md:text-4xl">
              Built to keep sale checkout fair.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--ops-muted)]">
              During busy drops, Go FlashArch checks availability first, lines
              up incoming orders, and returns a clear result to the buyer.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {flowSteps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{
                  duration: 0.5,
                  ease: smoothEase,
                  delay: index * 0.08,
                }}
                className="rounded-xl border border-white/10 bg-white/[0.045] p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <step.icon className={cn("size-5", step.tone)} />
                  <span className="font-mono text-[11px] text-[var(--ops-muted)]">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-5 font-semibold">{step.label}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--ops-muted)]">
                  {step.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function ProductLoading() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
      <div className="grid gap-3 lg:grid-cols-[5.5rem_minmax(0,1fr)]">
        <div className="hidden flex-col gap-2 lg:flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="size-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="aspect-[5/4] min-h-[360px] rounded-xl" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}

function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-xl bg-muted">
        <Package className="size-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
      <p className="text-muted-foreground">
        The product you are looking for does not exist or has been removed.
      </p>
      <Button asChild className="mt-2">
        <Link href="/products">Browse products</Link>
      </Button>
    </div>
  )
}

export function ProductDetail({ slug }: { slug: string }) {
  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    select: (res) => res.data.data,
  })

  const product = productQuery.data
  const categorySlug = product?.categories?.[0]?.slug

  const relatedQuery = useQuery({
    queryKey: ["related-products", categorySlug],
    queryFn: () =>
      categorySlug
        ? listProducts({
            category: categorySlug,
            per_page: 8,
            status: "active",
          })
        : Promise.resolve(null),
    enabled: !!categorySlug,
    select: (res) =>
      res?.data?.data?.items?.filter((p) => p.slug !== slug).slice(0, 6) ?? [],
  })

  const reviewsQuery = useQuery({
    queryKey: ["product-reviews", slug],
    queryFn: () => listProductReviews(slug, { per_page: 5 }),
    select: (res) => res.data.data,
    enabled: !!product,
  })

  const categoryLabel = product?.categories?.length
    ? product.categories.map((category) => category.name).join(" / ")
    : "Storefront"

  return (
    <div className="w-full bg-background">
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_28%),linear-gradient(180deg,color-mix(in_oklch,var(--muted)_58%,transparent),transparent_45%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-5 md:px-6 lg:gap-8 lg:py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button asChild variant="ghost">
              <Link href="/products">
                <ArrowLeft data-icon="inline-start" />
                Back to products
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              <span>{categoryLabel}</span>
            </div>
          </div>

          {productQuery.isLoading ? (
            <ProductLoading />
          ) : product ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_27rem]">
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, ease: smoothEase }}
                className="flex flex-col gap-5"
              >
                <div className="max-w-3xl">
                  <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Ready to shop
                  </span>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-6xl">
                    {product.name}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Check the price, product details, and availability before
                    adding this item to your cart.
                  </p>
                </div>
                <ProductGallery product={product} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: smoothEase, delay: 0.08 }}
              >
                <ProductCommandPanel product={product} />
              </motion.div>
            </div>
          ) : (
            <ProductNotFound />
          )}
        </div>
      </section>

      {product && (
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-5 md:px-6 md:py-16">
          <SystemProofBand />

          <ProductDescription description={product.description} />

          {reviewsQuery.data && (
            <>
              <Separator />
              <motion.section
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.25 }}
              >
                <ProductReviews
                  reviews={reviewsQuery.data.items}
                  total={reviewsQuery.data.total}
                  ratingAverage={product.rating_average}
                  ratingCount={product.rating_count}
                />
              </motion.section>
            </>
          )}

          {relatedQuery.data && relatedQuery.data.length > 0 && (
            <>
              <Separator />
              <motion.section
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.25 }}
              >
                <RelatedProducts products={relatedQuery.data} />
              </motion.section>
            </>
          )}

          <div className="grid gap-3 border-t border-border pt-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                label: "Stock checked first",
                copy: "Availability is confirmed before checkout continues.",
              },
              {
                icon: Boxes,
                label: "Fair order handling",
                copy: "Busy flash sale traffic is handled in a clear order.",
              },
              {
                icon: HeartPulse,
                label: "Clear status",
                copy: "You can tell whether checkout is waiting, confirmed, or sold out.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl bg-muted/55 p-4"
              >
                <item.icon className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
