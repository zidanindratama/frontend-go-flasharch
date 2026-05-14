import type { Metadata } from "next";
import { BlogIndex } from "@/components/main/blogs/blog-index";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Flash Sale Shopping Guides",
  description:
    "Read practical Go FlashArch guides for flash sale preparation, account safety, stock-aware shopping, checkout timing, and calmer limited-drop decisions.",
  path: "/blogs",
  keywords: [
    "flash sale guides",
    "shopping tips",
    "checkout preparation",
    "buyer safety",
  ],
});

export default function BlogsPage() {
  return <BlogIndex />;
}
