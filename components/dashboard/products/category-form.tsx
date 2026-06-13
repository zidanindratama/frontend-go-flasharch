"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, FolderTree, Loader2, Save, Tag } from "lucide-react"
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
import { CategoryStatusBadge } from "@/components/dashboard/products/product-badges"
import { slugify } from "@/components/dashboard/products/product-utils"
import {
  createCategory,
  getAllAdminCategories,
  updateCategory,
  type Category,
  type CategoryStatus,
} from "@/lib/api/catalog"
import {
  categoryCreateSchema,
  categoryEditSchema,
  type CategoryCreateValues,
  type CategoryEditValues,
} from "@/lib/validations/catalog"

type CategoryFormProps =
  | { mode: "create"; category?: never }
  | { mode: "edit"; category: Category }

export function CategoryForm(props: CategoryFormProps) {
  return props.mode === "create" ? (
    <CreateCategoryForm />
  ) : (
    <EditCategoryForm category={props.category} />
  )
}

function CreateCategoryForm() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<CategoryCreateValues>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      parent_id: null,
      slug: "",
      name: "",
      description: "",
      status: "active",
    },
  })

  const values = form.watch()

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories-select"],
    queryFn: async () => {
      const response = await getAllAdminCategories()
      return response.data.data.items
    },
  })

  const createMutation = useMutation({
    mutationFn: (input: CategoryCreateValues) => createCategory(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Category created")
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
      router.push("/dashboard/products/categories")
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  function onSubmit(input: CategoryCreateValues) {
    createMutation.mutate(input)
  }

  function handleNameChange(name: string) {
    if (!values.slug || values.slug === slugify(values.name)) {
      form.setValue("slug", slugify(name), { shouldValidate: true })
    }
  }

  return (
    <FormShell
      title="Add category"
      description="Create a new product category for storefront navigation."
      preview={
        <CategoryPreview
          name={values.name || "Category name"}
          slug={values.slug || "category-slug"}
          status={values.status}
        />
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Category details
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Name, URL slug, and optional parent category.
          </p>
          <div className="mt-5 grid gap-4">
            <Field>
              <FieldLabel htmlFor="name">Category name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g. Electronics"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name", {
                  onChange: (e) => handleNameChange(e.target.value),
                })}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input
                id="slug"
                placeholder="e.g. electronics"
                className="font-mono"
                aria-invalid={!!form.formState.errors.slug}
                {...form.register("slug")}
              />
              <FieldDescription>URL-safe identifier.</FieldDescription>
              <FieldError errors={[form.formState.errors.slug]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="parent_id">Parent category</FieldLabel>
              <Select
                value={values.parent_id || "none"}
                onValueChange={(v) =>
                  form.setValue("parent_id", v === "none" ? null : v, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-xl">
                  <SelectValue placeholder="None (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top-level)</SelectItem>
                  {categoriesQuery.data?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Optional parent for hierarchical categories.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                rows={3}
                placeholder="Optional description..."
                {...form.register("description")}
              />
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={values.status}
                onValueChange={(v) =>
                  form.setValue("status", v as CategoryStatus, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Archived categories are hidden from the storefront.
              </FieldDescription>
            </Field>
          </div>
        </section>

        <Button
          type="submit"
          size="lg"
          className="h-10 rounded-xl sm:w-fit"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FolderTree className="size-4" />
          )}
          Create category
        </Button>
      </form>
    </FormShell>
  )
}

function EditCategoryForm({ category }: { category: Category }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<CategoryEditValues>({
    resolver: zodResolver(categoryEditSchema),
    defaultValues: {
      parent_id: category.parent_id,
      slug: category.slug,
      name: category.name,
      description: category.description || "",
      status: category.status,
    },
  })

  const values = form.watch()

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories-select"],
    queryFn: async () => {
      const response = await getAllAdminCategories()
      return response.data.data.items
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: CategoryEditValues) =>
      updateCategory(category.id, input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Category updated")
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
      router.push("/dashboard/products/categories")
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  function onSubmit(input: CategoryEditValues) {
    updateMutation.mutate(input)
  }

  return (
    <FormShell
      title="Edit category"
      description="Update category name, hierarchy, and storefront visibility."
      preview={
        <CategoryPreview
          name={values.name || category.name}
          slug={values.slug || category.slug}
          status={values.status}
          createdAt={category.created_at}
        />
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Category details
          </h2>
          <div className="mt-5 grid gap-4">
            <Field>
              <FieldLabel htmlFor="name">Category name</FieldLabel>
              <Input
                id="name"
                placeholder="Category name"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input
                id="slug"
                placeholder="category-slug"
                className="font-mono"
                aria-invalid={!!form.formState.errors.slug}
                {...form.register("slug")}
              />
              <FieldError errors={[form.formState.errors.slug]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="parent_id">Parent category</FieldLabel>
              <Select
                value={values.parent_id || "none"}
                onValueChange={(v) =>
                  form.setValue("parent_id", v === "none" ? null : v, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-xl">
                  <SelectValue placeholder="None (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top-level)</SelectItem>
                  {categoriesQuery.data
                    ?.filter((c) => c.id !== category.id)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                rows={3}
                placeholder="Optional description..."
                {...form.register("description")}
              />
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={values.status}
                onValueChange={(v) =>
                  form.setValue("status", v as CategoryStatus, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </section>

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
      </form>
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
    <div className="flex flex-col gap-4">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-fit gap-2 text-muted-foreground"
      >
        <Link href="/dashboard/products/categories">
          <ArrowLeft className="size-4" />
          All categories
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-2xl border border-border bg-[#111111] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-[#FF6600]/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-40 rounded-full bg-[#DC143C]/8 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/15 px-3 py-1 text-xs font-semibold text-[#FF6600]">
              <Tag className="size-3.5" />
              Taxonomy
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2.5 max-w-md text-sm leading-6 text-white/50">
              {description}
            </p>
          </div>
          <div>{preview}</div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        {children}
      </section>
    </div>
  )
}

function CategoryPreview({
  name,
  slug,
  status,
  createdAt,
}: {
  name: string
  slug: string
  status: string
  createdAt?: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#FF6600]/15 text-[#FF6600]">
          <Tag className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{name}</p>
          <p className="mt-0.5 truncate font-mono text-xs text-white/45">
            {slug}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <CategoryStatusBadge status={status} />
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
