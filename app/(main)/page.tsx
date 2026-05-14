import type { Metadata } from "next";
import { StorefrontHero } from "@/components/main/home/storefront-hero";
import { FeaturedProducts } from "@/components/main/home/featured-products";
import { ShopperTrust } from "@/components/main/home/shopper-trust";
import { ActiveFlashSale } from "@/components/main/home/active-flash-sale";
import { HowItWorksForYou } from "@/components/main/home/how-it-works-for-you";
import { ArchitectureProof } from "@/components/main/home/architecture-proof";
import { DropPrep } from "@/components/main/home/drop-prep";
import { FinalCTA } from "@/components/common/final-cta";

export const metadata: Metadata = {
  title: "Go FlashArch - Flash Sale Shopping",
  description:
    "Shop limited drops with clearer stock, faster checkout, and order updates you can trust.",
};

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
