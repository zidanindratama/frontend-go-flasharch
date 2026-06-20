import type { Metadata } from "next";
import { FlashSaleTicker } from "@/components/main/flash-sale/flash-sale-ticker";
import { FlashSaleHero } from "@/components/main/flash-sale/flash-sale-hero";
import { FlashSaleProgressBar } from "@/components/main/flash-sale/flash-sale-progress-bar";
import { FlashSaleItemGrid } from "@/components/main/flash-sale/flash-sale-item-grid";
import { FlashSaleLiveStats } from "@/components/main/flash-sale/flash-sale-live-stats";
import { FlashSaleHowItWorks } from "@/components/main/flash-sale/flash-sale-how-it-works";
import { FlashSaleTrustBar } from "@/components/main/flash-sale/flash-sale-trust-bar";
import { FlashSaleCTA } from "@/components/main/flash-sale/flash-sale-cta";
import { FlashSaleCheckoutBanner } from "@/components/main/flash-sale/flash-sale-checkout-banner";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Flash Sale - Grab Deals Before They Disappear",
  description:
    "Shop limited-time flash sales on Go FlashArch. Real stock, fair checkout, live countdown. Every second counts.",
  path: "/flash-sale",
  keywords: ["flash sale", "limited deals", "live sale", "discount"],
});

export default function FlashSalePage() {
  return (
    <>
      <FlashSaleCheckoutBanner />
      <FlashSaleTicker />
      <FlashSaleHero />
      <FlashSaleProgressBar />
      <FlashSaleItemGrid />
      <FlashSaleLiveStats />
      <FlashSaleHowItWorks />
      <FlashSaleTrustBar />
      <FlashSaleCTA />
    </>
  );
}
