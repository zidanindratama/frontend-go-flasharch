import type { Metadata } from "next";
import { StorefrontHero } from "@/components/main/home/storefront-hero";
import { FeaturedProducts } from "@/components/main/home/featured-products";
import { ShopperTrust } from "@/components/main/home/shopper-trust";
import { ActiveFlashSale } from "@/components/main/home/active-flash-sale";
import { HowItWorksForYou } from "@/components/main/home/how-it-works-for-you";
import { ArchitectureProof } from "@/components/main/home/architecture-proof";
import { DropPrep } from "@/components/main/home/drop-prep";
import { FinalCTA } from "@/components/common/final-cta";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Flash Sale Shopping With Stock-Safe Checkout",
  description:
    "Shop limited drops on Go FlashArch with clearer stock signals, faster checkout, queue-aware order states, and backend reliability built for traffic spikes.",
  path: "/",
  keywords: [
    "flash sale shopping",
    "limited stock checkout",
    "stock-safe e-commerce",
  ],
});

export default function HomePage() {
  return (
    <>
      <StorefrontHero />
      <FeaturedProducts />
      <ShopperTrust />
      <ActiveFlashSale />
      <HowItWorksForYou />
      <ArchitectureProof />
      <DropPrep />
      <FinalCTA />
    </>
  );
}
