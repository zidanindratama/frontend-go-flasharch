import type { Metadata } from "next";
import { MaintenanceView } from "@/components/main/util-pages/maintenance-view";

export const metadata: Metadata = {
  title: "Maintenance — Go FlashArch",
  description: "The system is undergoing scheduled maintenance.",
};

export default function MaintenancePage() {
  return <MaintenanceView />;
}
