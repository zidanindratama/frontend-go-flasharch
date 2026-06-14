"use client"

import { useCallback, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { History, Warehouse, Settings2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SingleSelect } from "@/components/common/single-select"
import { InventoryStocksTable } from "@/components/dashboard/products/inventory-stocks-table"
import { InventoryMovementsTable } from "@/components/dashboard/products/inventory-movements-table"
import { listAdminProducts } from "@/lib/api/catalog"

export function InventoryTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") === "movements" ? "movements" : "stocks"
  const [selectedProductId, setSelectedProductId] = useState("")

  const productsQuery = useQuery({
    queryKey: ["admin-products-select"],
    queryFn: async () => {
      const response = await listAdminProducts({ per_page: 100, status: "active" })
      return response.data.data.items
    },
  })

  const setTab = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "movements") params.set("tab", "movements")
      else params.delete("tab")
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams],
  )

  function handleAdjust() {
    if (selectedProductId) {
      router.push(`/dashboard/products/inventory/adjust/${selectedProductId}`)
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <section className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/10 px-3 py-1 text-xs font-semibold text-[#FF6600]">
            <Warehouse className="size-3.5" />
            Stock overview
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Inventory
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Monitor stock levels, track adjustments, and review movement history across warehouses.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SingleSelect
            value={selectedProductId}
            onChange={setSelectedProductId}
            placeholder="Select product to adjust"
            searchPlaceholder="Search products..."
            className="w-full sm:w-64"
            options={
              productsQuery.data?.map((p) => ({
                value: p.id,
                label: p.name,
                description: p.sku,
              })) ?? []
            }
          />
          <button
            onClick={handleAdjust}
            disabled={!selectedProductId}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-[#FF6600] px-4 text-sm font-medium text-white transition-colors hover:bg-[#e65c00] disabled:pointer-events-none disabled:opacity-50"
          >
            <Settings2 className="size-4" />
            Adjust
          </button>
        </div>
      </section>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList variant="line" className="w-full justify-start gap-6 border-b px-0">
          <TabsTrigger value="stocks" className="gap-1.5">
            <Warehouse className="size-3.5" />
            Stocks
          </TabsTrigger>
          <TabsTrigger value="movements" className="gap-1.5">
            <History className="size-3.5" />
            Movements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stocks">
          <InventoryStocksTable />
        </TabsContent>

        <TabsContent value="movements">
          <InventoryMovementsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
