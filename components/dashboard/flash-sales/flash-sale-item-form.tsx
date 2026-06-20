"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, CheckCircle2, Loader2, Package, Save, Warehouse } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SingleSelect } from "@/components/common/single-select"
import { FormattedPriceInput } from "@/components/common/formatted-price-input"
import {
  createFlashSaleItem,
  updateFlashSaleItem,
  type FlashSaleItem,
} from "@/lib/api/flash-sale"
import { listAdminProducts, getAdminProduct } from "@/lib/api/catalog"
import { getInventoryProductStock, type StockSnapshot } from "@/lib/api/inventory"
import {
  flashSaleItemCreateSchema,
  flashSaleItemEditSchema,
  type FlashSaleItemCreateValues,
  type FlashSaleItemEditValues,
} from "@/lib/validations/flash-sale"
import { getErrorMessage } from "@/lib/api/errors"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

type FlashSaleItemFormProps =
  | { mode: "create"; saleId: string; item?: never; saleName?: string }
  | { mode: "edit"; saleId: string; item: FlashSaleItem; saleName?: string }

export function FlashSaleItemForm(props: FlashSaleItemFormProps) {
  return props.mode === "create" ? (
    <CreateItemForm saleId={props.saleId} saleName={props.saleName} />
  ) : (
    <EditItemForm saleId={props.saleId} item={props.item} />
  )
}

