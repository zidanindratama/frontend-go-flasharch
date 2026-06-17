"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlashSaleForm } from "./flash-sale-form"
import { getAdminFlashSale } from "@/lib/api/flash-sale"

export function EditFlashSaleLoader() {
  const params = useParams<{ id: string }>()

  const saleQuery = useQuery({
    queryKey: ["admin.flashSales", params.id],
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

  if (saleQuery.isError || !saleQuery.data) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-muted-foreground">Flash sale not found.</p>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Link href="/dashboard/flash-sales">
            <ArrowLeft className="size-4" />
            All flash sales
          </Link>
        </Button>
      </div>
    )
  }

  return <FlashSaleForm mode="edit" sale={saleQuery.data} />
}
