import type { Metadata } from "next";
import { StorefrontHero } from "@/components/main/home/storefront-hero";
import { FeaturedProducts } from "@/components/main/home/featured-products";
import { ActiveFlashSale } from "@/components/main/home/active-flash-sale";
import { ArchitectureProof } from "@/components/main/home/architecture-proof";
import { FinalCTA } from "@/components/common/final-cta";

export const metadata: Metadata = {
  title: "Go FlashArch — High-Performance Flash Sale",
  description:
    "E-commerce and flash sale platform powered by Redis, RabbitMQ, PostgreSQL, and centralized observability.",
};

export default function HomePage() {
  return (
    <>
      <StorefrontHero />
      <FeaturedProducts />
      <ActiveFlashSale />
      <ArchitectureProof />
      <FinalCTA />
    </>
  );
}
