"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  blogCategories,
  blogPosts,
  getBlogCategory,
  type BlogPost,
} from "@/lib/blogs";
import { cn } from "@/lib/utils";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
const postsPerPage = 6;

type SortValue = "newest" | "oldest" | "shortest" | "longest";

export function BlogIndex() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [sort, setSort] = useState<SortValue>("newest");
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return blogPosts
      .filter((post) => {
        const category = getBlogCategory(post.categoryId);
        const matchesCategory =
          categoryId === "all" || post.categoryId === categoryId;
        const matchesQuery =
          !normalizedQuery ||
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.excerpt.toLowerCase().includes(normalizedQuery) ||
          category?.name.toLowerCase().includes(normalizedQuery);

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sort === "oldest") {
          return (
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
          );
        }
        if (sort === "shortest") {
          return a.readMinutes - b.readMinutes;
        }
        if (sort === "longest") {
          return b.readMinutes - a.readMinutes;
        }

        return (
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
        );
      });
  }, [categoryId, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const safePage = Math.min(page, totalPages);
  const visiblePosts = filteredPosts.slice(
    (safePage - 1) * postsPerPage,
    safePage * postsPerPage,
  );
  const featuredPost = blogPosts.find((post) => post.featured) ?? blogPosts[0];

  function resetPage(nextAction: () => void) {
    setPage(1);
    nextAction();
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-28">
      <div className="absolute inset-x-0 top-20 h-px bg-border" />
      <div className="absolute left-0 top-20 size-[32rem] rounded-full bg-[#FF6600]/8 blur-3xl" />
      <div className="absolute bottom-40 right-0 size-[28rem] rounded-full bg-[#DC143C]/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="grid gap-8 lg:grid-cols-[1fr_27rem] lg:items-end"
        >
          <div>
            <Badge variant="outline" className="rounded-full">
              Guides and stories
            </Badge>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
              Shop smarter before the next drop.
            </h1>
            <p className="mt-5 max-w-[68ch] text-base leading-7 text-muted-foreground md:text-lg">
              Short reads for better flash sale prep, safer accounts, clearer
              checkout, and product choices you can feel good about.
            </p>
          </div>

          <BlogFeature post={featuredPost} />
        </motion.div>

        <div className="mt-12 rounded-lg border border-border bg-card p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_12rem_12rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) =>
                  resetPage(() => setQuery(event.target.value))
                }
                placeholder="Search guides, products, or shopping tips"
                className="h-10 pl-9"
              />
            </div>

            <Select
              value={categoryId}
              onValueChange={(value) => resetPage(() => setCategoryId(value))}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {blogCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(value) =>
                resetPage(() => setSort(value as SortValue))
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="shortest">Shortest read</SelectItem>
                <SelectItem value="longest">Longest read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            <span>
              {filteredPosts.length} result{filteredPosts.length === 1 ? "" : "s"}
            </span>
            {query || categoryId !== "all" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setCategoryId("all");
                  setSort("newest");
                  setPage(1);
                }}
                className="h-7 rounded-full text-[#FF6600]"
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        </div>

        <div id="blog-list" className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visiblePosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {visiblePosts.length === 0 ? (
          <div className="mt-8 rounded-lg border border-border bg-card p-10 text-center">
            <BookOpen className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No guides found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another keyword or reset the category filter.
            </p>
          </div>
        ) : null}

        <BlogPagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}

function BlogFeature({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.categoryId);

  return (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <div className="rounded-lg border border-border bg-[#151515] p-5 text-[#f4f1ec] transition-colors group-hover:border-[#FF6600]/45">
        <div className="flex items-center justify-between gap-4">
          <Badge className="rounded-full bg-[#FF6600]/15 text-[#FF6600]">
            Featured
          </Badge>
          <span className="text-xs text-[#a7a19a]">{post.readMinutes} min read</span>
        </div>
        <h2 className="mt-8 text-2xl font-bold tracking-tight">{post.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#c9c2ba]">{post.excerpt}</p>
        <div className="mt-8 flex items-center justify-between gap-4">
          <span className="text-xs text-[#a7a19a]">{category?.name}</span>
          <span className="inline-flex items-center text-sm font-semibold text-[#FF6600]">
            Read guide
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const category = getBlogCategory(post.categoryId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.55, ease: smoothEase, delay: index * 0.04 }}
      whileHover={{
        y: -6,
        borderColor: "rgba(255, 102, 0, 0.35)",
        transition: { duration: 0.22, ease: smoothEase },
      }}
      className="group flex min-h-[21rem] flex-col rounded-lg border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <Badge variant="outline" className="rounded-full">
          {category?.name}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {post.readMinutes} min read
        </span>
      </div>
      <h2 className="mt-8 text-2xl font-bold tracking-tight">{post.title}</h2>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
        {post.excerpt}
      </p>
      <div className="mt-auto flex items-center justify-between gap-4 pt-8">
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {new Intl.DateTimeFormat("en", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(post.publishedAt))}
        </span>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-full text-[#FF6600] hover:bg-[#FF6600]/5 hover:text-[#FF6600]"
        >
          <Link href={`/blogs/${post.slug}`}>
            Read
            <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}

function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#blog-list"
            onClick={(event) => {
              event.preventDefault();
              onPageChange(Math.max(1, currentPage - 1));
            }}
            className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#blog-list"
                isActive={page === currentPage}
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href="#blog-list"
            onClick={(event) => {
              event.preventDefault();
              onPageChange(Math.min(totalPages, currentPage + 1));
            }}
            className={cn(
              currentPage === totalPages && "pointer-events-none opacity-50",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
