"use client";

import { Marquee } from "@/components/common/marquee";

export function FlashSaleTicker() {
  return (
    <div className="relative w-full border-b border-border bg-[#FF6600]/[0.03] py-3">
      <Marquee
        items={[
          "Deals disappear fast",
          "Real stock only",
          "No restocks",
          "Fair checkout",
          "Live countdown",
          "Limited quantities",
        ]}
        speed={35}
      />
    </div>
  );
}
