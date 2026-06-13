"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import DOMPurify from "dompurify"
import {
  ArrowLeft,
  Boxes,
  Copy,
  ImagePlus,
  Pencil,
  Star,
  Tag,
} from "lucide-react"
import { toast } from "sonner"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductStatusBadge } from "@/components/dashboard/products/product-badges"
import {
  formatDateTime,
  formatPrice,
  shortId,
} from "@/components/dashboard/products/product-utils"
import { getAdminProduct, type Product, type ProductImage } from "@/lib/api/catalog"
import { cn } from "@/lib/utils"

type GalleryImage = Pick<ProductImage, "id" | "url" | "alt_text" | "sort_order"> & {
  source: "thumbnail" | "gallery"
}

export function ProductDetail() {
  const params = useParams<{ id: string }>()
  const productId = params.id

  const productQuery = useQuery({
    queryKey: ["admin-product", productId],
    queryFn: async () => {
      const response = await getAdminProduct(productId)
      return response.data.data
    },
    enabled: !!productId,
  })

  if (productQuery.isLoading) return <ProductDetailSkeleton />

  if (productQuery.isError || !productQuery.data) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
          <p className="font-semibold text-foreground">Product unavailable</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Check admin session and selected product ID.
          </p>
        </div>
      </div>
    )
  }

  return <ProductDetailView product={productQuery.data} />
}

function ProductDetailView({ product }: { product: Product }) {
  const gallery = useMemo(() => buildGallery(product), [product])
  const [selectedImageId, setSelectedImageId] = useState(gallery[0]?.id ?? "")
  const selectedImage =
    gallery.find((image) => image.id === selectedImageId) ?? gallery[0]
  const selectedGallery = selectedImage
    ? [
        selectedImage,
        ...gallery.filter((image) => image.id !== selectedImage.id),
      ]
    : gallery

  async function copyId() {
    await navigator.clipboard.writeText(product.id)
    toast.success("Product ID copied")
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 rounded-xl" onClick={copyId}>
            <Copy className="size-3.5" />
            Copy ID
          </Button>
          <Button asChild size="sm" className="h-9 rounded-xl">
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <div className="min-w-0 rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
          <div className="grid gap-3 xl:grid-cols-[96px_minmax(0,1fr)]">
            <div className="order-2 flex gap-2 overflow-x-auto pb-1 xl:order-1 xl:max-h-[620px] xl:flex-col xl:overflow-y-auto xl:overflow-x-hidden xl:pb-0">
              {gallery.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImageId(image.id)}
                  className={cn(
                    "relative size-20 shrink-0 overflow-hidden rounded-xl border bg-muted transition-colors xl:size-24",
                    selectedImage?.id === image.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.alt_text || product.name}
                    className="size-full object-cover"
                  />
                  {image.source === "thumbnail" && (
                    <span className="absolute bottom-1 left-1 rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-medium">
                      Cover
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="order-1 min-w-0 overflow-hidden rounded-2xl bg-muted xl:order-2">
              {selectedImage ? (
                <Carousel
                  key={selectedImage.id}
                  className="w-full"
                  opts={{ loop: selectedGallery.length > 1 }}
                >
                  <CarouselContent>
                    {selectedGallery.map((image) => (
                      <CarouselItem key={image.id}>
                        <AspectRatio ratio={4 / 3}>
                          <img
                            src={image.url}
                            alt={image.alt_text || product.name}
                            className="size-full object-cover"
                          />
                        </AspectRatio>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {gallery.length > 1 && (
                    <>
                      <CarouselPrevious className="left-3 bg-background/90" />
                      <CarouselNext className="right-3 bg-background/90" />
                    </>
                  )}
                </Carousel>
              ) : (
                <AspectRatio ratio={4 / 3}>
                  <div className="flex size-full flex-col items-center justify-center text-muted-foreground">
                    <ImagePlus className="size-10" />
                    <p className="mt-3 text-sm font-medium">No image yet</p>
                  </div>
                </AspectRatio>
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <ProductStatusBadge status={product.status} />
            <Badge variant="secondary" className="font-mono">
              {product.sku}
            </Badge>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
            {product.name}
          </h1>
          <p className="mt-2 break-all font-mono text-sm text-muted-foreground">
            /{product.slug}
          </p>

          <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Base price
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
              {formatPrice(product.base_price_amount)}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="Images" value={String(gallery.length)} icon={<ImagePlus />} />
            <Metric label="Rating" value={product.rating_count ? product.rating_average.toFixed(1) : "0.0"} icon={<Star />} />
            <Metric label="Reviews" value={String(product.rating_count)} icon={<Boxes />} />
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Categories
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.categories.length > 0 ? (
                product.categories.map((category) => (
                  <Badge key={category.id} variant="outline" className="rounded-lg">
                    <Tag className="size-3" />
                    {category.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Uncategorized</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-foreground">
            Product description
          </h2>
          {product.description ? (
            <div
              className="product-rich-text mt-4 max-w-4xl text-sm leading-7 text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            />
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No storefront description has been written yet.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-foreground">
            Catalog timeline
          </h2>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border">
            <TimelineRow label="Created" value={formatDateTime(product.created_at)} />
            <TimelineRow label="Updated" value={formatDateTime(product.updated_at)} />
            <TimelineRow label="Product ID" value={shortId(product.id)} />
          </div>
        </div>
      </section>
    </div>
  )
}

function buildGallery(product: Product): GalleryImage[] {
  const gallery = [...product.images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => ({ ...image, source: "gallery" as const }))

  if (!product.thumbnail_url) return gallery

  const thumbnailAlreadyIncluded = gallery.some(
    (image) => image.url === product.thumbnail_url,
  )

  if (thumbnailAlreadyIncluded) return gallery

  return [
    {
      id: "thumbnail",
      url: product.thumbnail_url,
      alt_text: product.name,
      sort_order: 0,
      source: "thumbnail",
    },
    ...gallery,
  ]
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="[&_svg]:size-3.5">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-lg font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  )
}

function TimelineRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 px-3 py-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-40 rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <Skeleton className="h-[540px] rounded-2xl" />
        <Skeleton className="h-[540px] rounded-2xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    </div>
  )
}
