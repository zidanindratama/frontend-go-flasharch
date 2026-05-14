import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getBlogCategory,
  getRelatedPosts,
  type BlogPost,
} from "@/lib/blogs";

export function BlogDetail({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.categoryId);
  const relatedPosts = getRelatedPosts(post, 3);
  const headings = extractHeadings(post.html);

  return (
    <article className="relative min-h-screen overflow-hidden bg-background pt-24">
      <div className="absolute inset-x-0 top-20 h-px bg-border" />
      <div className="absolute right-0 top-28 size-[26rem] rounded-full bg-[#FF6600]/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24">
        <Button
          asChild
          variant="ghost"
          className="mb-10 rounded-full text-muted-foreground"
        >
          <Link href="/blogs">
            <ArrowLeft className="mr-2 size-4" />
            Back to guides
          </Link>
        </Button>

        <header className="grid gap-10 border-y border-border py-12 lg:grid-cols-[16rem_1fr]">
          <div className="order-2 border-t border-border pt-8 lg:order-1 lg:border-t-0 lg:pt-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
              {category?.name}
            </p>
            <dl className="mt-10 grid gap-5 text-sm">
              <div className="border-t border-border pt-4">
                <dt className="mb-1 inline-flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" />
                  Published
                </dt>
                <dd className="font-medium">{formatDate(post.publishedAt)}</dd>
              </div>
              <div className="border-t border-border pt-4">
                <dt className="mb-1 inline-flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" />
                  Read time
                </dt>
                <dd className="font-medium">{post.readMinutes} minutes</dd>
              </div>
              <div className="border-t border-border pt-4">
                <dt className="mb-1 inline-flex items-center gap-2 text-muted-foreground">
                  <UserRound className="size-4" />
                  Written by
                </dt>
                <dd className="font-medium">{post.author}</dd>
              </div>
            </dl>
          </div>

          <div className="order-1 lg:order-2">
            <p className="max-w-[56ch] text-sm leading-6 text-muted-foreground">
              {category?.description}
            </p>
            <h1 className="mt-8 max-w-5xl text-5xl font-black tracking-tight md:text-7xl">
              {post.title}
            </h1>
            <p className="mt-8 max-w-[72ch] text-xl leading-9 text-muted-foreground">
              {post.excerpt}
            </p>
          </div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border-y border-border py-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                In this guide
              </p>
              <nav className="mt-5 grid gap-1">
                {headings.map((heading, index) => (
                  <a
                    key={heading}
                    href={`#section-${index + 1}`}
                    className="py-2 text-sm text-muted-foreground transition-colors hover:text-[#FF6600]"
                  >
                    {heading}
                  </a>
                ))}
              </nav>
            </div>
            <div className="mt-6 border-b border-border pb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Best for
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Shoppers who want practical steps before buying during busy
                sale moments.
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <div
              className="blog-content max-w-[78ch] text-base leading-8 text-foreground/88 [&_blockquote]:my-8 [&_blockquote]:rounded-lg [&_blockquote]:border [&_blockquote]:border-[#FF6600]/25 [&_blockquote]:bg-[#FF6600]/8 [&_blockquote]:p-5 [&_blockquote]:font-medium [&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:scroll-mt-28 [&_h2]:text-3xl [&_h2]:font-bold [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_table]:my-8 [&_table]:block [&_table]:w-full [&_table]:min-w-full [&_table]:overflow-x-auto [&_table]:rounded-lg [&_table]:border [&_table]:border-border [&_td]:border-t [&_td]:border-border [&_td]:p-3 [&_th]:bg-muted [&_th]:p-3 [&_th]:text-left [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{
                __html: addHeadingIds(post.html),
              }}
            />
          </div>
        </div>

        <section className="mt-20 border-t border-border pt-10">
          <div className="mb-8 flex items-end justify-between gap-4">
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

          <div className="grid gap-0 border-y border-border md:grid-cols-3">
            {relatedPosts.map((item, index) => {
              const relatedCategory = getBlogCategory(item.categoryId);

              return (
                <Link
                  key={item.id}
                  href={`/blogs/${item.slug}`}
                  className="group min-h-[17rem] border-b border-border p-5 transition-colors hover:bg-muted/40 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6600]">
                      {relatedCategory?.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {item.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center text-sm font-medium text-[#FF6600]">
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function extractHeadings(html: string) {
  return [...html.matchAll(/<h2>(.*?)<\/h2>/g)].map((match) =>
    stripTags(match[1]),
  );
}

function addHeadingIds(html: string) {
  let index = 0;

  return html.replace(/<h2>(.*?)<\/h2>/g, (_match, content) => {
    index += 1;
    return `<h2 id="section-${index}">${content}</h2>`;
  });
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "");
}
