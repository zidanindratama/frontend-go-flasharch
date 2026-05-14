import type { Metadata } from "next";
import { AboutHero } from "@/components/main/about/about-hero";
import { ThesisProblem } from "@/components/main/about/thesis-problem";
import { ResearchArchitecture } from "@/components/main/about/research-architecture";
import { AboutPages } from "@/components/main/about/about-pages";
import { ThesisContribution } from "@/components/main/about/thesis-contribution";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About the Flash Sale Architecture Thesis",
  description:
    "Explore the Go FlashArch thesis context: a high-performance flash sale architecture using Redis, RabbitMQ, PostgreSQL, Golang, and centralized observability.",
  path: "/about",
  keywords: [
    "flash sale thesis",
    "backend architecture thesis",
    "Redis RabbitMQ PostgreSQL",
    "Muhamad Zidan Indratama",
  ],
});

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
