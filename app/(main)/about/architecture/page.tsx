import type { Metadata } from "next";
import { ArchitectureHero } from "@/components/main/about/architecture/architecture-hero";
import { SystemFlow } from "@/components/main/about/architecture/system-flow";
import { ComponentRationale } from "@/components/main/about/architecture/component-rationale";
import { CheckoutSequence } from "@/components/main/about/architecture/checkout-sequence";

export const metadata: Metadata = {
  title: "Architecture | Go FlashArch",
  description:
    "System architecture for Go FlashArch: Frontend, API, Redis, RabbitMQ, Worker, PostgreSQL, and centralized observability.",
};

export default function ArchitecturePage() {
  return (
    <>
      <ArchitectureHero />
      <SystemFlow />
      <ComponentRationale />
      <CheckoutSequence />
    </>
  );
}
