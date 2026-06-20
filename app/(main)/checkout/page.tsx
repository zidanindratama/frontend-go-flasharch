import type { Metadata } from "next"
import { CheckoutPage } from "@/components/checkout/checkout-page"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Selesaikan pesanan Anda",
}

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; item_id?: string }>
}) {
  const params = await searchParams
  return <CheckoutPage source={params.source} itemId={params.item_id} />
}
