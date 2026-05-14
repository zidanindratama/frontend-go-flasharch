import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getBlogCategory,
  getRelatedPosts,
  type BlogPost,
} from "@/lib/blogs";

export function BlogDetail({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.categoryId);
  const relatedPosts = getRelatedPosts(post, 3);

  return (
    <article className="relative min-h-screen overflow-hidden bg-background pt-28">
      <div className="absolute inset-x-0 top-20 h-px bg-border" />
      <div className="absolute right-0 top-24 size-[28rem] rounded-full bg-[#FF6600]/8 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 pb-24">
        <Button
          asChild
          variant="ghost"
          className="mb-8 rounded-full text-muted-foreground"
        >
          <Link href="/blogs">
            <ArrowLeft className="mr-2 size-4" />
            Back to guides
          </Link>
        </Button>

        <div className="border-b border-border pb-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="rounded-full">
              {category?.name}
            </Badge>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              {new Intl.DateTimeFormat("en", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(post.publishedAt))}
            </span>
            <span className="text-sm text-muted-foreground">
              {post.readMinutes} min read
            </span>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-[72ch] text-lg leading-8 text-muted-foreground">
            {post.excerpt}
          </p>
        </div>

        <div
          className="mt-10 max-w-none text-base leading-8 text-foreground/88 [&_blockquote]:my-8 [&_blockquote]:rounded-lg [&_blockquote]:border [&_blockquote]:border-[#FF6600]/25 [&_blockquote]:bg-[#FF6600]/8 [&_blockquote]:p-5 [&_blockquote]:font-medium [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_table]:my-8 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_table]:border-border [&_td]:border-t [&_td]:border-border [&_td]:p-3 [&_th]:bg-muted [&_th]:p-3 [&_th]:text-left [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <section className="mt-16 border-t border-border pt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
                Keep reading
              </span>
              <h2 className="mt-2 text-2xl font-bold">Related guides</h2>
            </div>
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/blogs">
                View all
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((item) => {
              const relatedCategory = getBlogCategory(item.categoryId);

              return (
                <Link
                  key={item.id}
                  href={`/blogs/${item.slug}`}
                  className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-[#FF6600]/35"
                >
                  <Badge variant="outline" className="rounded-full">
                    {relatedCategory?.name}
                  </Badge>
                  <h3 className="mt-5 text-lg font-semibold leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {item.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center text-sm font-medium text-[#FF6600]">
                    Read next
                    <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </article>
  );
}
