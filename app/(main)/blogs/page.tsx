import type { Metadata } from "next";
import { BlogIndex } from "@/components/main/blogs/blog-index";

export const metadata: Metadata = {
  title: "Guides | Go FlashArch",
  description:
    "Shopping guides, flash sale tips, account safety notes, and product ideas for Go FlashArch buyers.",
};

export default function BlogsPage() {
  return <BlogIndex />;
}
