"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  BarChart3,
  Boxes,
  History,
  Loader2,
  PackageCheck,
  Plus,
  RotateCcw,
  Warehouse,
} from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { StockAdjustForm } from "@/components/dashboard/products/stock-adjust-form"
import { getInventoryProductStock, adjustProductStock } from "@/lib/api/inventory"
import { getAdminProduct } from "@/lib/api/catalog"
import { cn } from "@/lib/utils"

export function StockAdjustLoader() {
  const params = useParams<{ product_id: string }>()
  const productId = params.product_id
  const queryClient = useQueryClient()
  const [initialStock, setInitialStock] = useState(0)

  const stockQuery = useQuery({
    queryKey: ["admin-product-stock", productId],
    queryFn: async () => {
      const response = await getInventoryProductStock(productId)
      return response.data.data
    },
  })

  const productQuery = useQuery({
    queryKey: ["admin-product-detail", productId],
    queryFn: async () => {
      const response = await getAdminProduct(productId)
      return response.data.data
    },
  })

  const createStockMutation = useMutation({
    mutationFn: () =>
      adjustProductStock(productId, {
        quantity_delta: initialStock,
        reason: "Initial stock",
      }),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Stock record created")
      await queryClient.invalidateQueries({ queryKey: ["admin-product-stock", productId] })
      await queryClient.invalidateQueries({ queryKey: ["admin-inventory-stocks"] })
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  if (stockQuery.isLoading || productQuery.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (!stockQuery.data) {
    const product = productQuery.data

    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/dashboard/products/inventory"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to inventory
          </Link>
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_320px] lg:items-stretch">
            <div className="flex min-w-0 flex-col justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/10 px-3 py-1 text-xs font-semibold text-[#FF6600]">
                  <Warehouse className="size-3.5" />
                  Stock initialization
                </div>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {product ? product.name : "Product"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  This product doesn&apos;t have an inventory record yet. Set the
                  initial stock quantity to begin tracking physical inventory,
                  reservations, and sales.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {product?.sku && (
                  <span className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-foreground">
                    {product.sku}
                  </span>
                )}
                {product?.categories?.[0] && (
                  <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-muted-foreground">
                    {product.categories[0].name}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6600]/20 bg-[#FF6600]/10 px-3 py-1 font-medium text-[#FF6600]">
                  <Plus className="size-3.5" />
                  No stock record
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-muted/45 p-4 ring-1 ring-border/70">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Quick setup
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter starting quantity
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#FF6600]/10 text-[#FF6600] ring-1 ring-[#FF6600]/20">
                  <Boxes className="size-5" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Field className="mb-0 flex-1">
                  <FieldLabel htmlFor="initial_stock" className="sr-only">
                    Initial stock
                  </FieldLabel>
                  <Input
                    id="initial_stock"
                    type="number"
                    min={0}
                    value={initialStock || ""}
                    onChange={(e) => setInitialStock(Number(e.target.value))}
                    placeholder="0"
                    className="h-11 w-full font-mono text-base tabular-nums"
                  />
                </Field>
                <Button
                  onClick={() => createStockMutation.mutate()}
                  disabled={initialStock <= 0 || createStockMutation.isPending}
                  className="h-11 shrink-0 gap-2 rounded-xl bg-[#FF6600] px-5 text-white hover:bg-[#e65c00]"
                >
                  {createStockMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  Create stock
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          <ExplainerCard
            icon={Boxes}
            title="On hand"
            description="Physical stock count in warehouse. This is the number you set today."
            color="text-[#FF6600]"
            bgColor="bg-[#FF6600]/10"
            ringColor="ring-[#FF6600]/20"
          />
          <ExplainerCard
            icon={RotateCcw}
            title="Reserved"
            description="Stock held for active checkouts. Automatically managed by the system."
            color="text-amber-600 dark:text-amber-400"
            bgColor="bg-amber-500/10"
            ringColor="ring-amber-500/20"
          />
          <ExplainerCard
            icon={PackageCheck}
            title="Sold"
            description="Confirmed sales deducted from inventory. Tracked after order confirmation."
            color="text-emerald-600 dark:text-emerald-400"
            bgColor="bg-emerald-500/10"
            ringColor="ring-emerald-500/20"
          />
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <BarChart3 className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground">
                How stock adjustment works
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                After creating the initial stock, you can adjust quantities from
                the inventory page. Stock-ins increase physical count for
                restocks or returns. Stock-outs decrease count for damage, audit
                corrections, or shrinkage. Every adjustment is logged with a
                reason for traceability.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                  <History className="size-3" />
                  Full movement history
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                  <RotateCcw className="size-3" />
                  Reservation-safe
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                  <BarChart3 className="size-3" />
                  Audit-ready logs
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return <StockAdjustForm stock={stockQuery.data} />
}

function ExplainerCard({
  icon: Icon,
  title,
  description,
  color,
  bgColor,
  ringColor,
}: {
  icon: typeof Boxes
  title: string
  description: string
  color: string
  bgColor: string
  ringColor: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl ring-1",
            bgColor,
            color,
            ringColor,
          )}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
