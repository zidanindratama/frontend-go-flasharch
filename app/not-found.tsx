"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-24 text-foreground">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,102,0,0.08),transparent_35%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card"
        >
          <Compass className="h-10 w-10 text-[#FF6600]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: smoothEase, delay: 0.15 }}
          className="mt-8"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            404 — Not Found
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: smoothEase, delay: 0.25 }}
          className="mt-4 text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl"
        >
          Lost in the stack.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: smoothEase, delay: 0.4 }}
          className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          The page you are looking for does not exist or has been moved. Check
          the URL or head back to safety.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: smoothEase, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6600] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e65c00]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Browse Products
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 font-mono text-xs text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted-foreground opacity-40" />
              <span className="relative inline-flex h-full w-full rounded-full bg-muted-foreground" />
            </span>
            trace_id: not_found_404
          </span>
        </motion.div>
      </div>
    </div>
  );
}
