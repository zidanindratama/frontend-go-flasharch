import { z } from "zod"

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const productCreateSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(80, "SKU must be 80 characters or fewer"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(180, "Slug must be 180 characters or fewer")
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens"),
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(255, "Product name must be 255 characters or fewer"),
  description: z.string(),
  base_price_amount: z
    .number()
    .int("Price must be a whole number")
    .min(0, "Price must be at least 0"),
  currency: z.string(),
  status: z.enum(["draft", "active", "archived"]),
  thumbnail_file_id: z.string().nullable(),
  category_ids: z.array(z.string()),
})

export const productEditSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(80, "SKU must be 80 characters or fewer"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(180, "Slug must be 180 characters or fewer")
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens"),
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(255, "Product name must be 255 characters or fewer"),
  description: z.string(),
  base_price_amount: z
    .number()
    .int("Price must be a whole number")
    .min(0, "Price must be at least 0"),
  currency: z.string(),
  status: z.enum(["draft", "active", "archived"]),
  thumbnail_file_id: z.string().nullable(),
  category_ids: z.array(z.string()),
})

export const categoryCreateSchema = z.object({
  parent_id: z.string().nullable(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(180, "Slug must be 180 characters or fewer")
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens"),
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(180, "Category name must be 180 characters or fewer"),
  description: z.string(),
  status: z.enum(["active", "archived"]),
})

export const categoryEditSchema = z.object({
  parent_id: z.string().nullable(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(180, "Slug must be 180 characters or fewer")
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens"),
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(180, "Category name must be 180 characters or fewer"),
  description: z.string(),
  status: z.enum(["active", "archived"]),
})

export type ProductCreateValues = z.infer<typeof productCreateSchema>
export type ProductEditValues = z.infer<typeof productEditSchema>
export type CategoryCreateValues = z.infer<typeof categoryCreateSchema>
export type CategoryEditValues = z.infer<typeof categoryEditSchema>
