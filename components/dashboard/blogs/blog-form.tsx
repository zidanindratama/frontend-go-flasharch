"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  Clock,
  FileText,
  Loader2,
  Newspaper,
  Save,
  Sparkles,
  User,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap"
import { SingleSelect } from "@/components/common/single-select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { BlogPostStatusBadge } from "@/components/dashboard/blogs/blog-badges"
import { slugify } from "@/components/dashboard/products/product-utils"
import {
  createBlogPost,
  getAllAdminBlogCategories,
  listAdminBlogs,
  updateBlogPost,
  type BlogPost,
  type BlogPostStatus,
} from "@/lib/api/blogs"
import { uploadFile } from "@/lib/api/catalog"
import {
  blogPostCreateSchema,
  blogPostEditSchema,
  type BlogPostCreateValues,
  type BlogPostEditValues,
} from "@/lib/validations/blog"

type BlogPostFormProps =
  | { mode: "create"; blog?: never }
  | { mode: "edit"; blog: BlogPost }

const panelClass =
  "min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"

async function showFormValidationError() {
  const { toast } = await import("sonner")
  toast.error("Please fix the highlighted fields")
}

export function BlogPostForm(props: BlogPostFormProps) {
  return props.mode === "create" ? (
    <CreateBlogPostForm />
  ) : (
    <EditBlogPostForm blog={props.blog} />
  )
}

