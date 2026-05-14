import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetail } from "@/components/main/blogs/blog-detail";
import { blogPosts, getBlogCategory, getBlogPostBySlug } from "@/lib/blogs";
import { createPageMetadata } from "@/lib/seo";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Guide Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const category = getBlogCategory(post.categoryId);
  const metadata = createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blogs/${post.slug}`,
    keywords: [
      category?.name ?? "Shopping Guide",
      "Go FlashArch guide",
      "flash sale buyer guide",
    ],
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: [category?.name ?? "Shopping Guide", "Go FlashArch"],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetail post={post} />;
}
