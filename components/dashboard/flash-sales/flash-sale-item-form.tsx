"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Loader2, Package, Save } from "lucide-react"
import { useForm } from "react-hook-form"
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
import { listAdminProducts } from "@/lib/api/catalog"
import {
  flashSaleItemCreateSchema,
  flashSaleItemEditSchema,
  type FlashSaleItemCreateValues,
  type FlashSaleItemEditValues,
} from "@/lib/validations/flash-sale"
import { getErrorMessage } from "@/lib/api/errors"

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

  const values = form.watch()

  const productsQuery = useQuery({
    queryKey: ["admin.products", { select: true }],
    queryFn: async () => {
      const response = await listAdminProducts({ per_page: 100, status: "active" })
      return response.data.data.items
    },
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
    createMutation.mutate(input)
  }

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
                  value={values.product_id}
                  onChange={(v) => form.setValue("product_id", v, { shouldValidate: true })}
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
              <Field>
                <FieldLabel htmlFor="sale_price_amount">Sale price</FieldLabel>
                <FormattedPriceInput
                  value={values.sale_price_amount}
                  onChange={(v) => form.setValue("sale_price_amount", v, { shouldValidate: true })}
                />
                <FieldDescription>The discounted price buyers will pay.</FieldDescription>
                <FieldError errors={[form.formState.errors.sale_price_amount]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="sale_stock_quantity">Stock quantity</FieldLabel>
                <Input
                  id="sale_stock_quantity"
                  type="number"
                  min={1}
                  className="w-full rounded-xl"
                  aria-invalid={!!form.formState.errors.sale_stock_quantity}
                  {...form.register("sale_stock_quantity", { valueAsNumber: true })}
                />
                <FieldDescription>Maximum units available for this sale.</FieldDescription>
                <FieldError errors={[form.formState.errors.sale_stock_quantity]} />
              </Field>
            </div>
          </section>

          <Button type="submit" size="lg" className="h-10 rounded-xl sm:w-fit" disabled={createMutation.isPending}>
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
    updateMutation.mutate(input)
  }

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
              <Field>
                <FieldLabel htmlFor="sale_price_amount">Sale price</FieldLabel>
                <FormattedPriceInput
                  value={form.watch("sale_price_amount")}
                  onChange={(v) => form.setValue("sale_price_amount", v, { shouldValidate: true })}
                />
                <FieldError errors={[form.formState.errors.sale_price_amount]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="sale_stock_quantity">Stock quantity</FieldLabel>
                <Input
                  id="sale_stock_quantity"
                  type="number"
                  min={1}
                  className="w-full rounded-xl"
                  aria-invalid={!!form.formState.errors.sale_stock_quantity}
                  {...form.register("sale_stock_quantity", { valueAsNumber: true })}
                />
                <FieldDescription>
                  Cannot reduce below reserved quantity ({item.reserved_quantity}).
                </FieldDescription>
                <FieldError errors={[form.formState.errors.sale_stock_quantity]} />
              </Field>
            </div>
          </section>

          <Button type="submit" size="lg" className="h-10 rounded-xl sm:w-fit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save changes
          </Button>
        </form>
      </section>
    </div>
  )
}
