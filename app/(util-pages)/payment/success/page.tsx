import { Suspense } from "react"
import type { Metadata } from "next"
import { Loader2 } from "lucide-react"
import { PaymentSuccessView } from "@/components/main/util-pages/payment-success-view"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Payment Successful",
  description:
    "Your payment has been confirmed. Check your orders for details.",
  path: "/payment/success",
  noIndex: true,
})

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PaymentSuccessView />
    </Suspense>
  )
}
