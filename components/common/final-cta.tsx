"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FinalCTA() {
  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#FF6600]/[0.02] to-background" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#FF6600]/5 blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: smoothEase }}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Ready for the{" "}
          <span className="text-[#FF6600]">drop?</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          Experience atomic stock safety under pressure. Join thousands of
          buyers in the next flash sale event.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#FF6600] px-8 text-base font-semibold text-white hover:bg-[#e65c00]"
          >
            <Link href="/flash-sale">
              View Flash Sale
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-border px-8 text-base"
          >
            <Link href="/about">About Thesis</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
