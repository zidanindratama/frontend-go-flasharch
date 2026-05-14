import type { Metadata } from "next";
import { MaintenanceView } from "@/components/main/util-pages/maintenance-view";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Maintenance",
  description:
    "Go FlashArch is undergoing scheduled maintenance. Core shopping and flash sale flows will return shortly.",
  path: "/maintenance",
  noIndex: true,
});

export default function MaintenancePage() {
  return <MaintenanceView />;
}
