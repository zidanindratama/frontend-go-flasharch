"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlashSaleItemForm } from "./flash-sale-item-form"
import { getAdminFlashSale } from "@/lib/api/flash-sale"

export function EditFlashSaleItemLoader() {
  const params = useParams<{ id: string; itemId: string }>()

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

  const item = saleQuery.data.items?.find((i) => i.id === params.itemId)

  if (!item) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-muted-foreground">Item not found.</p>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Link href={`/dashboard/flash-sales/${params.id}`}>
            <ArrowLeft className="size-4" />
            Back to sale
          </Link>
        </Button>
      </div>
    )
  }

  return <FlashSaleItemForm mode="edit" saleId={params.id} item={item} saleName={saleQuery.data.name} />
}
