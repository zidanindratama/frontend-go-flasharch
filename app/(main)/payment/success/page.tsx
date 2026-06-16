"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function PaymentSuccessPage() {
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
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: smoothEase }}
          className="text-2xl font-bold tracking-tight"
        >
          Payment successful
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45, ease: smoothEase }}
          className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground"
        >
          Your payment has been processed. You will receive an email
          confirmation shortly. Check your orders for details.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45, ease: smoothEase }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild className="gap-2 rounded-full">
            <Link href="/account/orders">
              <ShoppingBag className="h-4 w-4" />
              View Orders
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
