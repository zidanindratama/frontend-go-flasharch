import type { Metadata } from "next";
import { ObservabilityHero } from "@/components/main/about/observability/observability-hero";
import { ServiceHealth } from "@/components/main/about/observability/service-health";
import { MetricsPanel } from "@/components/main/about/observability/metrics-panel";
import { LogStream } from "@/components/main/about/observability/log-stream";
import { QueueDepth } from "@/components/main/about/observability/queue-depth";
import { TracePreview } from "@/components/main/about/observability/trace-preview";

export const metadata: Metadata = {
  title: "Observability | Go FlashArch",
  description:
    "Real-time operational dashboard for Go FlashArch: service health, metrics, logs, queue depth, distributed traces, and API contracts.",
};

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
