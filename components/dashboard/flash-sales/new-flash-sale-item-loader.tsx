"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { FlashSaleItemForm } from "./flash-sale-item-form"
import { getAdminFlashSale } from "@/lib/api/flash-sale"

export function NewFlashSaleItemLoader() {
  const params = useParams<{ id: string }>()

  const saleQuery = useQuery({
    queryKey: ["admin-flash-sale", params.id],
    queryFn: async () => {
      const response = await getAdminFlashSale(params.id)
      return response.data.data
    },
    enabled: !!params.id,
  })

  if (saleQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <FlashSaleItemForm mode="create" saleId={params.id} saleName={saleQuery.data?.name} />
}
