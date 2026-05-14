import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/recovery-forms";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Forgot Password",
  description:
    "Request a Go FlashArch password reset code and recover account access before checkout or flash sale entry.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Get back into your account."
      description="Enter your email and prepare a reset code so you can continue shopping."
      mode="recover"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
