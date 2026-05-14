import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Create Account",
  description:
    "Create a Go FlashArch buyer account for faster checkout, order tracking, and smoother limited-stock shopping.",
  path: "/sign-up",
  noIndex: true,
});

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Buyer sign up"
      title="Create an account for faster checkout."
      description="Save your details, track your orders, and get ready for the next flash sale."
      mode="sign-up"
    >
      <SignUpForm />
    </AuthShell>
  );
}
