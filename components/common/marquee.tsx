"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export function Marquee({
  items,
  speed = 30,
  direction = "left",
  className,
}: MarqueeProps) {
  const duplicated = [...items, ...items, ...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex gap-8"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6600]" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
