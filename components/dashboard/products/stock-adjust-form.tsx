"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Loader2,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Warehouse,
} from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { adjustProductStock, type StockSnapshot } from "@/lib/api/inventory"
import { cn } from "@/lib/utils"

const adjustSchema = z.object({
  quantity_delta: z
    .number({ message: "Quantity must be a number" })
    .refine((val) => val !== 0, "Quantity cannot be zero"),
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(255, "Reason must be 255 characters or fewer"),
})

type AdjustValues = z.infer<typeof adjustSchema>

type StockAdjustFormProps = {
  stock: StockSnapshot
}

export function StockAdjustForm({ stock }: StockAdjustFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [adjustmentSign, setAdjustmentSign] = useState<"positive" | "negative">(
    "positive",
  )

  const form = useForm<AdjustValues>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      quantity_delta: 0,
      reason: "",
    },
  })
  const quantityDelta = useWatch({
    control: form.control,
    name: "quantity_delta",
  })

  const adjustMutation = useMutation({
    mutationFn: (values: AdjustValues) => {
      const delta =
        adjustmentSign === "negative"
          ? -Math.abs(values.quantity_delta)
          : Math.abs(values.quantity_delta)
      return adjustProductStock(stock.product.id, {
        quantity_delta: delta,
        reason: values.reason,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inventory-stocks"] })
      queryClient.invalidateQueries({ queryKey: ["admin-inventory-movements"] })
      router.push("/dashboard/products/inventory")
    },
    onError: (error: Error) => {
      form.setError("root", {
        message: error.message || "Failed to adjust stock",
      })
    },
  })

  function onSubmit(values: AdjustValues) {
    adjustMutation.mutate(values)
  }

  const previewDelta =
    adjustmentSign === "negative"
      ? -Math.abs(quantityDelta || 0)
      : Math.abs(quantityDelta || 0)

  const previewAvailable = stock.available_quantity + previewDelta
  const previewOnHand = stock.on_hand_quantity + previewDelta
  const isStockOut = adjustmentSign === "negative"
  const canSubmit = !adjustMutation.isPending && previewAvailable >= 0
  const directionLabel = isStockOut ? "Stock out" : "Stock in"
  const directionDescription = isStockOut
    ? "Remove physical stock for damage, audit correction, or shrinkage."
    : "Add physical stock from restock, return, or opening balance."
  const previewTone =
    previewAvailable < 0
      ? "text-destructive"
      : "text-emerald-600 dark:text-emerald-400"

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
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <RotateCcw className="size-3.5" />
                Stock adjustment
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Adjust inventory
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Update physical stock for{" "}
                <span className="font-medium text-foreground">
                  {stock.product.name}
                </span>
                . Reservation and sold quantities stay protected.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-foreground">
                {stock.product.sku}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="size-3.5" />
                {stock.available_quantity.toLocaleString("id-ID")} available
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-muted/45 p-4 ring-1 ring-border/70">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Warehouse
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                  {stock.warehouse.code}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-card text-primary ring-1 ring-border">
                <Warehouse className="size-5" />
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {stock.warehouse.name}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      8,
                      (stock.available_quantity /
                        Math.max(stock.on_hand_quantity, 1)) *
                        100,
                    ),
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Current stock position
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Physical, reserved, sold, and checkout-ready quantities.
            </p>
          </div>
          <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Source: inventory ledger
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StockStat
            label="On hand"
            value={stock.on_hand_quantity}
            description="Physical ledger stock"
            icon={Boxes}
          />
          <StockStat
            label="Reserved"
            value={stock.reserved_quantity}
            description="Held for checkouts"
            icon={RotateCcw}
          />
          <StockStat
            label="Sold"
            value={stock.sold_quantity}
            description="Confirmed sales"
            icon={PackageCheck}
          />
          <StockStat
            label="Available"
            value={stock.available_quantity}
            description="Ready for checkout"
            icon={CheckCircle2}
            highlight
          />
        </div>
      </section>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-5 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                New adjustment
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose movement type, enter quantity, then document the reason.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <AdjustmentChoice
                active={!isStockOut}
                icon={Plus}
                title="Stock in"
                description="Restock or correction"
                onClick={() => setAdjustmentSign("positive")}
              />
              <AdjustmentChoice
                active={isStockOut}
                icon={Minus}
                title="Stock out"
                description="Damage or audit loss"
                onClick={() => setAdjustmentSign("negative")}
              />
            </div>

            <Field
              orientation="vertical"
              data-invalid={!!form.formState.errors.quantity_delta}
            >
              <FieldLabel>Quantity</FieldLabel>
              <Input
                type="number"
                min={1}
                placeholder="0"
                className="h-12 w-full max-w-sm font-mono text-base tabular-nums"
                {...form.register("quantity_delta", { valueAsNumber: true })}
              />
              <FieldDescription>{directionDescription}</FieldDescription>
              <FieldError>
                {form.formState.errors.quantity_delta?.message}
              </FieldError>
            </Field>

            <Field
              orientation="vertical"
              data-invalid={!!form.formState.errors.reason}
            >
              <FieldLabel>Reason</FieldLabel>
              <Textarea
                placeholder="e.g. restocked from supplier, audit correction, damaged goods"
                className="min-h-28 w-full resize-y"
                {...form.register("reason")}
              />
              <FieldDescription>
                Required for stock traceability and admin review.
              </FieldDescription>
              <FieldError>{form.formState.errors.reason?.message}</FieldError>
            </Field>

            {form.formState.errors.root && (
              <div className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            {previewAvailable < 0 && (
              <div className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                Stock out would make available quantity negative. Reduce
                quantity before submitting.
              </div>
            )}
          </div>

          <aside className="border-t bg-muted/30 p-5 sm:p-6 lg:border-l lg:border-t-0">
            <div className="sticky top-4 flex flex-col gap-5">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Impact preview
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Review ledger result before write.
                </p>
              </div>

              <div className="rounded-xl bg-card p-4 ring-1 ring-border">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <PreviewNumber
                    label="Current"
                    value={stock.available_quantity}
                  />
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <ArrowRight className="size-4" />
                  </div>
                  <PreviewNumber
                    label="After"
                    value={previewAvailable}
                    className={previewTone}
                  />
                </div>
                <div className="mt-4 rounded-lg bg-muted/60 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">{directionLabel}</span>
                  <span
                    className={cn(
                      "ml-2 font-mono font-semibold tabular-nums",
                      previewDelta < 0 ? "text-destructive" : previewTone,
                    )}
                  >
                    {previewDelta > 0 ? "+" : ""}
                    {previewDelta.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="grid gap-2 text-sm">
                <PreviewRow label="On hand after" value={previewOnHand} />
                <PreviewRow label="Reserved" value={stock.reserved_quantity} />
                <PreviewRow label="Sold" value={stock.sold_quantity} />
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 rounded-xl"
                  disabled={!canSubmit}
                >
                  {adjustMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Adjusting...
                    </>
                  ) : (
                    "Adjust stock"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="h-11 rounded-xl"
                  onClick={() => router.push("/dashboard/products/inventory")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  )
}

function AdjustmentChoice({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  active: boolean
  icon: typeof Plus
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-20 items-center gap-3 rounded-xl border p-4 text-left transition-colors",
        active
          ? "border-primary/35 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          active ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-0.5 block text-xs opacity-80">{description}</span>
      </span>
    </button>
  )
}

function PreviewNumber({
  label,
  value,
  className,
}: {
  label: string
  value: number
  className?: string
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground",
          className,
        )}
      >
        {value.toLocaleString("id-ID")}
      </p>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2 ring-1 ring-border/70">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold tabular-nums text-foreground">
        {value.toLocaleString("id-ID")}
      </span>
    </div>
  )
}

function StockStat({
  label,
  value,
  description,
  icon: Icon,
  highlight,
}: {
  label: string
  value: number
  description: string
  icon: typeof Boxes
  highlight?: boolean
}) {
  return (
    <div className="rounded-xl bg-muted/35 p-4 ring-1 ring-border/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "mt-2 font-mono text-2xl font-semibold tracking-tight tabular-nums",
              highlight
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-foreground",
            )}
          >
            {value.toLocaleString("id-ID")}
          </p>
        </div>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg bg-card ring-1 ring-border",
            highlight
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground",
          )}
        >
          <Icon className="size-4" />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
