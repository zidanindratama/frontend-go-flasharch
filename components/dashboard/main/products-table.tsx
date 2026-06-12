"use client"

type ProductRow = {
  product_id: string
  name: string
  sku: string
  sold_quantity: number
  gross_revenue_amount: number
}

type ProductsTableProps = {
  products: ProductRow[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount / 100)
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border bg-background text-sm text-muted-foreground">
        No products yet
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-2.5 sm:hidden">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="rounded-xl border border-border bg-background p-3"
          >
            <div className="min-w-0">
              <p className="line-clamp-2 font-medium leading-5 text-foreground">
                {product.name}
              </p>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                {product.sku}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                Sold {product.sold_quantity.toLocaleString("id-ID")}
              </span>
              <span className="font-semibold tabular-nums text-foreground">
                {formatCurrency(product.gross_revenue_amount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">Product</th>
            <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">SKU</th>
            <th className="pb-3 pr-4 text-right font-medium text-muted-foreground">Sold</th>
            <th className="pb-3 text-right font-medium text-muted-foreground">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.product_id}
              className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
            >
              <td className="py-3 pr-4 font-medium text-foreground truncate max-w-[200px]">
                {product.name}
              </td>
              <td className="py-3 pr-4 text-muted-foreground font-mono text-xs">
                {product.sku}
              </td>
              <td className="py-3 pr-4 text-right tabular-nums text-foreground">
                {product.sold_quantity.toLocaleString("id-ID")}
              </td>
              <td className="py-3 text-right font-medium tabular-nums text-foreground">
                {formatCurrency(product.gross_revenue_amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}
