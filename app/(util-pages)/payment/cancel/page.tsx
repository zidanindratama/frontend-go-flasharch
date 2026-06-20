import { Suspense } from "react"
import type { Metadata } from "next"
import { Loader2 } from "lucide-react"
import { PaymentCancelView } from "@/components/main/util-pages/payment-cancel-view"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Payment Cancelled",
  description:
    "You cancelled the payment. Your cart is saved and ready when you are.",
  path: "/payment/cancel",
  noIndex: true,
})

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PaymentCancelView />
    </Suspense>
  )
}
