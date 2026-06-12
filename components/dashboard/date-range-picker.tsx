"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

type DateRangePickerProps = {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

const presets = [
  { label: "Last 7 days", from: new Date(Date.now() - 7 * 86400000), to: new Date() },
  { label: "Last 30 days", from: new Date(Date.now() - 30 * 86400000), to: new Date() },
  { label: "Last 90 days", from: new Date(Date.now() - 90 * 86400000), to: new Date() },
  { label: "This month", from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date() },
]

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const display = value.from
    ? value.to
      ? `${format(value.from, "MMM d")} – ${format(value.to, "MMM d, yyyy")}`
      : format(value.from, "MMM d, yyyy")
    : "Select date range"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 gap-2 text-sm font-normal text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{display}</span>
          <ChevronDownIcon className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          <div className="flex flex-col gap-1 border-r border-border p-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  onChange({ from: preset.from, to: preset.to })
                  setOpen(false)
                }}
                className="rounded-md px-3 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <Calendar
            mode="range"
            selected={{ from: value.from, to: value.to }}
            onSelect={(range) => {
              onChange({ from: range?.from, to: range?.to })
            }}
            numberOfMonths={2}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
