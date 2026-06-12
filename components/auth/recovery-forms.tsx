"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Mail, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { usePostData } from "@/hooks/use-post-data";

export function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const forgotPassword = usePostData<{ message: string }, { email: string }>({
    endpoint: "/auth/forgot-password",
    successMessage: "Password reset OTP sent to your email",
    errorMessage: "Failed to send reset OTP",
    onSuccess: () => {
      router.push("/reset-password");
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => forgotPassword.mutate(values))}
      className="space-y-5"
    >
      <FormHeader
        label="Password recovery"
        title="Send reset OTP"
        description="Enter your account email and we will prepare a reset code."
      />

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

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full"
        disabled={forgotPassword.isPending}
      >
        {forgotPassword.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <RotateCcw />
        )}
        Send reset code
        <ArrowRight data-icon="inline-end" />
      </Button>

      <AuthLinks primaryHref="/reset-password" primaryLabel="Have OTP?" />
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPassword = usePostData<
    { message: string },
    { email: string; otp: string; new_password: string }
  >({
    endpoint: "/auth/reset-password",
    successMessage: "Password reset successful",
    errorMessage: "Failed to reset password",
    onSuccess: () => {
      router.push("/sign-in");
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        resetPassword.mutate({
          email: values.email,
          otp: values.otp,
          new_password: values.newPassword,
        }),
      )}
      className="space-y-5"
    >
      <FormHeader
        label="Reset password"
        title="Confirm OTP and new password"
        description="Use the reset code from your email and choose a new password."
      />

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
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="new-password123"
                className="pr-10"
                aria-invalid={!!form.formState.errors.newPassword}
                {...form.register("newPassword")}
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
            <FieldError errors={[form.formState.errors.newPassword]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm</FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="new-password123"
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
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full"
        disabled={resetPassword.isPending}
      >
        {resetPassword.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <KeyRound />
        )}
        Reset password
        <ArrowRight data-icon="inline-end" />
      </Button>

      <AuthLinks primaryHref="/sign-in" primaryLabel="Back to sign in" />
    </form>
  );
}

export function VerifyEmailForm() {
  const router = useRouter();
  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token: "" },
  });

  const verifyEmail = usePostData<
    { message: string },
    { token: string }
  >({
    endpoint: "/auth/verify-email",
    successMessage: "Email verified successfully",
    errorMessage: "Failed to verify email",
    onSuccess: () => {
      router.push("/sign-in");
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => verifyEmail.mutate(values))}
      className="space-y-5"
    >
      <FormHeader
        label="Email verification"
        title="Verify your email"
        description="Paste the verification token from your email to finish setup."
      />

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

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full"
        disabled={verifyEmail.isPending}
      >
        {verifyEmail.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <CheckCircle2 />
        )}
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
