import type { Metadata } from "next";
import { ObservabilityHero } from "@/components/main/observability/observability-hero";
import { ServiceHealth } from "@/components/main/observability/service-health";
import { MetricsPanel } from "@/components/main/observability/metrics-panel";
import { LogStream } from "@/components/main/observability/log-stream";
import { QueueDepth } from "@/components/main/observability/queue-depth";
import { TracePreview } from "@/components/main/observability/trace-preview";

export const metadata: Metadata = {
  title: "Observability — Go FlashArch",
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
