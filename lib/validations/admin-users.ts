import { z } from "zod"
import { passwordSchema } from "@/lib/validations/auth"

export const adminUserRoleSchema = z.enum(["admin", "buyer"])
export const adminUserStatusSchema = z.enum(["active", "suspended"])

export const adminUserCreateSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(80, "Full name must be 80 characters or fewer"),
    email: z.string().trim().email("Enter a valid email"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    role_code: adminUserRoleSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"],
  })

export const adminUserEditSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(80, "Full name must be 80 characters or fewer"),
    role_code: adminUserRoleSchema,
    status: adminUserStatusSchema,
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      const hasPassword = !!data.password
      const hasConfirm = !!data.confirmPassword
      if (hasPassword || hasConfirm) {
        return hasPassword && hasConfirm && data.password === data.confirmPassword
      }
      return true
    },
    {
      message: "Password confirmation does not match",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.password) return data.password.length >= 8
      return true
    },
    {
      message: "Password must be at least 8 characters",
      path: ["password"],
    },
  )

export type AdminUserCreateValues = z.infer<typeof adminUserCreateSchema>
export type AdminUserEditValues = z.infer<typeof adminUserEditSchema>
