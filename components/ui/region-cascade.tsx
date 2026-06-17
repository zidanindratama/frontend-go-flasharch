"use client"

import { SingleSelect } from "@/components/common/single-select"
import { Input } from "@/components/ui/input"

type RegionOption = { code: string; name: string }

type RegionCascadeProps = {
  province: { value: string; onChange: (v: string) => void }
  regency: { value: string; onChange: (v: string) => void }
  district: { value: string; onChange: (v: string) => void }
  village: { value: string; onChange: (v: string) => void }
  postalCode?: { value: string; onChange: (v: string) => void; error?: boolean; readOnly?: boolean }
  provinceOptions: RegionOption[]
  regencyOptions: RegionOption[]
  districtOptions: RegionOption[]
  villageOptions: RegionOption[]
  loadingProvince?: boolean
  loadingRegency?: boolean
  loadingDistrict?: boolean
  loadingVillage?: boolean
  disabled?: boolean
}

function toSelectOptions(items: RegionOption[]) {
  return items.map((i) => ({ value: i.code, label: i.name }))
}

export function RegionCascade({
  province,
  regency,
  district,
  village,
  postalCode,
  provinceOptions,
  regencyOptions,
  districtOptions,
  villageOptions,
  loadingProvince,
  loadingRegency,
  loadingDistrict,
  loadingVillage,
  disabled,
}: RegionCascadeProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <SingleSelect
          value={province.value}
          onChange={province.onChange}
          options={toSelectOptions(provinceOptions)}
          placeholder="Select province"
          searchPlaceholder="Search provinces..."
          emptyText="No provinces found."
          disabled={disabled || loadingProvince}
        />
        <SingleSelect
          value={regency.value}
          onChange={regency.onChange}
          options={toSelectOptions(regencyOptions)}
          placeholder="Select regency"
          searchPlaceholder="Search regencies..."
          emptyText="No regencies found."
          disabled={disabled || !province.value || loadingRegency}
        />
        <SingleSelect
          value={district.value}
          onChange={district.onChange}
          options={toSelectOptions(districtOptions)}
          placeholder="Select district"
          searchPlaceholder="Search districts..."
          emptyText="No districts found."
          disabled={disabled || !regency.value || loadingDistrict}
        />
        <SingleSelect
          value={village.value}
          onChange={village.onChange}
          options={toSelectOptions(villageOptions)}
          placeholder="Select village"
          searchPlaceholder="Search villages..."
          emptyText="No villages found."
          disabled={disabled || !district.value || loadingVillage}
        />
      </div>
      {postalCode && (
        <div className="mt-4">
          <Input
            value={postalCode.value}
            onChange={(e) => postalCode.onChange(e.target.value)}
            placeholder="Postal code"
            inputMode="numeric"
            readOnly={postalCode.readOnly}
            disabled={disabled}
            aria-invalid={postalCode.error}
          />
        </div>
      )}
    </>
  )
}