function CreateItemForm({ saleId, saleName }: { saleId: string; saleName?: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<FlashSaleItemCreateValues>({
    resolver: zodResolver(flashSaleItemCreateSchema),
    defaultValues: {
      product_id: "",
      sale_price_amount: 0,
      currency: "IDR",
      sale_stock_quantity: 1,
    },
  })

  const values = useWatch({ control: form.control })
  const selectedProductId = values.product_id ?? ""

  const productsQuery = useQuery({
    queryKey: ["admin.products", { select: true }],
    queryFn: async () => {
      const response = await listAdminProducts({ per_page: 100, status: "active" })
      return response.data.data.items
    },
  })

  const stockQuery = useQuery({
    queryKey: ["admin.products", selectedProductId, "stock"],
    queryFn: async () => {
      const response = await getInventoryProductStock(selectedProductId)
      return response.data.data
    },
    enabled: !!selectedProductId,
  })

  const productDetailQuery = useQuery({
    queryKey: ["admin.products", selectedProductId],
    queryFn: async () => {
      const response = await getAdminProduct(selectedProductId)
      return response.data.data
    },
    enabled: !!selectedProductId,
  })

  const createMutation = useMutation({
    mutationFn: (input: FlashSaleItemCreateValues) => createFlashSaleItem(saleId, input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Item added to flash sale")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId] })
      router.push(`/dashboard/flash-sales/${saleId}`)
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to add item to flash sale"))
    },
  })

  function onSubmit(input: FlashSaleItemCreateValues) {
    if (!assertStockAllocation(input.sale_stock_quantity, stockQuery.data, form.setError)) {
      return
    }
    createMutation.mutate(input)
  }

  const useAllAvailable = () => {
    if (!stockQuery.data) return
    form.setValue("sale_stock_quantity", stockQuery.data.available_quantity, {
      shouldDirty: true,
      shouldValidate: true,
    })
    form.clearErrors("sale_stock_quantity")
  }
  const stockAllocationMessage = getStockAllocationMessage(
    values.sale_stock_quantity ?? 0,
    stockQuery.data,
    !!selectedProductId,
    stockQuery.isError,
  )

  return (
    <div className="flex flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2 text-muted-foreground">
        <Link href={`/dashboard/flash-sales/${saleId}`}>
          <ArrowLeft className="size-4" />
          Back to sale
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-2xl border border-border bg-[#111111] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-[#FF6600]/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-40 rounded-full bg-[#DC143C]/8 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/15 px-3 py-1 text-xs font-semibold text-[#FF6600]">
            <Package className="size-3.5" />
            Sale Item
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">Add item</h1>
          <p className="mt-2.5 max-w-md text-sm leading-6 text-white/50">
            {saleName ? `Add a product to ${saleName}` : "Add a product to this flash sale"}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-foreground">Item details</h2>
            <p className="mt-1 text-xs text-muted-foreground">Select a product and set the flash sale pricing.</p>
            <div className="mt-5 grid gap-4">
              <Field>
                <FieldLabel htmlFor="product_id">Product</FieldLabel>
                <SingleSelect
                  value={values.product_id ?? ""}
                  onChange={(v) => {
                    form.setValue("product_id", v, { shouldDirty: true, shouldValidate: true })
                    form.clearErrors("sale_stock_quantity")
                  }}
                  placeholder="Select a product"
                  searchPlaceholder="Search products..."
                  options={
                    productsQuery.data?.map((p) => ({
                      value: p.id,
                      label: p.name,
                      description: p.sku,
                    })) ?? []
                  }
                />
                <FieldDescription>Only active products are shown.</FieldDescription>
                <FieldError errors={[form.formState.errors.product_id]} />
              </Field>
              <StockSnapshotPanel
                stock={stockQuery.data}
                isLoading={stockQuery.isLoading}
                isError={stockQuery.isError}
                hasProduct={!!selectedProductId}
              />
              <Field>
                <FieldLabel htmlFor="sale_price_amount">Sale price</FieldLabel>
                <FormattedPriceInput
                  value={values.sale_price_amount ?? 0}
                  onChange={(v) => form.setValue("sale_price_amount", v, { shouldValidate: true })}
                />
                {productDetailQuery.data && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Normal price: {formatCurrency(productDetailQuery.data.base_price_amount)}
                    {values.sale_price_amount > 0 && productDetailQuery.data.base_price_amount > 0 && (
                      <span className="ml-2 font-medium text-[#1a8a0a] dark:text-emerald-400">
                        ({Math.round((1 - values.sale_price_amount / productDetailQuery.data.base_price_amount) * 100)}% off)
                      </span>
                    )}
                  </p>
                )}
                <FieldDescription>The discounted price buyers will pay.</FieldDescription>
                <FieldError errors={[form.formState.errors.sale_price_amount]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="sale_stock_quantity">Stock quantity</FieldLabel>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <Input
                    id="sale_stock_quantity"
                    type="number"
                    min={1}
                    max={stockQuery.data?.available_quantity}
                    className="w-full rounded-xl"
                    aria-invalid={!!form.formState.errors.sale_stock_quantity}
                    {...form.register("sale_stock_quantity", { valueAsNumber: true })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 rounded-xl"
                    onClick={useAllAvailable}
                    disabled={!canUseAllAvailable(stockQuery.data, stockQuery.isLoading, !!selectedProductId)}
                  >
                    <CheckCircle2 className="size-4" />
                    Use all available
                  </Button>
                </div>
                <FieldDescription>Maximum units available for this sale.</FieldDescription>
                {stockAllocationMessage && (
                  <p className="text-xs font-medium text-[#DC143C]">{stockAllocationMessage}</p>
                )}
                <FieldError errors={[form.formState.errors.sale_stock_quantity]} />
              </Field>
            </div>
          </section>

          <Button
            type="submit"
            size="lg"
            className="h-10 rounded-xl sm:w-fit"
            disabled={
              createMutation.isPending ||
              (!!selectedProductId && stockQuery.isLoading) ||
              !!stockAllocationMessage
            }
          >
            {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Package className="size-4" />}
            Add item
          </Button>
        </form>
      </section>
    </div>
  )
}

function EditItemForm({ saleId, item }: { saleId: string; item: FlashSaleItem }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<FlashSaleItemEditValues>({
    resolver: zodResolver(flashSaleItemEditSchema),
    defaultValues: {
      sale_price_amount: item.sale_price_amount,
      sale_stock_quantity: item.sale_stock_quantity,
    },
  })

  const stockQuery = useQuery({
    queryKey: ["admin.products", item.product_id, "stock"],
    queryFn: async () => {
      const response = await getInventoryProductStock(item.product_id)
      return response.data.data
    },
    enabled: !!item.product_id,
  })

  const productDetailQuery = useQuery({
    queryKey: ["admin.products", item.product_id],
    queryFn: async () => {
      const response = await getAdminProduct(item.product_id)
      return response.data.data
    },
    enabled: !!item.product_id,
  })
  const values = useWatch({ control: form.control })

  const updateMutation = useMutation({
    mutationFn: (input: FlashSaleItemEditValues) => updateFlashSaleItem(saleId, item.id, input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Item updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId] })
      router.push(`/dashboard/flash-sales/${saleId}`)
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update flash sale item"))
    },
  })

  function onSubmit(input: FlashSaleItemEditValues) {
    if (input.sale_stock_quantity < item.reserved_quantity) {
      form.setError("sale_stock_quantity", {
        type: "manual",
        message: `Stock cannot be below reserved quantity (${item.reserved_quantity}).`,
      })
      return
    }
    if (!assertStockAllocation(input.sale_stock_quantity, stockQuery.data, form.setError)) {
      return
    }
    updateMutation.mutate(input)
  }

  const useAllAvailable = () => {
    if (!stockQuery.data) return
    form.setValue("sale_stock_quantity", stockQuery.data.available_quantity, {
      shouldDirty: true,
      shouldValidate: true,
    })
    form.clearErrors("sale_stock_quantity")
  }
  const reservedMessage =
    (values.sale_stock_quantity ?? 0) < item.reserved_quantity
      ? `Stock cannot be below reserved quantity (${item.reserved_quantity}).`
      : ""
  const stockAllocationMessage = getStockAllocationMessage(
    values.sale_stock_quantity ?? 0,
    stockQuery.data,
    true,
    stockQuery.isError,
  )
  const stockQuantityMessage = reservedMessage || stockAllocationMessage

  return (
    <div className="flex flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2 text-muted-foreground">
        <Link href={`/dashboard/flash-sales/${saleId}`}>
          <ArrowLeft className="size-4" />
          Back to sale
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-2xl border border-border bg-[#111111] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-[#FF6600]/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-40 rounded-full bg-[#DC143C]/8 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/15 px-3 py-1 text-xs font-semibold text-[#FF6600]">
            <Package className="size-3.5" />
            Sale Item
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">Edit item</h1>
          <p className="mt-2.5 max-w-md text-sm leading-6 text-white/50">
            {item.product.name}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-foreground">Item details</h2>
            <div className="mt-5 grid gap-4">
              <Field>
                <FieldLabel>Product</FieldLabel>
                <div className="rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm">
                  {item.product.name}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">{item.product.sku}</span>
                </div>
              </Field>
              <StockSnapshotPanel
                stock={stockQuery.data}
                isLoading={stockQuery.isLoading}
                isError={stockQuery.isError}
                hasProduct
              />
              <Field>
                <FieldLabel htmlFor="sale_price_amount">Sale price</FieldLabel>
                <FormattedPriceInput
                  value={values.sale_price_amount ?? item.sale_price_amount}
                  onChange={(v) => form.setValue("sale_price_amount", v, { shouldValidate: true })}
                />
                {productDetailQuery.data && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Normal price: {formatCurrency(productDetailQuery.data.base_price_amount)}
                    {(values.sale_price_amount ?? item.sale_price_amount) > 0 && productDetailQuery.data.base_price_amount > 0 && (
                      <span className="ml-2 font-medium text-[#1a8a0a] dark:text-emerald-400">
                        ({Math.round((1 - (values.sale_price_amount ?? item.sale_price_amount) / productDetailQuery.data.base_price_amount) * 100)}% off)
                      </span>
                    )}
                  </p>
                )}
                <FieldError errors={[form.formState.errors.sale_price_amount]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="sale_stock_quantity">Stock quantity</FieldLabel>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <Input
                    id="sale_stock_quantity"
                    type="number"
                    min={1}
                    max={stockQuery.data?.available_quantity}
                    className="w-full rounded-xl"
                    aria-invalid={!!form.formState.errors.sale_stock_quantity}
                    {...form.register("sale_stock_quantity", { valueAsNumber: true })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 rounded-xl"
                    onClick={useAllAvailable}
                    disabled={!canUseAllAvailable(stockQuery.data, stockQuery.isLoading, true)}
                  >
                    <CheckCircle2 className="size-4" />
                    Use all available
                  </Button>
                </div>
                <FieldDescription>
                  Cannot reduce below reserved quantity ({item.reserved_quantity}).
                </FieldDescription>
                {stockQuantityMessage && (
                  <p className="text-xs font-medium text-[#DC143C]">{stockQuantityMessage}</p>
                )}
                <FieldError errors={[form.formState.errors.sale_stock_quantity]} />
              </Field>
            </div>
          </section>

          <Button
            type="submit"
            size="lg"
            className="h-10 rounded-xl sm:w-fit"
            disabled={updateMutation.isPending || stockQuery.isLoading || !!stockQuantityMessage}
          >
            {updateMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save changes
          </Button>
        </form>
      </section>
    </div>
  )
}

function StockSnapshotPanel({
  stock,
  isLoading,
  isError,
  hasProduct,
}: {
  stock?: StockSnapshot
  isLoading: boolean
  isError: boolean
  hasProduct: boolean
}) {
  if (!hasProduct) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-3 py-3 text-sm text-muted-foreground">
        Select a product to see available inventory.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading inventory stock...
      </div>
    )
  }

  if (isError || !stock) {
    return (
      <div className="rounded-xl border border-[#DC143C]/20 bg-[#DC143C]/5 px-3 py-3 text-sm text-[#DC143C]">
        Stock record unavailable. Add inventory stock before allocating this product.
      </div>
    )
  }

  const available = stock.available_quantity
  const isUnavailable = available <= 0

  return (
    <div className="rounded-xl border border-border bg-muted/25 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Warehouse className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              Available: <span className={isUnavailable ? "text-[#DC143C]" : "text-[#1a8a0a] dark:text-[#39FF14]"}>{available}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Warehouse {stock.warehouse.code}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs sm:min-w-[18rem]">
          <StockMiniStat label="On hand" value={stock.on_hand_quantity} />
          <StockMiniStat label="Reserved" value={stock.reserved_quantity} />
          <StockMiniStat label="Sold" value={stock.sold_quantity} />
        </div>
      </div>
    </div>
  )
}

function StockMiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-background px-2 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium tabular-nums text-foreground">{value}</p>
    </div>
  )
}

