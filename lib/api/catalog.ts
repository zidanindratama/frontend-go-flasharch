import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type ProductStatus = "draft" | "active" | "archived"
export type CategoryStatus = "active" | "archived"

export type ProductCategory = {
  id: string
  parent_id: string | null
  slug: string
  name: string
  description: string
  status: CategoryStatus
  created_at: string
  updated_at: string
}

export type ProductImage = {
  id: string
  product_id: string
  file_id: string
  url: string
  alt_text: string
  sort_order: number
  created_at: string
}

export type Product = {
  id: string
  sku: string
  slug: string
  name: string
  description: string
  base_price_amount: number
  currency: string
  status: ProductStatus
  thumbnail_file_id: string | null
  thumbnail_url: string | null
  rating_average: number
  rating_count: number
  created_by_user_id: string | null
  updated_by_user_id: string | null
  categories: ProductCategory[]
  images: ProductImage[]
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  parent_id: string | null
  slug: string
  name: string
  description: string
  status: CategoryStatus
  created_at: string
  updated_at: string
}

export type ProductListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
  status?: ProductStatus
  category?: string
  min_price?: number
  max_price?: number
}

export type CategoryListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
  status?: CategoryStatus
}

export type PaginatedResponse<T> = {
  message: string
  data: {
    items: T[]
    page: number
    per_page: number
    total: number
  }
}

export type SingleResponse<T> = {
  message: string
  data: T
}

export type CreateProductInput = {
  sku: string
  slug: string
  name: string
  description?: string
  base_price_amount: number
  currency?: string
  status?: ProductStatus
  thumbnail_file_id?: string | null
  category_ids?: string[]
}

export type UpdateProductInput = {
  sku?: string
  slug?: string
  name?: string
  description?: string
  base_price_amount?: number
  currency?: string
  status?: ProductStatus
  thumbnail_file_id?: string | null
  category_ids?: string[]
}

export type CreateCategoryInput = {
  parent_id?: string | null
  slug: string
  name: string
  description?: string
  status?: CategoryStatus
}

export type UpdateCategoryInput = {
  parent_id?: string | null
  slug?: string
  name?: string
  description?: string
  status?: CategoryStatus
}

export type ProductReview = {
  id: string
  product_id: string
  user_id: string
  rating: number
  title: string
  body: string
  created_at: string
  updated_at: string
}

export type ProductReviewListParams = {
  page?: number
  per_page?: number
}

export type AddProductImageInput = {
  file_id: string
  alt_text?: string
  sort_order?: number
}

export type UploadFileResponse = {
  file_id: string
  file_name: string
  content_type: string
  size_bytes: number
  url: string
}

// ─── Public Products ────────────────────────────────────────

export const listProducts = (params: ProductListParams) =>
  api.get<PaginatedResponse<Product>>(endpoints.products, { params })

export const getProduct = (slug: string) =>
  api.get<SingleResponse<Product>>(`${endpoints.products}/${slug}`)

export const listProductReviews = (slug: string, params?: ProductReviewListParams) =>
  api.get<PaginatedResponse<ProductReview>>(endpoints.productReviews(slug), { params })

export const listCategories = (params?: CategoryListParams) =>
  api.get<PaginatedResponse<Category>>(endpoints.categories, { params })

// ─── Products ───────────────────────────────────────────────

export const listAdminProducts = (params: ProductListParams) =>
  api.get<PaginatedResponse<Product>>(endpoints.admin.products, { params })

export const getAdminProduct = (productId: string) =>
  api.get<SingleResponse<Product>>(`${endpoints.admin.products}/${productId}`)

export const createProduct = (data: CreateProductInput) =>
  api.post<SingleResponse<Product>>(endpoints.admin.products, data)

export const updateProduct = (productId: string, data: UpdateProductInput) =>
  api.patch<SingleResponse<Product>>(
    `${endpoints.admin.products}/${productId}`,
    data,
  )

export const updateProductStatus = (productId: string, status: ProductStatus) =>
  api.patch<SingleResponse<Product>>(
    `${endpoints.admin.products}/${productId}/status`,
    { status },
  )

export const deleteProduct = (productId: string) =>
  api.delete<{ message: string; data: null }>(
    `${endpoints.admin.products}/${productId}`,
  )

export const addProductImage = (
  productId: string,
  data: AddProductImageInput,
) =>
  api.post<SingleResponse<ProductImage>>(
    `${endpoints.admin.products}/${productId}/images`,
    data,
  )

export const deleteProductImage = (productId: string, imageId: string) =>
  api.delete<{ message: string; data: null }>(
    `${endpoints.admin.products}/${productId}/images/${imageId}`,
  )

// ─── Categories ─────────────────────────────────────────────

export const listAdminCategories = (params: CategoryListParams) =>
  api.get<PaginatedResponse<Category>>(endpoints.admin.categories, { params })

export const getAllAdminCategories = () =>
  api.get<PaginatedResponse<Category>>(endpoints.admin.categories, {
    params: { per_page: 100, status: "active" },
  })

export const getAdminCategory = (categoryId: string) =>
  api.get<SingleResponse<Category>>(
    `${endpoints.admin.categories}/${categoryId}`,
  )

export const createCategory = (data: CreateCategoryInput) =>
  api.post<SingleResponse<Category>>(endpoints.admin.categories, data)

export const updateCategory = (categoryId: string, data: UpdateCategoryInput) =>
  api.patch<SingleResponse<Category>>(
    `${endpoints.admin.categories}/${categoryId}`,
    data,
  )

export const deleteCategory = (categoryId: string) =>
  api.delete<{ message: string; data: null }>(
    `${endpoints.admin.categories}/${categoryId}`,
  )

// ─── File Upload ────────────────────────────────────────────

export const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  return api.post<SingleResponse<UploadFileResponse>>(
    endpoints.upload.file,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  )
}
