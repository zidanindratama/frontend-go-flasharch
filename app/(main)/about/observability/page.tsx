import type { Metadata } from "next";
import { ObservabilityHero } from "@/components/main/about/observability/observability-hero";
import { ServiceHealth } from "@/components/main/about/observability/service-health";
import { MetricsPanel } from "@/components/main/about/observability/metrics-panel";
import { LogStream } from "@/components/main/about/observability/log-stream";
import { QueueDepth } from "@/components/main/about/observability/queue-depth";
import { TracePreview } from "@/components/main/about/observability/trace-preview";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Flash Sale Observability Dashboard",
  description:
    "Monitor Go FlashArch service health, queue depth, Prometheus-style metrics, Loki-style logs, and Tempo-style traces for high-pressure checkout flows.",
  path: "/about/observability",
  keywords: [
    "flash sale observability",
    "Prometheus metrics",
    "Loki logs",
    "Tempo traces",
    "queue monitoring",
  ],
});

export default function ObservabilityPage() {
  return (
    <>
      <ObservabilityHero />
      <ServiceHealth />
      <MetricsPanel />
      <QueueDepth />
      <LogStream />
      <TracePreview />
    </>
  );
}
