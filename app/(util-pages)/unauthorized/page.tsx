import type { Metadata } from "next";
import { UnauthorizedView } from "@/components/main/util-pages/unauthorized-view";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Unauthorized",
  description:
    "This Go FlashArch area requires the right account permission before access can continue.",
  path: "/unauthorized",
  noIndex: true,
});

export default function UnauthorizedPage() {
  return <UnauthorizedView />;
}
