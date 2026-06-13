"use client"

import { useState, useEffect, forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormattedPriceInputProps {
  value?: number
  onChange?: (value: number) => void
  placeholder?: string
  min?: number
  className?: string
  id?: string
  name?: string
  disabled?: boolean
  "aria-invalid"?: boolean
}

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function parseIDR(raw: string): number {
  const cleaned = raw.replace(/[^\d]/g, "")
  return parseInt(cleaned, 10) || 0
}

export const FormattedPriceInput = forwardRef<HTMLInputElement, FormattedPriceInputProps>(
  function FormattedPriceInput(
    { value = 0, onChange, placeholder = "0", className, id, name, disabled, "aria-invalid": ariaInvalid },
    ref,
  ) {
    const [displayValue, setDisplayValue] = useState("")
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
      if (!isFocused) {
        setDisplayValue(value ? formatIDR(value) : "")
      }
    }, [value, isFocused])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value
      const numeric = parseIDR(raw)
      setDisplayValue(raw ? formatIDR(numeric) : "")
      onChange?.(numeric)
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      setIsFocused(true)
      setDisplayValue(value ? String(value) : "")
      e.target.select()
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      setIsFocused(false)
      const numeric = parseIDR(e.target.value)
      setDisplayValue(numeric ? formatIDR(numeric) : "")
      onChange?.(numeric)
    }

    return (
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          Rp
        </span>
        <Input
          ref={ref}
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "h-9 rounded-lg border-border bg-muted/50 pl-7 text-xs tabular-nums focus-visible:ring-[#FF6600]/20",
            className,
          )}
        />
      </div>
    )
  },
)

export { formatIDR, parseIDR }
