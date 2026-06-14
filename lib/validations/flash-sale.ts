import { z } from "zod"

export const flashSaleCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  description: z.string(),
  starts_at: z.string().min(1, "Start date is required"),
  ends_at: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.ends_at) > new Date(data.starts_at), {
  message: "End date must be after start date",
  path: ["ends_at"],
})

export const flashSaleEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  starts_at: z.string().min(1, "Start date is required"),
  ends_at: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.ends_at) > new Date(data.starts_at), {
  message: "End date must be after start date",
  path: ["ends_at"],
})

export const flashSaleItemCreateSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  sale_price_amount: z.number().min(1, "Sale price must be greater than zero"),
  currency: z.literal("IDR"),
  sale_stock_quantity: z.number().min(1, "Stock must be at least 1"),
})

export const flashSaleItemEditSchema = z.object({
  sale_price_amount: z.number().min(1, "Sale price must be greater than zero"),
  sale_stock_quantity: z.number().min(1, "Stock must be at least 1"),
})

export type FlashSaleCreateValues = z.infer<typeof flashSaleCreateSchema>
export type FlashSaleEditValues = z.infer<typeof flashSaleEditSchema>
export type FlashSaleItemCreateValues = z.infer<typeof flashSaleItemCreateSchema>
export type FlashSaleItemEditValues = z.infer<typeof flashSaleItemEditSchema>
