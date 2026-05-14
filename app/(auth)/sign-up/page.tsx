import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up | Go FlashArch",
  description:
    "Create a Go FlashArch buyer account.",
};

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