function CreateBlogPostForm() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<BlogPostCreateValues>({
    resolver: zodResolver(blogPostCreateSchema),
    defaultValues: {
      category_id: "",
      slug: "",
      title: "",
      excerpt: "",
      author: "",
      read_minutes: 5,
      featured: false,
      status: "draft",
      published_at: null,
      html: "",
    },
    mode: "onBlur",
  })

  const values = form.watch()

  const categoriesQuery = useQuery({
    queryKey: ["admin-blog-categories-select"],
    queryFn: async () => {
      const response = await getAllAdminBlogCategories()
      return response.data.data.items
    },
  })

  const featuredQuery = useQuery({
    queryKey: ["admin-blog-featured-check"],
    queryFn: async () => {
      const response = await listAdminBlogs({ status: "published" })
      return response.data.data.items.filter((p) => p.featured)
    },
  })

  const hasExistingFeatured = (featuredQuery.data?.length ?? 0) > 0
  const [showFeaturedConfirm, setShowFeaturedConfirm] = useState(false)

  const categoryOptions =
    categoriesQuery.data?.map((cat) => ({
      value: cat.id,
      label: cat.name,
      description: cat.slug,
    })) ?? []

  const createMutation = useMutation({
    mutationFn: (input: BlogPostCreateValues) => createBlogPost(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Blog post created")
      await queryClient.invalidateQueries({ queryKey: ["admin-blogs"] })
      router.push("/dashboard/blogs")
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  function onSubmit(input: BlogPostCreateValues) {
    const payload =
      input.status === "published" && !input.published_at
        ? { ...input, published_at: new Date().toISOString() }
        : input
    createMutation.mutate(payload)
  }

  function handleTitleChange(title: string) {
    if (!values.slug || values.slug === slugify(values.title)) {
      form.setValue("slug", slugify(title), { shouldValidate: true })
    }
  }

  return (
    <FormShell
      title="Add blog post"
      description="Create editorial content for the storefront blog."
      preview={
        <BlogPostPreview
          title={values.title || "Blog post title"}
          slug={values.slug || "blog-post-slug"}
          author={values.author || "Author"}
          status={values.status}
          featured={values.featured}
        />
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit, showFormValidationError)}
        className="grid gap-5"
      >
        <section className={panelClass}>
          <SectionHeader
            title="Post identity"
            description="Headline, URL slug, and summary shown across the site."
          />
          <div className="mt-6 grid gap-5">
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="e.g. How to Choose the Right Product"
                aria-invalid={!!form.formState.errors.title}
                {...form.register("title", {
                  onChange: (e) => handleTitleChange(e.target.value),
                })}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    /
                  </span>
                  <Input
                    id="slug"
                    placeholder="how-to-choose"
                    className="pl-6 font-mono"
                    aria-invalid={!!form.formState.errors.slug}
                    {...form.register("slug")}
                  />
                </div>
                <FieldDescription>URL-safe identifier.</FieldDescription>
                <FieldError errors={[form.formState.errors.slug]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="author">Author</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="author"
                    placeholder="e.g. John Doe"
                    className="pl-9"
                    aria-invalid={!!form.formState.errors.author}
                    {...form.register("author")}
                  />
                </div>
                <FieldError errors={[form.formState.errors.author]} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
              <Textarea
                id="excerpt"
                rows={3}
                placeholder="A compelling one-paragraph summary..."
                aria-invalid={!!form.formState.errors.excerpt}
                {...form.register("excerpt")}
              />
              <FieldDescription>
                Shown in blog listings and social previews.
              </FieldDescription>
              <FieldError errors={[form.formState.errors.excerpt]} />
            </Field>
          </div>
        </section>

        <section className={panelClass}>
          <SectionHeader
            title="Content"
            description="Write the full article using the rich text editor."
          />
          <div className="mt-6 min-w-0">
            <MinimalTiptapEditor
              value={form.getValues("html")}
              onChange={(content) => {
                form.setValue("html", content as string, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
              placeholder="Start writing your article..."
              className="min-h-[360px]"
              editorContentClassName="min-w-0 max-w-full"
              uploader={async (file) => {
                const response = await uploadFile(file)
                return response.data.data.url
              }}
            />
          </div>
        </section>

        <section className={panelClass}>
          <SectionHeader
            title="Publishing"
            description="Category, status, read time, and featured flag."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field>
              <FieldLabel>Category</FieldLabel>
              <SingleSelect
                value={values.category_id}
                options={categoryOptions}
                onChange={(v) =>
                  form.setValue("category_id", v, { shouldValidate: true })
                }
                placeholder="Select a category"
                searchPlaceholder="Search categories..."
                emptyText="No categories found."
                disabled={categoriesQuery.isLoading}
              />
              <FieldError errors={[form.formState.errors.category_id]} />
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={values.status}
                onValueChange={(v) =>
                  form.setValue("status", v as BlogPostStatus, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="read_minutes">
                Read time
              </FieldLabel>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="read_minutes"
                  type="number"
                  min={0}
                  placeholder="5"
                  className="pl-9"
                  aria-invalid={!!form.formState.errors.read_minutes}
                  {...form.register("read_minutes", { valueAsNumber: true })}
                />
              </div>
              <FieldDescription>Minutes.</FieldDescription>
              <FieldError errors={[form.formState.errors.read_minutes]} />
            </Field>

            <Field>
              <FieldLabel>Featured</FieldLabel>
              <div className="flex h-10 items-center gap-3 rounded-xl border border-border bg-background px-3">
                <Switch
                  id="featured"
                  checked={values.featured}
                  onCheckedChange={(checked) => {
                    if (checked && hasExistingFeatured) {
                      setShowFeaturedConfirm(true)
                    } else {
                      form.setValue("featured", checked, {
                        shouldValidate: true,
                      })
                    }
                  }}
                />
                <label
                  htmlFor="featured"
                  className="cursor-pointer text-sm text-muted-foreground"
                >
                  Highlight on storefront
                </label>
              </div>
            </Field>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            size="lg"
            className="h-10 rounded-xl sm:w-fit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Newspaper className="size-4" />
            )}
            Create blog post
          </Button>
          <p className="text-xs text-muted-foreground">
            Draft posts are hidden until published.
          </p>
        </div>
      </form>

      <AlertDialog open={showFeaturedConfirm} onOpenChange={setShowFeaturedConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace featured post?</AlertDialogTitle>
            <AlertDialogDescription>
              There is already a featured post. Enabling this will remove the featured flag from the other post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowFeaturedConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                form.setValue("featured", true, { shouldValidate: true })
                setShowFeaturedConfirm(false)
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormShell>
  )
}

function EditBlogPostForm({ blog }: { blog: BlogPost }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<BlogPostEditValues>({
    resolver: zodResolver(blogPostEditSchema),
    defaultValues: {
      category_id: blog.category_id ?? blog.category?.id ?? "",
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      author: blog.author,
      read_minutes: blog.read_minutes,
      featured: blog.featured,
      status: blog.status,
      published_at: blog.published_at,
      html: blog.html || "",
    },
    mode: "onBlur",
  })

  const values = form.watch()

  const categoriesQuery = useQuery({
    queryKey: ["admin-blog-categories-select"],
    queryFn: async () => {
      const response = await getAllAdminBlogCategories()
      return response.data.data.items
    },
  })

  const featuredQuery = useQuery({
    queryKey: ["admin-blog-featured-check", blog.id],
    queryFn: async () => {
      const response = await listAdminBlogs({ status: "published" })
      return response.data.data.items.filter((p) => p.featured && p.id !== blog.id)
    },
  })

  const hasExistingFeatured = (featuredQuery.data?.length ?? 0) > 0
  const [showFeaturedConfirm, setShowFeaturedConfirm] = useState(false)

  const categoryOptions =
    categoriesQuery.data?.map((cat) => ({
      value: cat.id,
      label: cat.name,
      description: cat.slug,
    })) ?? []

  const updateMutation = useMutation({
    mutationFn: (input: BlogPostEditValues) => updateBlogPost(blog.id, input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Blog post updated")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-blogs"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-blog", blog.id] }),
      ])
      router.push(`/dashboard/blogs/${blog.id}`)
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  function onSubmit(input: BlogPostEditValues) {
    const payload =
      input.status === "published" && !input.published_at
        ? { ...input, published_at: new Date().toISOString() }
        : input
    updateMutation.mutate(payload)
  }

  return (
    <FormShell
      title="Edit blog post"
      description="Refine editorial content and publishing settings."
      preview={
        <BlogPostPreview
          title={values.title || blog.title}
          slug={values.slug || blog.slug}
          author={values.author || blog.author}
          status={values.status}
          featured={values.featured}
          createdAt={blog.created_at}
        />
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit, showFormValidationError)}
        className="grid gap-5"
      >
        <section className={panelClass}>
          <SectionHeader
            title="Post identity"
            description="Headline, URL slug, and summary shown across the site."
          />
          <div className="mt-6 grid gap-5">
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Blog post title"
                aria-invalid={!!form.formState.errors.title}
                {...form.register("title")}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    /
                  </span>
                  <Input
                    id="slug"
                    placeholder="blog-post-slug"
                    className="pl-6 font-mono"
                    aria-invalid={!!form.formState.errors.slug}
                    {...form.register("slug")}
                  />
                </div>
                <FieldError errors={[form.formState.errors.slug]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="author">Author</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="author"
                    placeholder="Author name"
                    className="pl-9"
                    aria-invalid={!!form.formState.errors.author}
                    {...form.register("author")}
                  />
                </div>
                <FieldError errors={[form.formState.errors.author]} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
              <Textarea
                id="excerpt"
                rows={3}
                placeholder="A compelling one-paragraph summary..."
                aria-invalid={!!form.formState.errors.excerpt}
                {...form.register("excerpt")}
              />
              <FieldError errors={[form.formState.errors.excerpt]} />
            </Field>
          </div>
        </section>

        <section className={panelClass}>
          <SectionHeader
            title="Content"
            description="Write the full article using the rich text editor."
          />
          <div className="mt-6 min-w-0">
            <MinimalTiptapEditor
              value={form.getValues("html")}
              onChange={(content) => {
                form.setValue("html", content as string, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
              placeholder="Start writing your article..."
              className="min-h-[360px]"
              editorContentClassName="min-w-0 max-w-full"
              uploader={async (file) => {
                const response = await uploadFile(file)
                return response.data.data.url
              }}
            />
          </div>
        </section>

        <section className={panelClass}>
          <SectionHeader
            title="Publishing"
            description="Category, status, read time, and featured flag."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field>
              <FieldLabel>Category</FieldLabel>
              <SingleSelect
                value={values.category_id}
                options={categoryOptions}
                onChange={(v) =>
                  form.setValue("category_id", v, { shouldValidate: true })
                }
                placeholder="Select a category"
                searchPlaceholder="Search categories..."
                emptyText="No categories found."
                disabled={categoriesQuery.isLoading}
              />
              <FieldError errors={[form.formState.errors.category_id]} />
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={values.status}
                onValueChange={(v) =>
                  form.setValue("status", v as BlogPostStatus, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="read_minutes">Read time</FieldLabel>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="read_minutes"
                  type="number"
                  min={0}
                  placeholder="5"
                  className="pl-9"
                  aria-invalid={!!form.formState.errors.read_minutes}
                  {...form.register("read_minutes", { valueAsNumber: true })}
                />
              </div>
              <FieldDescription>Minutes.</FieldDescription>
              <FieldError errors={[form.formState.errors.read_minutes]} />
            </Field>

            <Field>
              <FieldLabel>Featured</FieldLabel>
              <div className="flex h-10 items-center gap-3 rounded-xl border border-border bg-background px-3">
                <Switch
                  id="featured"
                  checked={values.featured}
                  onCheckedChange={(checked) => {
                    if (checked && hasExistingFeatured) {
                      setShowFeaturedConfirm(true)
                    } else {
                      form.setValue("featured", checked, {
                        shouldValidate: true,
                      })
                    }
                  }}
                />
                <label
                  htmlFor="featured"
                  className="cursor-pointer text-sm text-muted-foreground"
                >
                  Highlight on storefront
                </label>
              </div>
            </Field>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            size="lg"
            className="h-10 rounded-xl sm:w-fit"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save changes
          </Button>
          <p className="text-xs text-muted-foreground">
            Last saved locally on blur.
          </p>
        </div>
      </form>

      <AlertDialog open={showFeaturedConfirm} onOpenChange={setShowFeaturedConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace featured post?</AlertDialogTitle>
            <AlertDialogDescription>
              There is already a featured post. Enabling this will remove the featured flag from the other post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowFeaturedConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                form.setValue("featured", true, { shouldValidate: true })
                setShowFeaturedConfirm(false)
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormShell>
  )
}

function FormShell({
  title,
  description,
  preview,
  children,
}: {
  title: string
  description: string
  preview: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-fit gap-2 text-muted-foreground"
      >
        <Link href="/dashboard/blogs">
          <ArrowLeft className="size-4" />
          All blogs
        </Link>
      </Button>

      <section className="relative min-w-0 overflow-hidden rounded-2xl border border-border bg-[#111111] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-[#FF6600]/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-40 rounded-full bg-[#DC143C]/8 blur-3xl" />

        <div className="relative grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/15 px-3 py-1 text-xs font-semibold text-[#FF6600]">
              <FileText className="size-3.5" />
              Content entry
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2.5 max-w-md text-sm leading-6 text-white/50">
              {description}
            </p>
          </div>
          <div className="min-w-0">{preview}</div>
        </div>
      </section>

      <section className="min-w-0 rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-6">
        {children}
      </section>
    </div>
  )
}

function SectionHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

function BlogPostPreview({
  title,
  slug,
  author,
  status,
  featured,
  createdAt,
}: {
  title: string
  slug: string
  author: string
  status: string
  featured: boolean
  createdAt?: string
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#FF6600]/15 text-[#FF6600]">
          <Newspaper className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{title}</p>
          <p className="mt-0.5 truncate font-mono text-xs text-white/45">
            /{slug}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <BlogPostStatusBadge status={status} />
        {featured && (
          <Badge
            variant="outline"
            className="rounded-full border-[#FF6600]/25 bg-[#FF6600]/10 px-2.5 py-1 text-xs font-medium text-[#FF6600]"
          >
            <Sparkles className="mr-1 size-3" />
            Featured
          </Badge>
        )}
      </div>
      <div className="mt-4 flex items-center gap-3 text-xs text-white/50">
        <span className="flex items-center gap-1">
          <User className="size-3" />
          {author}
        </span>
      </div>
      {createdAt && (
        <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.03] p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/30">
            Created
          </p>
          <p className="mt-1.5 text-sm font-medium text-white/65">
            {new Intl.DateTimeFormat("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(createdAt))}
          </p>
        </div>
      )}
    </div>
  )
}
