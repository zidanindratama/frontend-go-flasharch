import type { Metadata } from "next";
import { LoadTestHero } from "@/components/main/about/load-test/load-test-hero";
import { PinGate } from "@/components/main/about/load-test/pin-gate";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Flash Sale Load Testing",
  description:
    "Review Go FlashArch load testing flows for virtual users, ramp-up pressure, checkout latency, failure rate, queue behavior, and zero-oversell validation.",
  path: "/about/load-test",
  keywords: [
    "K6 load testing",
    "flash sale performance test",
    "checkout latency",
    "zero oversell test",
  ],
});

export default function LoadTestPage() {
  return (
    <>
      <LoadTestHero />
      <PinGate />
    </>
  );
}
