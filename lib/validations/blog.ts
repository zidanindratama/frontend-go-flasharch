import { z } from "zod"

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const blogPostCreateSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(180, "Slug must be 180 characters or fewer")
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or fewer"),
  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt must be 500 characters or fewer"),
  author: z
    .string()
    .trim()
    .min(1, "Author is required")
    .max(180, "Author must be 180 characters or fewer"),
  read_minutes: z
    .number()
    .int()
    .min(1, "Read minutes must be at least 1"),
  featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
  published_at: z.string().nullable(),
  html: z.string(),
})

export const blogPostEditSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(180, "Slug must be 180 characters or fewer")
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or fewer"),
  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt must be 500 characters or fewer"),
  author: z
    .string()
    .trim()
    .min(1, "Author is required")
    .max(180, "Author must be 180 characters or fewer"),
  read_minutes: z
    .number()
    .int()
    .min(1, "Read minutes must be at least 1"),
  featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
  published_at: z.string().nullable(),
  html: z.string(),
})

export const blogCategoryCreateSchema = z.object({
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

export const blogCategoryEditSchema = z.object({
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

export type BlogPostCreateValues = z.infer<typeof blogPostCreateSchema>
export type BlogPostEditValues = z.infer<typeof blogPostEditSchema>
export type BlogCategoryCreateValues = z.infer<typeof blogCategoryCreateSchema>
export type BlogCategoryEditValues = z.infer<typeof blogCategoryEditSchema>
