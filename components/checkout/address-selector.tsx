"use client"

import { MapPin, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAddresses } from "@/lib/hooks/use-addresses"
import type { UserAddress } from "@/lib/api/account"
import Link from "next/link"
import { motion } from "framer-motion"

const ease = [0.16, 1, 0.3, 1] as const

interface AddressSelectorProps {
  selectedAddressId: string | null
  onSelect: (address: UserAddress) => void
}

export function AddressSelector({ selectedAddressId, onSelect }: AddressSelectorProps) {
  const { data: addresses, isLoading } = useAddresses()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-[88px] animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    )
  }

  if (!addresses || addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <MapPin className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <p className="text-sm font-medium">No saved addresses yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add a shipping address to continue
        </p>
        <Button asChild variant="link" className="mt-4 h-auto p-0 text-xs font-semibold text-[#FF6600]">
          <Link href="/account/addresses">
            <Plus className="mr-1 h-3 w-3" />
            Add Address
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {addresses.map((address, index) => {
        const selected = selectedAddressId === address.id
        return (
          <motion.button
            key={address.id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05, ease }}
            onClick={() => onSelect(address)}
            className={`group flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-300 ${
              selected
                ? "border-[#FF6600]/40 bg-[#FF6600]/[0.03] shadow-sm"
                : "border-transparent bg-muted/50 hover:bg-muted/80"
            }`}
          >
            <div
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all duration-300 ${
                selected
                  ? "border-[#FF6600] bg-[#FF6600]"
                  : "border-muted-foreground/30 group-hover:border-muted-foreground/50"
              }`}
            >
              {selected && (
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{address.label}</span>
                {address.is_default && (
                  <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {address.recipient_name} · {address.phone}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground/70">
                {address.address_line}, {address.district}, {address.city}, {address.province}{" "}
                {address.postal_code}
              </p>
            </div>
          </motion.button>
        )
      })}

      <Button asChild variant="ghost" className="mt-2 h-9 w-full text-xs font-medium text-muted-foreground hover:text-foreground">
        <Link href="/account/addresses">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Manage addresses
        </Link>
      </Button>
    </div>
  )
}
