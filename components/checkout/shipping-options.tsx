"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useShippingCost, type ShippingOption } from "@/lib/hooks/use-shipping"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/components/dashboard/products/product-utils"
import { motion } from "framer-motion"

const ease = [0.16, 1, 0.3, 1] as const

interface ShippingOptionsProps {
  destinationVillageCode: string | null
  totalWeight: number
  selectedOption: ShippingOption | null
  onSelect: (option: ShippingOption) => void
}

export function ShippingOptions({
  destinationVillageCode,
  totalWeight,
  selectedOption,
  onSelect,
}: ShippingOptionsProps) {
  const { data: options, isLoading } = useShippingCost(destinationVillageCode, totalWeight)
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="h-14 animate-pulse rounded-2xl bg-muted/50" />
    )
  }

  if (!options || options.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">
          No shipping options available for this destination
        </p>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-14 w-full justify-between rounded-2xl border-transparent bg-muted/50 px-5 text-sm font-normal hover:bg-muted/80"
          >
            <span className="truncate">
              {selectedOption ? (
                <span className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{selectedOption.courier_name}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{formatPrice(selectedOption.price)}</span>
                  {selectedOption.estimation && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground/70">{selectedOption.estimation}</span>
                    </>
                  )}
                </span>
              ) : (
                <span className="text-muted-foreground">Select shipping method</span>
              )}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground/40" />
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] overflow-hidden rounded-2xl border-border p-0 shadow-xl">
        <Command className="rounded-2xl">
          <CommandInput placeholder="Search courier..." className="h-11 text-sm" />
          <CommandList>
            <CommandEmpty className="py-6 text-xs text-muted-foreground">
              No shipping option found.
            </CommandEmpty>
            <CommandGroup className="gap-0.5 p-1.5">
              {options?.map((option, index) => {
                const isSelected =
                  selectedOption?.courier_code === option.courier_code &&
                  selectedOption?.service_name === option.service_name
                return (
                  <CommandItem
                    key={`${option.courier_code}-${option.service_name}-${index}`}
                    value={`${option.courier_name} ${option.service_name}`}
                    onSelect={() => {
                      onSelect(option)
                      setOpen(false)
                    }}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? "bg-[#FF6600]/[0.06] text-foreground"
                        : "hover:bg-muted/80"
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all ${
                        isSelected
                          ? "border-[#FF6600] bg-[#FF6600]"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium">{option.courier_name}</span>
                        <span className="shrink-0 tabular-nums font-semibold text-foreground">
                          {formatPrice(option.price)}
                        </span>
                      </div>
                      {option.estimation && (
                        <span className="mt-0.5 block text-[11px] text-muted-foreground/70">
                          {option.estimation}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
