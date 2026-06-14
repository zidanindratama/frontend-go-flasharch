"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronDownIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DateTimeRange = {
  from: Date | undefined
  to: Date | undefined
}

type DateTimeRangePickerProps = {
  value: DateTimeRange
  onChange: (range: DateTimeRange) => void
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
  className?: string
  startError?: string
  endError?: string
}

function mergeDateTime(date: Date | undefined, time: string): string {
  if (!date) return ""
  const [h, m] = time.split(":").map(Number)
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

function parseDate(iso: string): Date | undefined {
  if (!iso) return undefined
  const d = new Date(iso)
  return isNaN(d.getTime()) ? undefined : d
}

function parseTime(iso: string): string {
  if (!iso) return "09:00"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return "09:00"
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
}

export function DateTimeRangePicker({
  value,
  onChange,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  className,
  startError,
  endError,
}: DateTimeRangePickerProps) {
  const [open, setOpen] = useState(false)

  const displayDate = value.from
    ? value.to
      ? `${format(value.from, "MMM d")} – ${format(value.to, "MMM d, yyyy")}`
      : format(value.from, "MMM d, yyyy")
    : "Select date range"

  return (
    <div className={cn("grid gap-4", className)}>
      <Field>
        <FieldLabel>Date range</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 justify-start gap-2 text-sm font-normal text-muted-foreground"
            >
              <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{displayDate}</span>
              <ChevronDownIcon className="h-3 w-3 opacity-50 ml-auto shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: value.from, to: value.to }}
              onSelect={(range) => {
                onChange({ from: range?.from, to: range?.to })
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Start time</FieldLabel>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="h-10 font-mono"
          />
          {startError && <FieldError>{startError}</FieldError>}
        </Field>
        <Field>
          <FieldLabel>End time</FieldLabel>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="h-10 font-mono"
          />
          {endError && <FieldError>{endError}</FieldError>}
        </Field>
      </div>

      {value.from && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          <Clock className="size-3.5 shrink-0" />
          <span>
            <span className="font-medium text-foreground">
              {format(value.from, "MMM d")} {startTime}
            </span>
            {value.to && (
              <>
                {" → "}
                <span className="font-medium text-foreground">
                  {format(value.to, "MMM d")} {endTime}
                </span>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

export { mergeDateTime, parseDate, parseTime }
