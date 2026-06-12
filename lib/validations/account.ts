import { z } from "zod"
import { passwordSchema } from "@/lib/validations/auth"

export const accountProfileSchema = z.object({
  full_name: z.string().min(3, "Name must be at least 3 characters"),
})

export const accountChangePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: passwordSchema,
})

export type AccountProfileValues = z.infer<typeof accountProfileSchema>
export type AccountChangePasswordValues = z.infer<
  typeof accountChangePasswordSchema
>
