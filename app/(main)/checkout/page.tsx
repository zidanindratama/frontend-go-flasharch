import type { Metadata } from "next"
import { CheckoutPage } from "@/components/checkout/checkout-page"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Selesaikan pesanan Anda",
}

export default function Checkout() {
  return <CheckoutPage />
}
