"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/common/marquee";
import { ArrowUpRight, Zap } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FlashSaleCTA() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600]/[0.07] via-transparent to-[#DC143C]/[0.05]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 flex size-14 items-center justify-center rounded-full bg-[#FF6600]/10 text-[#FF6600]"
          >
            <Zap className="size-7" />
          </motion.div>

          <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
            Ready to grab your deal?
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Stock is limited. Checkout is fair. Every second counts.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full bg-[#FF6600] px-8 text-base font-semibold text-white hover:bg-[#e65c00]"
          >
            <Link href="#deals">
              Enter flash sale
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="relative border-t border-border/50 py-3">
        <Marquee
          items={[
            "Every second counts",
            "Stock is real",
            "Claim before it is gone",
            "Fair checkout",
            "Live countdown",
          ]}
          speed={40}
          direction="right"
        />
      </div>
    </section>
  );
}
