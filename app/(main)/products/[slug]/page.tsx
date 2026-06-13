import type { Metadata } from "next"
import { getProduct } from "@/lib/api/catalog"
import { ProductDetail } from "@/components/main/products/product-detail"
import { createPageMetadata } from "@/lib/seo"

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  props: ProductDetailPageProps,
): Promise<Metadata> {
  const params = await props.params
  try {
    const response = await getProduct(params.slug)
    const product = response.data.data
    return createPageMetadata({
      title: product.name,
      description:
        product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
        `Buy ${product.name} at Go FlashArch.`,
      path: `/products/${product.slug}`,
      keywords: [product.name, product.sku, "product", "flash sale"],
    })
  } catch {
    return createPageMetadata({
      title: "Product",
      description: "Product detail page.",
      path: `/products/${params.slug}`,
    })
  }
}

export default async function ProductDetailPage(
  props: ProductDetailPageProps,
) {
  const params = await props.params
  return <ProductDetail slug={params.slug} />
}
