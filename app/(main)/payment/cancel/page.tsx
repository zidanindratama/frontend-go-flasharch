"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="flex max-w-md flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: smoothEase }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted"
        >
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: smoothEase }}
          className="text-2xl font-bold tracking-tight"
        >
          Payment cancelled
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45, ease: smoothEase }}
          className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground"
        >
          You cancelled the payment. Your cart items are still saved. You can
          try checkout again whenever you are ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45, ease: smoothEase }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild className="gap-2 rounded-full">
            <Link href="/account/cart">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 rounded-full">
            <Link href="/products">
              <ShoppingCart className="h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
