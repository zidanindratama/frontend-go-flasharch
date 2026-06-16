"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { AddressForm } from "@/components/account/addresses/address-form"
import { getAddress } from "@/lib/api/account"
import { useAuthStore } from "@/stores/auth"

export default function EditAddressPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const token = useAuthStore((s) => s.access_token)

  const { data, isLoading, error } = useQuery({
    queryKey: ["address", params.id],
    queryFn: async () => {
      const response = await getAddress(params.id)
      return response.data
    },
    enabled: !!token && !!params.id,
  })

  useEffect(() => {
    if (error) router.push("/account/addresses")
  }, [error, router])

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  if (!data?.data) return null

  return <AddressForm mode="edit" initialData={data.data} />
}
