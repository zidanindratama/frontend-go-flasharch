import type { Metadata } from "next";
import { ArchitectureHero } from "@/components/main/about/architecture/architecture-hero";
import { SystemFlow } from "@/components/main/about/architecture/system-flow";
import { ComponentRationale } from "@/components/main/about/architecture/component-rationale";
import { CheckoutSequence } from "@/components/main/about/architecture/checkout-sequence";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Flash Sale System Architecture",
  description:
    "See how Go FlashArch routes high-traffic checkout requests through a Next.js frontend, Golang API, Redis stock gate, RabbitMQ queue, worker, PostgreSQL, and observability stack.",
  path: "/about/architecture",
  keywords: [
    "flash sale architecture",
    "Redis stock reservation",
    "RabbitMQ checkout queue",
    "Golang API architecture",
  ],
});

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
