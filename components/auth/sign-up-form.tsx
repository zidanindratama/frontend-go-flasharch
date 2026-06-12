"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Eye, EyeOff, Loader2, MailCheck, UserPlus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useSignUp } from "@/hooks/use-auth"
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth"

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const signUp = useSignUp()
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  async function onSubmit(values: SignUpValues) {
    signUp.mutate(
      { email: values.email, password: values.password, full_name: values.fullName },
      { onSuccess: () => setSubmitted(true) },
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <p className="text-sm font-medium text-primary">Sign up</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Save your details once, then move faster through checkout and order
          tracking.
        </p>
      </div>

      {submitted ? (
        <Alert className="border-[#39FF14]/30 bg-[#39FF14]/10">
          <MailCheck className="size-4 text-[#39FF14]" />
          <AlertTitle>Account created</AlertTitle>
          <AlertDescription>
            Check your email for the verification link.
          </AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fullName">Full name</FieldLabel>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="User Example"
            aria-invalid={!!form.formState.errors.fullName}
            {...form.register("fullName")}
          />
          <FieldError errors={[form.formState.errors.fullName]} />
        </Field>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm</FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="password123"
                className="pr-10"
                aria-invalid={!!form.formState.errors.confirmPassword}
                {...form.register("confirmPassword")}
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
            <FieldError errors={[form.formState.errors.confirmPassword]} />
          </Field>
        </div>

        <Field orientation="horizontal" className="items-start">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => {
              const nextValue = checked === true
              setAcceptTerms(nextValue)
              form.setValue("acceptTerms", nextValue, {
                shouldValidate: true,
              })
            }}
            aria-invalid={!!form.formState.errors.acceptTerms}
          />
          <div>
            <FieldLabel htmlFor="acceptTerms">
              I understand email verification is required
            </FieldLabel>
            <FieldDescription>
              Sign in stays blocked until verification token succeeds.
            </FieldDescription>
            <FieldError errors={[form.formState.errors.acceptTerms]} />
          </div>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full"
        disabled={signUp.isPending}
      >
        {signUp.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <UserPlus />
        )}
        Create account
        <ArrowRight data-icon="inline-end" />
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary">
          Sign in
        </Link>
      </p>
    </form>
  )
}
