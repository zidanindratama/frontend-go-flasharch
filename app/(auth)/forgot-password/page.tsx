import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/recovery-forms";

export const metadata: Metadata = {
  title: "Forgot Password | Go FlashArch",
  description: "Password recovery request UI for Go FlashArch.",
};

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
