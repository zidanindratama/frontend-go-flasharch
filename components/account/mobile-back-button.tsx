"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function MobileBackButton() {
  return (
    <Link
      href="/account"
      className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:hidden"
    >
      <ArrowLeft className="h-4 w-4" />
      Account
    </Link>
  )
}
