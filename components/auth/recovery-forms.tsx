"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, KeyRound, Mail, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  type ForgotPasswordValues,
  type ResetPasswordValues,
  type VerifyEmailValues,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <form
      onSubmit={form.handleSubmit(() => setSubmitted(true))}
      className="space-y-5"
    >
      <FormHeader
        label="Password recovery"
        title="Send reset OTP"
        description="Enter your account email and we will prepare a reset code."
      />

      {submitted ? (
        <SuccessAlert
          icon={Mail}
          title="Your email looks ready"
          description="A reset code would be sent to this address."
        />
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
          <FieldDescription>
            Use the email connected to your Go FlashArch account.
          </FieldDescription>
          <FieldError errors={[form.formState.errors.email]} />
        </Field>
      </FieldGroup>

      <Button type="submit" size="lg" className="h-11 w-full">
        <RotateCcw />
        Send reset code
        <ArrowRight data-icon="inline-end" />
      </Button>

      <AuthLinks primaryHref="/reset-password" primaryLabel="Have OTP?" />
    </form>
  );
}

export function ResetPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [otp, setOtp] = useState("");
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(() => setSubmitted(true))}
      className="space-y-5"
    >
      <FormHeader
        label="Reset password"
        title="Confirm OTP and new password"
        description="Use the reset code from your email and choose a new password."
      />

      {submitted ? (
        <SuccessAlert
          icon={CheckCircle2}
          title="Your new password looks ready"
          description="You can use it after the reset is connected."
        />
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
          <FieldLabel htmlFor="otp">OTP</FieldLabel>
          <InputOTP
            id="otp"
            maxLength={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              form.setValue("otp", value, { shouldValidate: true });
            }}
            containerClassName="w-full"
          >
            <InputOTPGroup className="grid w-full grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="size-11 w-full text-base first:rounded-l-lg last:rounded-r-lg"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription>Use 6 numeric digits.</FieldDescription>
          <FieldError errors={[form.formState.errors.otp]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="newPassword">New password</FieldLabel>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="new-password123"
              aria-invalid={!!form.formState.errors.newPassword}
              {...form.register("newPassword")}
            />
            <FieldError errors={[form.formState.errors.newPassword]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="new-password123"
              aria-invalid={!!form.formState.errors.confirmPassword}
              {...form.register("confirmPassword")}
            />
            <FieldError errors={[form.formState.errors.confirmPassword]} />
          </Field>
        </div>
      </FieldGroup>

      <Button type="submit" size="lg" className="h-11 w-full">
        <KeyRound />
        Reset password
        <ArrowRight data-icon="inline-end" />
      </Button>

      <AuthLinks primaryHref="/sign-in" primaryLabel="Back to sign in" />
    </form>
  );
}

export function VerifyEmailForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token: "" },
  });

  return (
    <form
      onSubmit={form.handleSubmit(() => setSubmitted(true))}
      className="space-y-5"
    >
      <FormHeader
        label="Email verification"
        title="Verify your email"
        description="Paste the verification token from your email to finish setup."
      />

      {submitted ? (
        <SuccessAlert
          icon={CheckCircle2}
          title="Your token looks ready"
          description="Your email would be marked as verified."
        />
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="token">Verification token</FieldLabel>
          <Input
            id="token"
            placeholder="token-00000000-0000-0000-0000-000000000002"
            aria-invalid={!!form.formState.errors.token}
            {...form.register("token")}
          />
          <FieldDescription>
            If your token has expired, request a new verification email.
          </FieldDescription>
          <FieldError errors={[form.formState.errors.token]} />
        </Field>
      </FieldGroup>

      <Button type="submit" size="lg" className="h-11 w-full">
        <CheckCircle2 />
        Verify email
        <ArrowRight data-icon="inline-end" />
      </Button>

      <AuthLinks primaryHref="/sign-in" primaryLabel="Go to sign in" />
    </form>
  );
}

function FormHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-primary">{label}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function SuccessAlert({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof CheckCircle2;
  title: string;
  description: string;
}) {
  return (
    <Alert className="border-[#39FF14]/30 bg-[#39FF14]/10">
      <Icon className="size-4 text-[#39FF14]" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

function AuthLinks({
  primaryHref,
  primaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      <Link href={primaryHref} className="font-medium text-primary">
        {primaryLabel}
      </Link>
      <span className="mx-2">/</span>
      <Link href="/sign-up" className="font-medium text-primary">
        Create account
      </Link>
    </p>
  );
}
