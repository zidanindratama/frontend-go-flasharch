"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search products...",
  className,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue)
      }
    }, 320)
    return () => window.clearTimeout(handle)
  }, [inputValue, onChange, value])

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-full border-border bg-background pl-11 pr-11 text-base ring-offset-background transition-all focus-visible:ring-[#FF6600]/30 focus-visible:border-[#FF6600]/50"
      />
      {inputValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            setInputValue("")
            onChange("")
          }}
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
