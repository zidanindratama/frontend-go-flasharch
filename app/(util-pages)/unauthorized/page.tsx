import type { Metadata } from "next";
import { UnauthorizedView } from "@/components/main/util-pages/unauthorized-view";

export const metadata: Metadata = {
  title: "Unauthorized — Go FlashArch",
  description: "You do not have permission to access this resource.",
};

export default function UnauthorizedPage() {
  return <UnauthorizedView />;
}
