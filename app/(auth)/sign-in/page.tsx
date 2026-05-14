import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sign In",
  description:
    "Sign in to Go FlashArch to continue checkout, track orders, and prepare for active flash sale campaigns.",
  path: "/sign-in",
  noIndex: true,
});

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
