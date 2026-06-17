"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Loader2, Save, Zap } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { slugify, toRFC3339 } from "./flash-sale-utils"
import {
  DateTimeRangePicker,
  parseDate,
  parseTime,
  mergeDateTime,
} from "@/components/dashboard/datetime-range-picker"
import {
  createFlashSale,
  updateFlashSale,
  type FlashSale,
} from "@/lib/api/flash-sale"
import {
  flashSaleCreateSchema,
  flashSaleEditSchema,
  type FlashSaleCreateValues,
  type FlashSaleEditValues,
} from "@/lib/validations/flash-sale"
import { getErrorMessage } from "@/lib/api/errors"

type FlashSaleFormProps =
  | { mode: "create"; sale?: never }
  | { mode: "edit"; sale: FlashSale }

async function showFormValidationError() {
  const { toast } = await import("sonner")
  toast.error("Please fix the highlighted fields")
}

function scheduleValues(
  range: { from: Date | undefined; to: Date | undefined },
  startTime: string,
  endTime: string,
) {
  return {
    starts_at: range.from ? toRFC3339(mergeDateTime(range.from, startTime)) : "",
    ends_at: range.to ? toRFC3339(mergeDateTime(range.to, endTime)) : "",
  }
}

export function FlashSaleForm(props: FlashSaleFormProps) {
  return props.mode === "create" ? <CreateFlashSaleForm /> : <EditFlashSaleForm sale={props.sale} />
}

function CreateFlashSaleForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("21:00")

  const form = useForm<FlashSaleCreateValues>({
    resolver: zodResolver(flashSaleCreateSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      starts_at: "",
      ends_at: "",
    },
  })

  const values = form.watch()

  const createMutation = useMutation({
    mutationFn: (input: FlashSaleCreateValues) => createFlashSale(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Flash sale created")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales"] })
      router.push("/dashboard/flash-sales")
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to create flash sale"))
    },
  })

  function onSubmit(input: FlashSaleCreateValues) {
    createMutation.mutate(input)
  }

  function handleNameChange(name: string) {
    if (!values.slug || values.slug === slugify(values.name)) {
      form.setValue("slug", slugify(name), { shouldValidate: true })
    }
  }

  function syncSchedule(
    nextRange = dateRange,
    nextStartTime = startTime,
    nextEndTime = endTime,
  ) {
    const next = scheduleValues(nextRange, nextStartTime, nextEndTime)
    form.setValue("starts_at", next.starts_at, {
      shouldDirty: true,
      shouldValidate: true,
    })
    form.setValue("ends_at", next.ends_at, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <FormShell title="Create flash sale" description="Set up a new flash sale campaign with timing and details.">
      <form onSubmit={form.handleSubmit(onSubmit, showFormValidationError)} className="grid gap-5">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">Sale details</h2>
          <p className="mt-1 text-xs text-muted-foreground">Name, schedule, and description for this flash sale.</p>
          <div className="mt-5 grid gap-4">
            <Field>
              <FieldLabel htmlFor="name">Sale name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g. June Mega Flash Sale"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name", { onChange: (e) => handleNameChange(e.target.value) })}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input
                id="slug"
                placeholder="e.g. june-mega-flash-sale"
                className="font-mono"
                aria-invalid={!!form.formState.errors.slug}
                {...form.register("slug")}
              />
              <FieldError errors={[form.formState.errors.slug]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                rows={3}
                placeholder="Optional description..."
                {...form.register("description")}
              />
            </Field>
            <DateTimeRangePicker
              value={dateRange}
              onChange={(range) => {
                setDateRange(range)
                syncSchedule(range)
              }}
              startTime={startTime}
              endTime={endTime}
              onStartTimeChange={(time) => {
                setStartTime(time)
                syncSchedule(dateRange, time, endTime)
              }}
              onEndTimeChange={(time) => {
                setEndTime(time)
                syncSchedule(dateRange, startTime, time)
              }}
              startError={form.formState.errors.starts_at?.message}
              endError={form.formState.errors.ends_at?.message}
            />
          </div>
        </section>

        <Button type="submit" size="lg" className="h-10 rounded-xl sm:w-fit" disabled={createMutation.isPending}>
          {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
          Create flash sale
        </Button>
      </form>
    </FormShell>
  )
}

function EditFlashSaleForm({ sale }: { sale: FlashSale }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: parseDate(sale.starts_at),
    to: parseDate(sale.ends_at),
  })
  const [startTime, setStartTime] = useState(parseTime(sale.starts_at))
  const [endTime, setEndTime] = useState(parseTime(sale.ends_at))

  const form = useForm<FlashSaleEditValues>({
    resolver: zodResolver(flashSaleEditSchema),
    defaultValues: {
      name: sale.name,
      description: sale.description || "",
      starts_at: sale.starts_at,
      ends_at: sale.ends_at,
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: FlashSaleEditValues) =>
      updateFlashSale(sale.id, input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Flash sale updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales"] })
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", sale.id] })
      router.push(`/dashboard/flash-sales/${sale.id}`)
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update flash sale"))
    },
  })

  function onSubmit(input: FlashSaleEditValues) {
    updateMutation.mutate(input)
  }

  function syncSchedule(
    nextRange = dateRange,
    nextStartTime = startTime,
    nextEndTime = endTime,
  ) {
    const next = scheduleValues(nextRange, nextStartTime, nextEndTime)
    form.setValue("starts_at", next.starts_at, {
      shouldDirty: true,
      shouldValidate: true,
    })
    form.setValue("ends_at", next.ends_at, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <FormShell title="Edit flash sale" description="Update timing and details for this flash sale.">
      <form onSubmit={form.handleSubmit(onSubmit, showFormValidationError)} className="grid gap-5">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">Sale details</h2>
          <div className="mt-5 grid gap-4">
            <Field>
              <FieldLabel htmlFor="name">Sale name</FieldLabel>
              <Input
                id="name"
                placeholder="Sale name"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                rows={3}
                placeholder="Optional description..."
                {...form.register("description")}
              />
            </Field>
            <DateTimeRangePicker
              value={dateRange}
              onChange={(range) => {
                setDateRange(range)
                syncSchedule(range)
              }}
              startTime={startTime}
              endTime={endTime}
              onStartTimeChange={(time) => {
                setStartTime(time)
                syncSchedule(dateRange, time, endTime)
              }}
              onEndTimeChange={(time) => {
                setEndTime(time)
                syncSchedule(dateRange, startTime, time)
              }}
              startError={form.formState.errors.starts_at?.message}
              endError={form.formState.errors.ends_at?.message}
            />
          </div>
        </section>

        <Button type="submit" size="lg" className="h-10 rounded-xl sm:w-fit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save changes
        </Button>
      </form>
    </FormShell>
  )
}

function FormShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2 text-muted-foreground">
        <Link href="/dashboard/flash-sales">
          <ArrowLeft className="size-4" />
          All flash sales
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-2xl border border-border bg-[#111111] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-[#FF6600]/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-40 rounded-full bg-[#DC143C]/8 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/15 px-3 py-1 text-xs font-semibold text-[#FF6600]">
            <Zap className="size-3.5" />
            Flash Sale
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2.5 max-w-md text-sm leading-6 text-white/50">{description}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        {children}
      </section>
    </div>
  )
}
