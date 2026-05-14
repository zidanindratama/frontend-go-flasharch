import type { Metadata } from "next";
import { ComingSoonView } from "@/components/main/util-pages/coming-soon-view";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Coming Soon",
  description:
    "This Go FlashArch feature is under development and will be available in a future release.",
  path: "/coming-soon",
  noIndex: true,
});

export default function ComingSoonPage() {
  return <ComingSoonView />;
}
