import type { Metadata } from "next";
import { ComingSoonView } from "@/components/main/util-pages/coming-soon-view";

export const metadata: Metadata = {
  title: "Coming Soon — Go FlashArch",
  description: "This feature is under development and will be available soon.",
};

export default function ComingSoonPage() {
  return <ComingSoonView />;
}
