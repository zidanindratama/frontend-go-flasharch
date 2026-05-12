"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  type?: "chars" | "words";
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.03,
  type = "chars",
  as: Tag = "span",
}: SplitTextProps) {
  const items = type === "chars" ? text.split("") : text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <Tag className={cn("inline-block", className)}>
      <motion.span
        className="inline-flex flex-nowrap"
        variants={container}
        initial="hidden"
        animate="visible"
        style={{ perspective: "500px" }}
      >
        {items.map((item, i) => (
          <motion.span
            key={i}
            variants={child}
            className="inline-block"
            style={{ transformStyle: "preserve-3d" }}
          >
            {item === " " ? "\u00A0" : item}
            {type === "words" && i < items.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
