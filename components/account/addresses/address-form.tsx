"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, MapPin, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RegionCascade } from "@/components/ui/region-cascade"
import { useRegionalCascade } from "@/hooks/use-regional-cascade"
import {
  useCreateAddress,
  useUpdateAddress,
} from "@/lib/hooks/use-addresses"
import type {
  CreateAddressInput,
  UserAddress,
} from "@/lib/api/account"
import {
  addressSchema,
  type AddressValues,
} from "@/lib/validations/account"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

type AddressFormProps = {
  mode: "create" | "edit"
  initialData?: UserAddress
}

export function AddressForm({ mode, initialData }: AddressFormProps) {
  const router = useRouter()
  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()
  const isBusy = createAddress.isPending || updateAddress.isPending

  const cascade = useRegionalCascade(
    initialData
      ? {
          province: initialData.province,
          regency: initialData.city,
          district: initialData.district,
          villageCode: initialData.postal_code,
        }
      : undefined,
  )

  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      recipient_name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      postal_code: "",
      address_line: "",
      notes: "",
      is_default: false,
    },
  })

  useEffect(() => {
    if (!initialData) return
    form.reset({
      label: initialData.label,
      recipient_name: initialData.recipient_name,
      phone: initialData.phone,
      province: initialData.province,
      city: initialData.city,
      district: initialData.district,
      postal_code: initialData.postal_code,
      address_line: initialData.address_line,
      notes: initialData.notes ?? "",
      is_default: initialData.is_default,
    })
  }, [initialData, form])

  useEffect(() => {
    if (!cascade.province) return
    form.setValue("province", cascade.provinceName)
  }, [cascade.province, cascade.provinceName, form])

  useEffect(() => {
    if (!cascade.regency) return
    form.setValue("city", cascade.regencyName)
  }, [cascade.regency, cascade.regencyName, form])

  useEffect(() => {
    if (!cascade.district) return
    form.setValue("district", cascade.districtName)
  }, [cascade.district, cascade.districtName, form])

  useEffect(() => {
    if (!cascade.village) return
    form.setValue("postal_code", cascade.village)
  }, [cascade.village, form])

  async function handleSubmit(values: AddressValues) {
    const payload: CreateAddressInput = {
      label: values.label,
      recipient_name: values.recipient_name,
      phone: values.phone,
      province: values.province,
      city: values.city,
      district: values.district,
      postal_code: values.postal_code,
      address_line: values.address_line,
      notes: values.notes,
      is_default: values.is_default,
    }

    if (mode === "create") {
      createAddress.mutate(payload, {
        onSuccess: () => router.push("/account/addresses"),
      })
    } else if (initialData) {
      updateAddress.mutate(
        { id: initialData.id, data: payload },
        { onSuccess: () => router.push("/account/addresses") },
      )
    }
  }

  const isDefault = form.watch("is_default")

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
      >
        <Link
          href="/account/addresses"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to addresses
        </Link>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.45, ease }}
        className="text-lg font-bold tracking-tight lg:text-xl"
      >
        {mode === "create" ? "New address" : "Edit address"}
      </motion.h1>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5"
      >
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45, ease }}
          className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6"
        >
          <SectionHeading
            icon={<MapPin className="size-4" />}
            title="Contact information"
            description="Who should receive this shipment."
          />
          <FieldGroup className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="label">Label</FieldLabel>
                <Input
                  id="label"
                  placeholder="Home, Office, etc."
                  {...form.register("label")}
                  aria-invalid={!!form.formState.errors.label}
                />
                <FieldError errors={[form.formState.errors.label]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="recipient_name">Recipient name</FieldLabel>
                <Input
                  id="recipient_name"
                  placeholder="Full name"
                  {...form.register("recipient_name")}
                  aria-invalid={!!form.formState.errors.recipient_name}
                />
                <FieldError errors={[form.formState.errors.recipient_name]} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input
                id="phone"
                placeholder="08123456789"
                {...form.register("phone")}
                aria-invalid={!!form.formState.errors.phone}
              />
              <FieldError errors={[form.formState.errors.phone]} />
            </Field>
          </FieldGroup>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease }}
          className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6"
        >
          <SectionHeading
            icon={<MapPin className="size-4" />}
            title="Region"
            description="Select the administrative region for this address."
          />
          <div className="mt-6">
            <RegionCascade
              province={{
                value: cascade.province,
                onChange: cascade.onProvinceChange,
              }}
              regency={{
                value: cascade.regency,
                onChange: cascade.onRegencyChange,
              }}
              district={{
                value: cascade.district,
                onChange: cascade.onDistrictChange,
              }}
              village={{
                value: cascade.village,
                onChange: cascade.onVillageChange,
              }}
              provinceOptions={cascade.provinces}
              regencyOptions={cascade.regencies}
              districtOptions={cascade.districts}
              villageOptions={cascade.villages}
              loadingProvince={cascade.loadingProvinces}
              loadingRegency={cascade.loadingRegencies}
              loadingDistrict={cascade.loadingDistricts}
              loadingVillage={cascade.loadingVillages}
              disabled={isBusy}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FieldError
                errors={[
                  form.formState.errors.province,
                  form.formState.errors.city,
                ]}
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease }}
          className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6"
        >
          <SectionHeading
            icon={<MapPin className="size-4" />}
            title="Address details"
            description="Street address and delivery notes."
          />
          <FieldGroup className="mt-6">
            <Field>
              <FieldLabel htmlFor="address_line">Address line</FieldLabel>
              <Input
                id="address_line"
                placeholder="Street name, building number, unit"
                {...form.register("address_line")}
                aria-invalid={!!form.formState.errors.address_line}
              />
              <FieldError errors={[form.formState.errors.address_line]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
              <Textarea
                id="notes"
                placeholder="Landmark, delivery instructions, etc."
                rows={3}
                {...form.register("notes")}
              />
            </Field>
            <Field>
              <label className="flex items-center gap-2.5">
                <Checkbox
                  checked={!!isDefault}
                  onCheckedChange={(checked) =>
                    form.setValue("is_default", !!checked)
                  }
                  disabled={isBusy}
                />
                <span className="text-sm font-medium">Set as default address</span>
              </label>
            </Field>
          </FieldGroup>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.45, ease }}
        >
          <Button type="submit" disabled={isBusy} className="w-full sm:w-auto">
            {isBusy ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save />
            )}
            {mode === "create" ? "Create address" : "Save changes"}
          </Button>
        </motion.div>
      </form>
    </div>
  )
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 max-w-prose text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
