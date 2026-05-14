import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In | Go FlashArch",
  description:
    "Sign in to your Go FlashArch account.",
};

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Auth module"
      title="Your shopping account, ready when the sale starts."
      description="Sign in to continue checkout, view orders, and keep your flash sale activity in one place."
      mode="sign-in"
    >
      <SignInForm />
    </AuthShell>
  );
}
