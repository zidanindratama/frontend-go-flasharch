import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetail } from "@/components/main/blogs/blog-detail";
import { blogPosts, getBlogCategory, getBlogPostBySlug } from "@/lib/blogs";

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
      title: "Guide Not Found | Go FlashArch",
    };
  }

  const category = getBlogCategory(post.categoryId);

  return {
    title: `${post.title} | Go FlashArch`,
    description: post.excerpt,
    keywords: [category?.name ?? "Shopping Guide", "Go FlashArch"],
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
