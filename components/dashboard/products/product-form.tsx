"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Package,
  Save,
  Trash2,
  Upload,
  X,
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
import { MultiSelect } from "@/components/common/multi-select"
import { ProductStatusBadge } from "@/components/dashboard/products/product-badges"
import { formatPrice, slugify } from "@/components/dashboard/products/product-utils"
import {
  addProductImage,
  createProduct,
  deleteProductImage,
  getAllAdminCategories,
  updateProduct,
  uploadFile,
  type Product,
  type ProductImage,
  type ProductStatus,
} from "@/lib/api/catalog"
import {
  productCreateSchema,
  productEditSchema,
  type ProductCreateValues,
  type ProductEditValues,
} from "@/lib/validations/catalog"

type ProductFormProps =
  | { mode: "create"; product?: never }
  | { mode: "edit"; product: Product }

export function ProductForm(props: ProductFormProps) {
  return props.mode === "create" ? <CreateProductForm /> : <EditProductForm product={props.product} />
}

function CreateProductForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const form = useForm<ProductCreateValues>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      sku: "",
      slug: "",
      name: "",
      description: "",
      base_price_amount: 0,
      currency: "IDR",
      status: "draft",
      thumbnail_file_id: null,
      category_ids: [],
    },
    mode: "onBlur",
  })

  const values = form.watch()

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories-select"],
    queryFn: async () => {
      const response = await getAllAdminCategories()
      return response.data.data.items
    },
  })

  const categoryOptions = useMemo(
    () =>
      categoriesQuery.data?.map((cat) => ({
        value: cat.id,
        label: cat.name,
        description: cat.slug,
      })) ?? [],
    [categoriesQuery.data],
  )

  const createMutation = useMutation({
    mutationFn: (input: ProductCreateValues) => createProduct(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Product created")
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] })
      router.push("/dashboard/products")
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadFile(file),
    onSuccess: async (response) => {
      const data = response.data.data
      form.setValue("thumbnail_file_id", data.file_id, { shouldValidate: true })
      setThumbnailPreview(data.url)
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  function onSubmit(input: ProductCreateValues) {
    createMutation.mutate(input)
  }

  function handleNameChange(name: string) {
    if (!values.slug || values.slug === slugify(values.name)) {
      form.setValue("slug", slugify(name), { shouldValidate: true })
    }
  }

  return (
    <FormShell
      title="Add product"
      description="Create a new product listing for the storefront catalog."
      preview={
        <ProductPreview
          name={values.name || "Product name"}
          slug={values.slug || "product-slug"}
          price={values.base_price_amount}
          status={values.status}
          thumbnailUrl={thumbnailPreview}
        />
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Product identity
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Core product information visible on the storefront.
          </p>
          <div className="mt-5 grid gap-4">
            <Field>
              <FieldLabel htmlFor="name">Product name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g. Premium Wireless Headphones"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name", {
                  onChange: (e) => handleNameChange(e.target.value),
                })}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="sku">SKU</FieldLabel>
                <Input
                  id="sku"
                  placeholder="e.g. WHP-001"
                  className="font-mono"
                  aria-invalid={!!form.formState.errors.sku}
                  {...form.register("sku")}
                />
                <FieldDescription>Unique stock keeping unit.</FieldDescription>
                <FieldError errors={[form.formState.errors.sku]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  id="slug"
                  placeholder="e.g. premium-wireless-headphones"
                  className="font-mono"
                  aria-invalid={!!form.formState.errors.slug}
                  {...form.register("slug")}
                />
                <FieldDescription>URL-safe identifier.</FieldDescription>
                <FieldError errors={[form.formState.errors.slug]} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                rows={4}
                placeholder="Product description..."
                {...form.register("description")}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Pricing and status
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Set the base price and catalog visibility.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="base_price_amount">
                Base price (IDR)
              </FieldLabel>
              <Input
                id="base_price_amount"
                type="number"
                min={0}
                placeholder="0"
                className="tabular-nums"
                aria-invalid={!!form.formState.errors.base_price_amount}
                {...form.register("base_price_amount", { valueAsNumber: true })}
              />
              <FieldDescription>Integer amount in Rupiah.</FieldDescription>
              <FieldError errors={[form.formState.errors.base_price_amount]} />
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={values.status}
                onValueChange={(v) =>
                  form.setValue("status", v as ProductStatus, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Draft products are hidden from the storefront.
              </FieldDescription>
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">Categories</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Assign this product to one or more categories.
          </p>
          <div className="mt-5">
            <MultiSelect
              value={values.category_ids ?? []}
              options={categoryOptions}
              onChange={(next) =>
                form.setValue("category_ids", next, {
                  shouldValidate: true,
                })
              }
              placeholder={
                categoriesQuery.isLoading
                  ? "Loading categories..."
                  : "Search and select categories"
              }
              searchPlaceholder="Search categories..."
              emptyText="No active categories found."
              disabled={categoriesQuery.isLoading}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">Thumbnail</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Main product image shown in listings.
          </p>
          <div className="mt-5">
            {thumbnailPreview ? (
              <div className="relative inline-block">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-32 w-32 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("thumbnail_file_id", null)
                    setThumbnailPreview(null)
                  }}
                  className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-[#FF6600]/40 hover:text-foreground">
                <Upload className="size-5" />
                <span className="mt-1.5 text-xs font-medium">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadMutation.mutate(file)
                  }}
                />
              </label>
            )}
            {uploadMutation.isPending && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                Uploading...
              </div>
            )}
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
            <Package className="size-4" />
          )}
          Create product
        </Button>
      </form>
    </FormShell>
  )
}

