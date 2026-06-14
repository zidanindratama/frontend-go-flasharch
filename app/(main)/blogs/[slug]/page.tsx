import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogDetail } from "@/components/main/blogs/blog-detail"
import { getBlog } from "@/lib/api/blogs"
import { createPageMetadata } from "@/lib/seo"

type BlogDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const response = await getBlog(slug)
    const post = response.data.data

    const metadata = createPageMetadata({
      title: post.title,
      description: post.excerpt,
      path: `/blogs/${post.slug}`,
      keywords: [
        post.category?.name ?? "Blog",
        "Go FlashArch",
        "flash sale buyer guide",
      ],
    })

    return {
      ...metadata,
      openGraph: {
        ...metadata.openGraph,
        type: "article",
        publishedTime: post.published_at ?? undefined,
        authors: [post.author],
        tags: [post.category?.name ?? "Blog", "Go FlashArch"],
      },
    }
  } catch {
    return {
      title: "Blog Not Found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params

  try {
    const response = await getBlog(slug)
    const post = response.data.data
    return <BlogDetail post={post} />
  } catch {
    notFound()
  }
}