function canUseAllAvailable(stock: StockSnapshot | undefined, isLoading: boolean, hasProduct: boolean) {
  return hasProduct && !isLoading && !!stock && stock.available_quantity > 0
}

function assertStockAllocation<T extends "sale_stock_quantity">(
  quantity: number,
  stock: StockSnapshot | undefined,
  setError: (name: T, error: { type: string; message: string }) => void,
) {
  if (!stock) {
    setError("sale_stock_quantity" as T, {
      type: "manual",
      message: "Available stock is unavailable for this product.",
    })
    return false
  }

  if (stock.available_quantity <= 0) {
    setError("sale_stock_quantity" as T, {
      type: "manual",
      message: "This product has no available inventory to allocate.",
    })
    return false
  }

  if (quantity > stock.available_quantity) {
    setError("sale_stock_quantity" as T, {
      type: "manual",
      message: `Stock quantity cannot exceed available inventory (${stock.available_quantity}).`,
    })
    return false
  }

  return true
}

function getStockAllocationMessage(
  quantity: number,
  stock: StockSnapshot | undefined,
  hasProduct: boolean,
  hasStockError: boolean,
) {
  if (!hasProduct) return ""
  if (hasStockError) return "Available stock is unavailable for this product."
  if (!stock) return ""
  if (stock.available_quantity <= 0) return "This product has no available inventory to allocate."
  if (quantity > stock.available_quantity) {
    return `Stock quantity cannot exceed available inventory (${stock.available_quantity}).`
  }
  return ""
}