function EditProductForm({ product }: { product: Product }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    product.thumbnail_url,
  )
  const [productImages, setProductImages] = useState<ProductImage[]>(
    [...product.images].sort((a, b) => a.sort_order - b.sort_order),
  )

  const form = useForm<ProductEditValues>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      description: product.description || "",
      base_price_amount: product.base_price_amount,
      currency: product.currency,
      status: product.status,
      thumbnail_file_id: product.thumbnail_file_id,
      category_ids: product.categories.map((c) => c.id),
    },
    mode: "onBlur",
  })

  const values = form.watch()

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories-select"],
    queryFn: async () => {
      const response = await getAllAdminCategories()
      return response.data.data.items
    },
  })

  const categoryOptions = useMemo(
    () =>
      categoriesQuery.data?.map((cat) => ({
        value: cat.id,
        label: cat.name,
        description: cat.slug,
      })) ?? [],
    [categoriesQuery.data],
  )

  const updateMutation = useMutation({
    mutationFn: (input: ProductEditValues) =>
      updateProduct(product.id, input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Product updated")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
        queryClient.invalidateQueries({
          queryKey: ["admin-product", product.id],
        }),
      ])
      router.push(`/dashboard/products/${product.id}`)
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadFile(file),
    onSuccess: async (response) => {
      const data = response.data.data
      form.setValue("thumbnail_file_id", data.file_id, { shouldValidate: true })
      setThumbnailPreview(data.url)
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  const addImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const uploadResponse = await uploadFile(file)
      const uploaded = uploadResponse.data.data
      const imageResponse = await addProductImage(product.id, {
        file_id: uploaded.file_id,
        alt_text: values.name || product.name,
        sort_order: productImages.length + 1,
      })
      return imageResponse.data.data
    },
    onSuccess: async (image) => {
      setProductImages((current) =>
        [...current, image].sort((a, b) => a.sort_order - b.sort_order),
      )
      await queryClient.invalidateQueries({ queryKey: ["admin-product", product.id] })
      const { toast } = await import("sonner")
      toast.success("Image added")
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) => deleteProductImage(product.id, imageId),
    onSuccess: async (_, imageId) => {
      setProductImages((current) => current.filter((image) => image.id !== imageId))
      await queryClient.invalidateQueries({ queryKey: ["admin-product", product.id] })
      const { toast } = await import("sonner")
      toast.success("Image removed")
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  function onSubmit(input: ProductEditValues) {
    updateMutation.mutate(input)
  }

  return (
    <FormShell
      title="Edit product"
      description="Update product details, pricing, and catalog assignment."
      preview={
        <ProductPreview
          name={values.name || product.name}
          slug={values.slug || product.slug}
          price={values.base_price_amount}
          status={values.status}
          thumbnailUrl={thumbnailPreview}
          createdAt={product.created_at}
        />
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Product identity
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Core product information visible on the storefront.
          </p>
          <div className="mt-5 grid gap-4">
            <Field>
              <FieldLabel htmlFor="name">Product name</FieldLabel>
              <Input
                id="name"
                placeholder="Product name"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="sku">SKU</FieldLabel>
                <Input
                  id="sku"
                  placeholder="SKU"
                  className="font-mono"
                  aria-invalid={!!form.formState.errors.sku}
                  {...form.register("sku")}
                />
                <FieldError errors={[form.formState.errors.sku]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  id="slug"
                  placeholder="product-slug"
                  className="font-mono"
                  aria-invalid={!!form.formState.errors.slug}
                  {...form.register("slug")}
                />
                <FieldError errors={[form.formState.errors.slug]} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                rows={4}
                placeholder="Product description..."
                {...form.register("description")}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Pricing and status
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="base_price_amount">
                Base price (IDR)
              </FieldLabel>
              <Input
                id="base_price_amount"
                type="number"
                min={0}
                className="tabular-nums"
                aria-invalid={!!form.formState.errors.base_price_amount}
                {...form.register("base_price_amount", { valueAsNumber: true })}
              />
              <FieldError errors={[form.formState.errors.base_price_amount]} />
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={values.status}
                onValueChange={(v) =>
                  form.setValue("status", v as ProductStatus, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">Categories</h2>
          <div className="mt-5">
            <MultiSelect
              value={values.category_ids ?? []}
              options={categoryOptions}
              onChange={(next) =>
                form.setValue("category_ids", next, {
                  shouldValidate: true,
                })
              }
              placeholder={
                categoriesQuery.isLoading
                  ? "Loading categories..."
                  : "Search and select categories"
              }
              searchPlaceholder="Search categories..."
              emptyText="No active categories found."
              disabled={categoriesQuery.isLoading}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">Thumbnail</h2>
          <div className="mt-5">
            {thumbnailPreview ? (
              <div className="relative inline-block">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-32 w-32 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("thumbnail_file_id", null)
                    setThumbnailPreview(null)
                  }}
                  className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-[#FF6600]/40 hover:text-foreground">
                <Upload className="size-5" />
                <span className="mt-1.5 text-xs font-medium">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadMutation.mutate(file)
                  }}
                />
              </label>
            )}
          </div>
        </section>

        <ProductImagesManager
          images={productImages}
          productName={values.name || product.name}
          isAdding={addImageMutation.isPending}
          isDeleting={deleteImageMutation.isPending}
          onAdd={(file) => addImageMutation.mutate(file)}
          onDelete={(imageId) => deleteImageMutation.mutate(imageId)}
        />

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
        <Link href="/dashboard/products">
          <ArrowLeft className="size-4" />
          All products
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-2xl border border-border bg-[#111111] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-[#FF6600]/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-40 rounded-full bg-[#DC143C]/8 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/15 px-3 py-1 text-xs font-semibold text-[#FF6600]">
              <Package className="size-3.5" />
              Catalog entry
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

function ProductPreview({
  name,
  slug,
  price,
  status,
  thumbnailUrl,
  createdAt,
}: {
  name: string
  slug: string
  price: number
  status: string
  thumbnailUrl?: string | null
  createdAt?: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-4">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={name}
            className="size-16 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-white/30">
            <ImagePlus className="size-6" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{name}</p>
          <p className="mt-0.5 truncate font-mono text-xs text-white/45">
            {slug}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <ProductStatusBadge status={status} />
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium tabular-nums text-white/70">
          {formatPrice(price)}
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

function ProductImagesManager({
  images,
  productName,
  isAdding,
  isDeleting,
  onAdd,
  onDelete,
}: {
  images: ProductImage[]
  productName: string
  isAdding: boolean
  isDeleting: boolean
  onAdd: (file: File) => void
  onDelete: (imageId: string) => void
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Product gallery
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload alternate angles and remove images that no longer belong.
          </p>
        </div>
        <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-muted">
          {isAdding ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          Add image
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isAdding}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onAdd(file)
              event.currentTarget.value = ""
            }}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="group overflow-hidden rounded-xl border border-border bg-background"
          >
            <div className="relative">
              <img
                src={image.url}
                alt={image.alt_text || productName}
                className="aspect-square w-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                className="absolute right-2 top-2 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                disabled={isDeleting}
                onClick={() => onDelete(image.id)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <p className="min-w-0 truncate text-xs font-medium text-muted-foreground">
                {image.alt_text || `Image ${image.sort_order}`}
              </p>
              <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {image.sort_order}
              </span>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-input bg-muted/30 text-center text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:col-span-2 lg:col-span-4">
            <ImagePlus className="size-6" />
            <span className="mt-2 text-sm font-medium">
              Upload gallery images
            </span>
            <span className="mt-1 text-xs">Square images work best.</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={isAdding}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onAdd(file)
                event.currentTarget.value = ""
              }}
            />
          </label>
        )}
      </div>
    </section>
  )
}
