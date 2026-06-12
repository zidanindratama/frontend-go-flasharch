"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useSignIn } from "@/hooks/use-auth"
import { signInSchema, type SignInValues } from "@/lib/validations/auth"

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const signIn = useSignIn()
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: SignInValues) {
    signIn.mutate({ email: values.email, password: values.password })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <p className="text-sm font-medium text-primary">Sign in</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sign in to continue shopping, check your orders, and join upcoming
          flash sales.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="user@example.com"
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email")}
          />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>

        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="password123"
              className="pr-10"
              aria-invalid={!!form.formState.errors.password}
              {...form.register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <FieldError errors={[form.formState.errors.password]} />
        </Field>

      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full"
        disabled={signIn.isPending}
      >
        {signIn.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <LockKeyhole />
        )}
        Sign in
        <ArrowRight data-icon="inline-end" />
      </Button>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        className="text-center text-sm text-muted-foreground"
      >
        New buyer?{" "}
        <Link href="/sign-up" className="font-medium text-primary">
          Create account
        </Link>
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ delay: 0.05 }}
        className="text-center text-xs text-muted-foreground"
      >
        Didn&apos;t receive the email?{" "}
        <Link href="/verify-email" className="font-medium text-primary">
          Resend verification
        </Link>
      </motion.p>
    </form>
  )
}
