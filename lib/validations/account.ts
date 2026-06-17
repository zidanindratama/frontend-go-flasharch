import { z } from "zod"
import { passwordSchema } from "@/lib/validations/auth"

export const accountProfileSchema = z.object({
  full_name: z.string().min(3, "Name must be at least 3 characters"),
})

export const accountChangePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: passwordSchema,
})

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  recipient_name: z.string().min(1, "Recipient name is required"),
  phone: z.string().min(1, "Phone is required"),
  province: z.string().min(1, "Province is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  village_code: z.string().min(1, "Village is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  address_line: z.string().min(1, "Address line is required"),
  notes: z.string().optional(),
  is_default: z.boolean().optional(),
})

export type AccountProfileValues = z.infer<typeof accountProfileSchema>
export type AccountChangePasswordValues = z.infer<
  typeof accountChangePasswordSchema
>
export type AddressValues = z.infer<typeof addressSchema>
