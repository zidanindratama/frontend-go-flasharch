"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  listAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  addProductImage,
  deleteProductImage,
  uploadFile,
  listAdminCategories,
  getAllAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type ProductListParams,
  type CategoryListParams,
  type CreateProductInput,
  type UpdateProductInput,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type ProductStatus,
} from "@/lib/api/catalog"
import { getErrorMessage } from "@/lib/api/errors"

export function useAdminProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ["admin.products", params],
    queryFn: async () => {
      const response = await listAdminProducts(params)
      return response.data
    },
  })
}

export function useAdminProduct(productId: string) {
  return useQuery({
    queryKey: ["admin.products", productId],
    queryFn: async () => {
      const response = await getAdminProduct(productId)
      return response.data.data
    },
    enabled: !!productId,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Product created")
      await queryClient.invalidateQueries({ queryKey: ["admin.products"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to create product"))
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateProductInput }) =>
      updateProduct(productId, data),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Product updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.products"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update product"))
    },
  })
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, status }: { productId: string; status: ProductStatus }) =>
      updateProductStatus(productId, status),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Status updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.products"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update status"))
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Product deleted")
      await queryClient.invalidateQueries({ queryKey: ["admin.products"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to delete product"))
    },
  })
}

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => uploadFile(file),
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to upload file"))
    },
  })
}

export function useAddProductImage(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { file_id: string; alt_text?: string; sort_order?: number }) =>
      addProductImage(productId, data),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Image added")
      await queryClient.invalidateQueries({ queryKey: ["admin.products", productId] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to add image"))
    },
  })
}

export function useDeleteProductImage(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (imageId: string) => deleteProductImage(productId, imageId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Image removed")
      await queryClient.invalidateQueries({ queryKey: ["admin.products", productId] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to remove image"))
    },
  })
}

export function useAdminCategories(params?: CategoryListParams) {
  return useQuery({
    queryKey: ["admin.categories", params],
    queryFn: async () => {
      const response = await listAdminCategories(params!)
      return response.data
    },
  })
}

export function useAllAdminCategories() {
  return useQuery({
    queryKey: ["admin.categories.all"],
    queryFn: async () => {
      const response = await getAllAdminCategories()
      return response.data.data.items
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => createCategory(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Category created")
      await queryClient.invalidateQueries({ queryKey: ["admin.categories"] })
      await queryClient.invalidateQueries({ queryKey: ["admin.categories.all"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to create category"))
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: UpdateCategoryInput }) =>
      updateCategory(categoryId, data),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Category updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.categories"] })
      await queryClient.invalidateQueries({ queryKey: ["admin.categories.all"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update category"))
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Category deleted")
      await queryClient.invalidateQueries({ queryKey: ["admin.categories"] })
      await queryClient.invalidateQueries({ queryKey: ["admin.categories.all"] })
    },
    onError: async (error: unknown) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to delete category"))
    },
  })
}
