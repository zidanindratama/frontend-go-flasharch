"use client"

import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getBuyerAddresses,
  type UserAddress,
} from "@/lib/api/account"
import { useAuthStore } from "@/stores/auth"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function AddressCard({ address }: { address: UserAddress }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease }}
      className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              {address.label || "Address"}
            </h2>
            {address.is_default ? (
              <span className="rounded-full bg-[#FF6600]/10 px-2 py-0.5 text-[11px] font-medium text-[#FF6600]">
                Default
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">
            {address.recipient_name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{address.phone}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {address.address_line}, {address.district}, {address.city},{" "}
            {address.province} {address.postal_code}
          </p>
          {address.notes ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Notes: {address.notes}
            </p>
          ) : null}
        </div>
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
    </motion.div>
  )
}

export function AccountAddresses() {
  const token = useAuthStore((s) => s.access_token)
  const { data, isLoading } = useQuery({
    queryKey: ["buyer-addresses"],
    queryFn: async () => {
      const response = await getBuyerAddresses()
      return response.data
    },
    enabled: !!token,
  })

  const addresses = data?.data.items ?? []

  return (
    <div className="space-y-4">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.45, ease }}
        className="text-lg font-bold tracking-tight lg:text-xl"
      >
        My Addresses
      </motion.h1>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : addresses.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl bg-card px-4 py-20 text-center ring-1 ring-foreground/10">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
            <MapPin className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <h2 className="text-base font-semibold tracking-tight">
            No saved addresses
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Shipping addresses created from the buyer API will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
