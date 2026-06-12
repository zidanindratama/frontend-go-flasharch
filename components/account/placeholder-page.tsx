"use client"

import { motion } from "framer-motion"
import { Construction } from "lucide-react"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col items-center justify-center py-24"
    >
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/60">
        <Construction className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 max-w-sm text-center text-sm text-muted-foreground">
        This section is coming soon. We&apos;re building the tools you need to
        manage your flash-sale shopping experience.
      </p>
    </motion.div>
  )
}
