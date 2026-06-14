import { api } from "@/lib/api/axios"
import { endpoints } from "@/lib/api/endpoints"

export type BlogPostStatus = "draft" | "published" | "archived"
export type BlogCategoryStatus = "active" | "archived"

export type BlogCategory = {
  id: string
  slug: string
  name: string
  description: string
  status: BlogCategoryStatus
  created_at: string
  updated_at: string
}

export type BlogPost = {
  id: string
  category_id?: string
  category: BlogCategory
  slug: string
  title: string
  excerpt: string
  author: string
  read_minutes: number
  featured: boolean
  status: BlogPostStatus
  published_at: string | null
  html: string
  created_at: string
  updated_at: string
}

export type BlogPostListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
  status?: BlogPostStatus
  category?: string
}

export type BlogCategoryListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
  status?: BlogCategoryStatus
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

export type CreateBlogPostInput = {
  category_id: string
  slug: string
  title: string
  excerpt: string
  author: string
  read_minutes?: number
  featured?: boolean
  status?: BlogPostStatus
  published_at?: string | null
  html: string
}

export type UpdateBlogPostInput = {
  category_id?: string
  slug?: string
  title?: string
  excerpt?: string
  author?: string
  read_minutes?: number
  featured?: boolean
  status?: BlogPostStatus
  published_at?: string | null
  html?: string
}

export type CreateBlogCategoryInput = {
  slug: string
  name: string
  description?: string
  status?: BlogCategoryStatus
}

export type UpdateBlogCategoryInput = {
  slug?: string
  name?: string
  description?: string
  status?: BlogCategoryStatus
}

// ─── Public Blog Posts ──────────────────────────────────────

export const listBlogs = (params: BlogPostListParams) =>
  api.get<PaginatedResponse<BlogPost>>(endpoints.blogs, { params })

export const getBlog = (slug: string) =>
  api.get<SingleResponse<BlogPost>>(`${endpoints.blogs}/${slug}`)

export const listBlogCategories = (params: BlogCategoryListParams) =>
  api.get<PaginatedResponse<BlogCategory>>(endpoints.blogCategories, {
    params,
  })

// ─── Admin Blog Posts ───────────────────────────────────────

export const listAdminBlogs = (params: BlogPostListParams) =>
  api.get<PaginatedResponse<BlogPost>>(endpoints.admin.blogs, { params })

export const getAdminBlog = (blogId: string) =>
  api.get<SingleResponse<BlogPost>>(`${endpoints.admin.blogs}/${blogId}`)

export const createBlogPost = (data: CreateBlogPostInput) =>
  api.post<SingleResponse<BlogPost>>(endpoints.admin.blogs, data)

export const updateBlogPost = (blogId: string, data: UpdateBlogPostInput) =>
  api.patch<SingleResponse<BlogPost>>(
    `${endpoints.admin.blogs}/${blogId}`,
    data,
  )

export const updateBlogPostStatus = (
  blogId: string,
  status: BlogPostStatus,
) =>
  api.patch<SingleResponse<BlogPost>>(
    `${endpoints.admin.blogs}/${blogId}/status`,
    { status },
  )

export const deleteBlogPost = (blogId: string) =>
  api.delete<{ message: string; data: null }>(
    `${endpoints.admin.blogs}/${blogId}`,
  )

// ─── Admin Blog Categories ──────────────────────────────────

export const listAdminBlogCategories = (params: BlogCategoryListParams) =>
  api.get<PaginatedResponse<BlogCategory>>(endpoints.admin.blogCategories, {
    params,
  })

export const getAllAdminBlogCategories = () =>
  api.get<PaginatedResponse<BlogCategory>>(endpoints.admin.blogCategories, {
    params: { per_page: 100, status: "active" },
  })

export const getAdminBlogCategory = (categoryId: string) =>
  api.get<SingleResponse<BlogCategory>>(
    `${endpoints.admin.blogCategories}/${categoryId}`,
  )

export const createBlogCategory = (data: CreateBlogCategoryInput) =>
  api.post<SingleResponse<BlogCategory>>(
    endpoints.admin.blogCategories,
    data,
  )

export const updateBlogCategory = (
  categoryId: string,
  data: UpdateBlogCategoryInput,
) =>
  api.patch<SingleResponse<BlogCategory>>(
    `${endpoints.admin.blogCategories}/${categoryId}`,
    data,
  )

export const deleteBlogCategory = (categoryId: string) =>
  api.delete<{ message: string; data: null }>(
    `${endpoints.admin.blogCategories}/${categoryId}`,
  )
