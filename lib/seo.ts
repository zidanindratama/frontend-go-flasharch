import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://frontend-go-flasharch.vercel.app";

export const siteConfig = {
  name: "Go FlashArch",
  title: "Go FlashArch - High-Performance Flash Sale Commerce",
  description:
    "High-performance flash sale commerce powered by Redis, RabbitMQ, PostgreSQL, and centralized observability.",
  author: "Muhamad Zidan Indratama",
  creator: "Muhamad Zidan Indratama",
  category: "E-Commerce Technology",
  ogImage: "/og-image.png",
  keywords: [
    "Go FlashArch",
    "flash sale platform",
    "high performance e-commerce",
    "Redis stock reservation",
    "RabbitMQ queue",
    "PostgreSQL checkout",
    "Golang backend",
    "Next.js e-commerce",
    "observability dashboard",
    "Prometheus metrics",
    "Loki logs",
    "Tempo tracing",
    "K6 load testing",
    "stock-safe checkout",
    "Gunadarma thesis",
  ],
};

type PageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = siteConfig.ogImage,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} cover image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
