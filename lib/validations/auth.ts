import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must include a letter")
  .regex(/[0-9]/, "Password must include a number");

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(80, "Full name must be 80 characters or fewer"),
    email: z.string().trim().email("Enter a valid email"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    acceptTerms: z.boolean().refine((value) => value, {
      message: "Consent is required to create an account",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email"),
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  token: z
    .string()
    .trim()
    .min(12, "Verification token is too short")
    .max(180, "Verification token is too long"),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
