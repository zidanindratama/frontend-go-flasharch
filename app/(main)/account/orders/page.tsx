"use client"

import { motion } from "framer-motion"
import { PlaceholderPage } from "@/components/account/placeholder-page"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function OrdersPage() {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.55, ease }}
        className="text-lg font-bold tracking-tight lg:hidden"
      >
        Orders
      </motion.h1>
      <PlaceholderPage title="My Orders" />
    </div>
  )
}
