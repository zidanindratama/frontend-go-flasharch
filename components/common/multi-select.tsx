"use client"

import { useMemo, useState } from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"

export type MultiSelectOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

type MultiSelectProps = {
  value: string[]
  options: MultiSelectOption[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
}

export function MultiSelect({
  value,
  options,
  onChange,
  placeholder = "Select options",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const selected = useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value],
  )

  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue))
      return
    }
    onChange([...value, optionValue])
  }

  function remove(optionValue: string) {
    onChange(value.filter((item) => item !== optionValue))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "min-h-10 w-full justify-between rounded-xl px-2.5 py-2 text-left font-normal",
            selected.length > 0 ? "h-auto" : "h-10",
            className,
          )}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {selected.length === 0 ? (
              <span className="truncate text-muted-foreground">
                {placeholder}
              </span>
            ) : (
              selected.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="max-w-full gap-1 rounded-md pr-1"
                >
                  <span className="truncate">{option.label}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${option.label}`}
                    className="rounded-sm p-0.5 opacity-60 transition-opacity hover:opacity-100"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      remove(option.value)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        remove(option.value)
                      }
                    }}
                  >
                    <X />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Search />
                {emptyText}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const checked = value.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.description ?? ""}`}
                    disabled={option.disabled}
                    onSelect={() => toggle(option.value)}
                    data-checked={checked}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded border border-input",
                        checked && "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {checked && <Check />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{option.label}</span>
                      {option.description && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </span>
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
