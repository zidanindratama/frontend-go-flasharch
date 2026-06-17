"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  listAdminBlogs,
  getAdminBlog,
  createBlogPost,
  updateBlogPost,
  updateBlogPostStatus,
  deleteBlogPost,
  listAdminBlogCategories,
  getAllAdminBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  type BlogPostListParams,
  type BlogCategoryListParams,
  type CreateBlogPostInput,
  type UpdateBlogPostInput,
  type BlogPostStatus,
  type CreateBlogCategoryInput,
  type UpdateBlogCategoryInput,
} from "@/lib/api/blogs"
import { getErrorMessage } from "@/lib/api/errors"

export function useAdminBlogs(params: BlogPostListParams) {
  return useQuery({
    queryKey: ["admin.blogs", params],
    queryFn: async () => {
      const response = await listAdminBlogs(params)
      return response.data
    },
  })
}

export function useAdminBlog(blogId: string) {
  return useQuery({
    queryKey: ["admin.blogs", blogId],
    queryFn: async () => {
      const response = await getAdminBlog(blogId)
      return response.data.data
    },
    enabled: !!blogId,
  })
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBlogPostInput) => createBlogPost(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Blog post created")
      await queryClient.invalidateQueries({ queryKey: ["admin.blogs"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to create blog post"))
    },
  })
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ blogId, data }: { blogId: string; data: UpdateBlogPostInput }) =>
      updateBlogPost(blogId, data),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Blog post updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.blogs"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update blog post"))
    },
  })
}

export function useUpdateBlogPostStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ blogId, status }: { blogId: string; status: BlogPostStatus }) =>
      updateBlogPostStatus(blogId, status),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Status updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.blogs"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update status"))
    },
  })
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (blogId: string) => deleteBlogPost(blogId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Blog post deleted")
      await queryClient.invalidateQueries({ queryKey: ["admin.blogs"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to delete blog post"))
    },
  })
}

export function useAdminBlogCategories(params?: BlogCategoryListParams) {
  return useQuery({
    queryKey: ["admin.blogCategories", params],
    queryFn: async () => {
      const response = await listAdminBlogCategories(params!)
      return response.data
    },
  })
}

export function useAllAdminBlogCategories() {
  return useQuery({
    queryKey: ["admin.blogCategories.all"],
    queryFn: async () => {
      const response = await getAllAdminBlogCategories()
      return response.data.data.items
    },
  })
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBlogCategoryInput) => createBlogCategory(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Blog category created")
      await queryClient.invalidateQueries({ queryKey: ["admin.blogCategories"] })
      await queryClient.invalidateQueries({ queryKey: ["admin.blogCategories.all"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to create blog category"))
    },
  })
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: UpdateBlogCategoryInput }) =>
      updateBlogCategory(categoryId, data),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Blog category updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.blogCategories"] })
      await queryClient.invalidateQueries({ queryKey: ["admin.blogCategories.all"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update blog category"))
    },
  })
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => deleteBlogCategory(categoryId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Blog category deleted")
      await queryClient.invalidateQueries({ queryKey: ["admin.blogCategories"] })
      await queryClient.invalidateQueries({ queryKey: ["admin.blogCategories.all"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to delete blog category"))
    },
  })
}
