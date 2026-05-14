import type { Metadata } from "next";
import { AboutHero } from "@/components/main/about/about-hero";
import { ThesisProblem } from "@/components/main/about/thesis-problem";
import { ResearchArchitecture } from "@/components/main/about/research-architecture";
import { AboutPages } from "@/components/main/about/about-pages";
import { ThesisContribution } from "@/components/main/about/thesis-contribution";

export const metadata: Metadata = {
  title: "About Thesis — Go FlashArch",
  description:
    "Thesis context for Go FlashArch: high-performance flash sale backend architecture with Redis, RabbitMQ, PostgreSQL, and centralized observability.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <ThesisProblem />
      <ResearchArchitecture />
      <AboutPages />
      <ThesisContribution />
    </>
  );
}
