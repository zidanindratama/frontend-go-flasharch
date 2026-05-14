"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema, type SignInValues } from "@/lib/validations/auth";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitted, setSubmitted] = useState<SignInValues | null>(null);
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  function onSubmit(values: SignInValues) {
    setSubmitted(values);
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

      {submitted ? (
        <Alert className="border-[#39FF14]/30 bg-[#39FF14]/10">
          <Shield className="size-4 text-[#39FF14]" />
          <AlertTitle>Your details look ready</AlertTitle>
          <AlertDescription>
            This preview has not signed you in yet.
          </AlertDescription>
        </Alert>
      ) : null}

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

        <Field orientation="horizontal" className="items-start">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(checked) => {
              const nextValue = checked === true;
              setRemember(nextValue);
              form.setValue("remember", nextValue);
            }}
          />
          <div>
            <FieldLabel htmlFor="remember">Remember this device</FieldLabel>
            <FieldDescription>
              Use this only on a device you trust.
            </FieldDescription>
          </div>
        </Field>
      </FieldGroup>

      <Button type="submit" size="lg" className="h-11 w-full">
        <LockKeyhole />
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
    </form>
  );
}
