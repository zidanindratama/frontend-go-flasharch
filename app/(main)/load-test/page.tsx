import type { Metadata } from "next";
import { LoadTestHero } from "@/components/main/load-test/load-test-hero";
import { PinGate } from "@/components/main/load-test/pin-gate";

export const metadata: Metadata = {
  title: "Load Test — Go FlashArch",
  description:
    "Simulate flash sale traffic with configurable virtual users, ramp-up, and target endpoints. PIN-protected execution.",
};

export default function LoadTestPage() {
  return (
    <>
      <LoadTestHero />
      <PinGate />
    </>
  );
}
